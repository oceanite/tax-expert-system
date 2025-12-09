import yaml
import math
from experta import KnowledgeEngine, Fact, Field, Rule, P, AS
import os

# --- Load Rules Configuration ---
RULES_CONFIG = {}
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    yaml_path = os.path.join(base_dir, "rules.yaml")
    
    with open(yaml_path, "r") as f:
        data = yaml.safe_load(f)
        if data and 'rules_perpajakan' in data:
            RULES_CONFIG = data['rules_perpajakan']
            print(f"DEBUG: Sukses load rules.yaml dari {yaml_path}")
        else:
            print("DEBUG: Format rules.yaml salah, menggunakan default.")

except FileNotFoundError:
    print("DEBUG: rules.yaml tidak ditemukan, menggunakan default.")
  #  RULES_CONFIG = DEFAULT_RULES

# --- Experta Facts Definition ---
class Pph21Fact(Fact):
    """Fakta PPh 21 untuk Pegawai Tetap"""
    gaji_pokok_bulanan = Field(float, default=0.0)
    tunjangan_lainnya = Field(float, default=0.0)
    iuran_jht_pegawai = Field(float, default=0.0)
    iuran_jp_pegawai = Field(float, default=0.0)
    status_ptkp = Field(str, default='TK/0')

class Pph23Fact(Fact):
    """Fakta PPh 23 untuk Jasa/Modal"""
    jenis_penghasilan = Field(str, mandatory=True)
    jumlah_bruto = Field(float, mandatory=True)

class Pph42Fact(Fact):
    """Fakta PPh 4(2) yang disederhanakan: user hanya memilih jenis dan memasukkan bruto."""
    jenis_penghasilan = Field(str, mandatory=True) # Nilai ini harus dipilih dari 'tarif_final_list' di rules.yaml
    jumlah_bruto = Field(float, mandatory=True)
  
class Pph22Fact(Fact):
    """Fakta PPh 22 untuk kegiatan Impor dan kegiatan usaha tertentu"""
    jenis_penghasilan = Field(str, mandatory=True) # Dipilih dari tarif_pph22_list
    jumlah_bruto = Field(float, mandatory=True)

class Pph15Fact(Fact):
    """Fakta PPh 15 untuk Pelayaran, Penerbangan, KPD, dan Maklon"""
    jenis_penghasilan = Field(str, mandatory=True)
    jumlah_bruto = Field(float, mandatory=True)

class PpnFact(Fact):
    """Fakta PPN: User menginput DPP"""
    dpp = Field(float, mandatory=True)

class Result(Fact):
    """Fakta untuk menyimpan hasil perhitungan akhir"""
    pass

# --- Helper Functions for Calculation Logic ---

def hitung_ptkp(status_ptkp: str) -> float:
    config = RULES_CONFIG 
    # Safety get untuk menghindari crash jika key ada tapi None
    pph21_config = config.get('pph_pasal_21') or {}
    ptkp_map = pph21_config.get('ptkp_tahunan') or {}
    
    # Fallback ke default jika map kosong
  
    return float(ptkp_map.get(status_ptkp, 54000000.0))

def hitung_pajak_progresif(pkp_setahun: float) -> float:
    if pkp_setahun <= 0:
        return 0.0

    # 1. Coba ambil dari Config yang ter-load
    config = RULES_CONFIG 
    pph21_config = config.get('pph_pasal_21') or {} # Handle jika value None
    tarif_prog_config = pph21_config.get('tarif_progresif') or {} # Handle jika value None
    tarif_config = tarif_prog_config.get('lapisan', [])

    pajak_terutang = 0.0
    sisa_pkp = float(pkp_setahun)
    
    batas_bawah = 0.0
    for lapisan in tarif_config:
        tarif = float(lapisan['persentase'])
        batas_atas_raw = lapisan['batas_atas']
        
        # Hitung range lapisan
        if batas_atas_raw is not None:
            batas_atas = float(batas_atas_raw)
            batas_lapisan = batas_atas - batas_bawah
        else: 
            batas_lapisan = sisa_pkp 

        if sisa_pkp > 0:
            if batas_atas_raw is None or sisa_pkp > batas_lapisan:
                # Kena full di lapisan ini
                pkp_lapisan = batas_lapisan
                sisa_pkp -= batas_lapisan
            else:
                # Kena sebagian
                pkp_lapisan = sisa_pkp
                sisa_pkp = 0
                
            pajak_terutang += (pkp_lapisan * tarif)
            batas_bawah = batas_atas if batas_atas_raw is not None else batas_bawah 

    return pajak_terutang

def hitung_tarif_pph23(jenis_penghasilan: str, jumlah_bruto: float):
    config = RULES_CONFIG
    pph23_config = config.get('pph_pasal_23') or {}
    tarif_config = pph23_config.get('tarif_dan_objek') or {}
    
    tarif = 0.0
    if jenis_penghasilan in tarif_config.get('tarif_15_persen', []):
        tarif = 0.15
    elif jenis_penghasilan in tarif_config.get('tarif_2_persen', []):
        tarif = 0.02
    else:
        return 0.0, 0.0 
    
    pajak_terutang = jumlah_bruto * tarif
    return tarif, pajak_terutang

def hitung_tarif_pph42(fact: Pph42Fact) -> tuple[float, float, str]:
    """Menentukan tarif PPh 4(2) dan menghitung pajak berdasarkan pilihan deskriptif."""
    config = RULES_CONFIG 
    rules_42 = config.get('pph_pasal_4_ayat_2')
    
    jenis_pilihan = fact['jenis_penghasilan']
    bruto = fact['jumlah_bruto']
    
    tarif_list = rules_42.get('tarif_final_list', [])

    # Kasus khusus Bunga Koperasi (berdasarkan nominal)
    if 'bunga simpanan koperasi' in jenis_pilihan.lower():
        # Karena di list sudah dibagi menjadi dua pilihan (s.d 240.000 dan di atas 240.000), 
        # kita anggap user sudah memilih opsi yang benar berdasarkan jumlah bruto bunga simpanannya.
        pass # Lanjutkan ke lookup di bawah

    # Lookup tarif berdasarkan deskripsi yang dipilih user
    for item in tarif_list:
        if item['jenis'] == jenis_pilihan:
            tarif = item['tarif']
            pajak_terutang = bruto * tarif
            
            # Format persentase untuk keterangan
            persen = tarif * 100
            keterangan = f"Tarif PPh Final {persen:.3g}% ({tarif}) diterapkan untuk: {jenis_pilihan}."
            return tarif, pajak_terutang, keterangan
            
    # Fallback jika string tidak cocok
    return 0.0, 0.0, "Tarif tidak ditemukan. Pilihan tidak valid atau bruto 0."

def hitung_tarif_pph22(fact: Pph22Fact) -> tuple[float, float, str]:
    """Menentukan tarif PPh 22 dan menghitung pajak berdasarkan pilihan deskriptif."""
    config = RULES_CONFIG
    rules_22 = config.get('pph_pasal_22')
    
    jenis_pilihan = fact['jenis_penghasilan']
    bruto = fact['jumlah_bruto']
    
    tarif_list = rules_22.get('tarif_pph22_list', [])

    # Lookup tarif berdasarkan deskripsi yang dipilih user
    for item in tarif_list:
        if item['jenis'] == jenis_pilihan:
            tarif = item['tarif']
            pajak_terutang = bruto * tarif
            
            # Format persentase untuk keterangan
            persen = tarif * 100
            keterangan = f"Tarif PPh 22 sebesar {persen:.3g}% ({tarif}) diterapkan untuk: {jenis_pilihan}."
            return tarif, pajak_terutang, keterangan
            
    # Fallback jika string tidak cocok
    return 0.0, 0.0, "Tarif PPh 22 tidak ditemukan. Pilihan tidak valid atau bruto 0."

def hitung_tarif_pph15(fact: Pph15Fact) -> tuple[float, float, str]:
    """Menentukan tarif PPh 15 dan menghitung pajak."""
    config = RULES_CONFIG 
    rules_15 = config.get('pph_pasal_15')
    
    jenis_pilihan = fact['jenis_penghasilan']
    bruto = fact['jumlah_bruto']
    
    tarif_list = rules_15.get('tarif_pph15_list', [])

    for item in tarif_list:
        if item['jenis'] == jenis_pilihan:
            tarif = item['tarif']
            pajak_terutang = bruto * tarif
            
            persen = tarif * 100
            # Gunakan round untuk tampilan string agar rapi (misal 2.64%)
            keterangan = f"Tarif PPh 15 sebesar {persen:.3g}% ({tarif}) diterapkan untuk: {jenis_pilihan}."
            return tarif, pajak_terutang, keterangan
            
    return 0.0, 0.0, "Tarif PPh 15 tidak ditemukan. Pilihan tidak valid atau bruto 0."

# --- Knowledge Engine Implementation ---
class PphKalkulatorEngine(KnowledgeEngine):
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.output_result = None

    # --- PPH 21 RULES ---
    @Rule(AS.fact << Pph21Fact(gaji_pokok_bulanan=P(lambda x: x > 0)))
    def hitung_pph21(self, fact):
        config = RULES_CONFIG 
       
        # Safe Access + Fallback logic
        pph21_config = config.get('pph_pasal_21')
        rules_21 = pph21_config.get('perhitungan_pegawai_tetap') 
        konstanta = rules_21.get('pengurang_wajib') 
        
        bruto = fact['gaji_pokok_bulanan'] + fact['tunjangan_lainnya']
        
        bj_max = float(konstanta['biaya_jabatan']['maksimum_bulanan'])
        bj_persen = float(konstanta['biaya_jabatan']['persentase'])
        biaya_jabatan = min(bruto * bj_persen, bj_max)
        
        total_pengurang = biaya_jabatan + fact['iuran_jht_pegawai'] + fact['iuran_jp_pegawai']
        
        netto_bulanan = bruto - total_pengurang
        netto_setahun = netto_bulanan * 12
        ptkp = hitung_ptkp(fact['status_ptkp'])
        
        pkp_setahun = max(0.0, netto_setahun - ptkp)
        
        total_pajak = hitung_pajak_progresif(pkp_setahun)
        pajak_bulanan = total_pajak / 12
        gaji_bersih = bruto - pajak_bulanan - fact['iuran_jht_pegawai'] - fact['iuran_jp_pegawai']
        
        self.output_result = Result(
            pkp_setahun=math.floor(pkp_setahun),
            netto_setahun=math.floor(netto_setahun),
            total_pajak_setahun=math.floor(total_pajak),
            pajak_bulanan=math.floor(pajak_bulanan),
            gaji_bersih_bulanan=math.floor(gaji_bersih)
        )
        self.declare(self.output_result)
        
    # --- PPH 23 RULES ---
    @Rule(AS.fact << Pph23Fact(jumlah_bruto=P(lambda x: x > 0)))
    def hitung_pph23(self, fact):
        tarif, pajak = hitung_tarif_pph23(fact['jenis_penghasilan'], fact['jumlah_bruto'])
        
        self.output_result = Result(
            tarif=tarif,
            pajak_terutang=math.floor(pajak),
            keterangan=f"Pajak {int(tarif*100)}%"
        )
        self.declare(self.output_result)

    # --- PPH 4(2) RULES ---
    @Rule(AS.fact << Pph42Fact(jumlah_bruto=P(lambda x: x > 0)))
    def hitung_pph42(self, fact):
        tarif, pajak, keterangan = hitung_tarif_pph42(fact)
        
        self.output_result = Result(
            tarif=tarif,
            pajak_terutang=math.floor(pajak),
            keterangan=keterangan
        )
        self.declare(self.output_result)
    
    # --- PPH 22 RULES ---
    @Rule(AS.fact << Pph22Fact(jumlah_bruto=P(lambda x: x > 0)))
    def hitung_pph22(self, fact):
        tarif, pajak, keterangan = hitung_tarif_pph22(fact)
        
        self.output_result = Result(
            tarif=tarif,
            pajak_terutang=math.floor(pajak),
            keterangan=keterangan
        )
        self.declare(self.output_result)
    
    # --- PPH 15 RULES ---
    @Rule(AS.fact << Pph15Fact(jumlah_bruto=P(lambda x: x > 0)))
    def hitung_pph15(self, fact):
        tarif, pajak, keterangan = hitung_tarif_pph15(fact)
        pajak_final = round(pajak, 5)
        self.output_result = Result(
            tarif=tarif,
            pajak_terutang=math.floor(pajak_final),
            keterangan=keterangan
        )
        self.declare(self.output_result)
    
    @Rule(AS.fact << PpnFact(dpp=P(lambda x: x > 0)))
    def hitung_ppn(self, fact):
        config = RULES_CONFIG if RULES_CONFIG else DEFAULT_RULES
        # Ambil tarif dari config, default ke 0.11 jika tidak ada
        tarif = config.get('ppn', {}).get('tarif', 0.11)
        
        dpp = fact['dpp']
        ppn_amount = dpp * tarif
        total_harga = dpp + ppn_amount
        
        self.output_result = Result(
            dpp=dpp,
            tarif=tarif,
            ppn=math.floor(ppn_amount),
            total_harga=math.floor(total_harga),
            keterangan=f"PPN {int(tarif*100)}% dari DPP"
        )
        self.declare(self.output_result)
# --- Public Functions ---
def calculate_pph21(data: dict) -> dict:
    safe_data = data.copy()
    numeric_fields = ['gaji_pokok_bulanan', 'tunjangan_lainnya', 'iuran_jht_pegawai', 'iuran_jp_pegawai']
    for field in numeric_fields:
        if field in safe_data:
            try:
                safe_data[field] = float(safe_data[field])
            except (ValueError, TypeError):
                return {"error": f"Field {field} harus berupa angka."}

    engine = PphKalkulatorEngine()
    engine.reset()
    try:
        engine.declare(Pph21Fact(**safe_data))
        engine.run()
    except Exception as e:
        return {"error": str(e)}

    if engine.output_result:
        return engine.output_result.as_dict()
    else:
        return {"error": "Tidak ada hasil. Pastikan Gaji > 0."}

def calculate_pph23(data: dict) -> dict:
    safe_data = data.copy()
    if 'jumlah_bruto' in safe_data:
        try:
            safe_data['jumlah_bruto'] = float(safe_data['jumlah_bruto'])
        except (ValueError, TypeError):
             return {"error": "Jumlah bruto harus berupa angka."}

    engine = PphKalkulatorEngine()
    engine.reset()
    try:
        engine.declare(Pph23Fact(**safe_data))
        engine.run()
    except Exception as e:
        return {"error": str(e)}
        
    if engine.output_result:
        return engine.output_result.as_dict()
    else:
        return {"error": "Tidak ada hasil. Pastikan Bruto > 0 dan Jenis Penghasilan valid."}
    
def calculate_pph42(data: dict) -> dict:
    """Fungsi utama untuk menjalankan PPh 4(2) Engine."""
    safe_data = data.copy()
    
    # Konversi jumlah_bruto ke float
    if 'jumlah_bruto' in safe_data:
        try:
            safe_data['jumlah_bruto'] = float(safe_data['jumlah_bruto'])
        except (ValueError, TypeError):
             return {"error": "Jumlah bruto harus berupa angka."}
             
    if 'jenis_penghasilan' not in safe_data:
        return {"error": "Jenis penghasilan PPh 4(2) wajib diisi."}
    
    engine = PphKalkulatorEngine()
    engine.reset()
    try:
        # Pph42Fact sekarang hanya menerima jenis_penghasilan dan jumlah_bruto
        engine.declare(Pph42Fact(
            jenis_penghasilan=safe_data['jenis_penghasilan'], 
            jumlah_bruto=safe_data['jumlah_bruto']
        ))
        engine.run()
    except Exception as e:
        return {"error": str(e)}
        
    if engine.output_result:
        return engine.output_result.as_dict()
    else:
        return {"error": "Tidak ada hasil. Pastikan Bruto > 0 dan Jenis Penghasilan valid."}

def calculate_pph22(data: dict) -> dict:
    """Fungsi utama untuk menjalankan PPh 22 Engine."""
    safe_data = data.copy()
    
    if 'jumlah_bruto' in safe_data:
        try:
            safe_data['jumlah_bruto'] = float(safe_data['jumlah_bruto'])
        except (ValueError, TypeError):
             return {"error": "Jumlah bruto harus berupa angka."}
             
    if 'jenis_penghasilan' not in safe_data:
        return {"error": "Jenis penghasilan PPh 22 wajib diisi."}
    
    engine = PphKalkulatorEngine()
    engine.reset()
    try:
        engine.declare(Pph22Fact(
            jenis_penghasilan=safe_data['jenis_penghasilan'], 
            jumlah_bruto=safe_data['jumlah_bruto']
        ))
        engine.run()
    except Exception as e:
        return {"error": str(e)}
        
    if engine.output_result:
        return engine.output_result.as_dict()
    else:
        return {"error": "Tidak ada hasil. Pastikan Bruto > 0 dan Jenis Penghasilan valid."}

def calculate_pph15(data: dict) -> dict:
    """Fungsi utama untuk menjalankan PPh 15 Engine."""
    safe_data = data.copy()
    
    if 'jumlah_bruto' in safe_data:
        try:
            safe_data['jumlah_bruto'] = float(safe_data['jumlah_bruto'])
        except (ValueError, TypeError):
             return {"error": "Jumlah bruto harus berupa angka."}
             
    if 'jenis_penghasilan' not in safe_data:
        return {"error": "Jenis penghasilan PPh 15 wajib diisi."}
    
    engine = PphKalkulatorEngine()
    engine.reset()
    try:
        engine.declare(Pph15Fact(
            jenis_penghasilan=safe_data['jenis_penghasilan'], 
            jumlah_bruto=safe_data['jumlah_bruto']
        ))
        engine.run()
    except Exception as e:
        return {"error": str(e)}
        
    if engine.output_result:
        return engine.output_result.as_dict()
    else:
        return {"error": "Tidak ada hasil. Pastikan Bruto > 0 dan Jenis Penghasilan valid."}

def calculate_ppn(data: dict) -> dict:
    """Fungsi utama untuk menghitung PPN."""
    safe_data = data.copy()
    
    if 'dpp' in safe_data:
        try:
            safe_data['dpp'] = float(safe_data['dpp'])
        except (ValueError, TypeError):
             return {"error": "DPP harus berupa angka."}
    else:
        return {"error": "Input 'dpp' wajib diisi."}
             
    engine = PphKalkulatorEngine()
    engine.reset()
    try:
        engine.declare(PpnFact(dpp=safe_data['dpp']))
        engine.run()
    except Exception as e:
        return {"error": str(e)}
        
    if engine.output_result:
        return engine.output_result.as_dict()
    else:
        return {"error": "Tidak ada hasil. Pastikan DPP > 0."}