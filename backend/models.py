from pydantic import BaseModel
from typing import Literal, Optional

# --- PPH 21 INPUT & OUTPUT MODELS ---
class Pph21Input(BaseModel):
    """Model Input untuk perhitungan PPh Pasal 21 (Pegawai Tetap Bulanan)"""
    gaji_pokok_bulanan: float
    tunjangan_lainnya: float = 0.0
    iuran_jht_pegawai: float = 0.0
    iuran_jp_pegawai: float = 0.0
    memiliki_npwp: bool = True
    status_ptkp: Literal['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'] = 'TK/0'

class Pph21Output(BaseModel):
    """Model Output hasil perhitungan PPh Pasal 21"""
    pkp_setahun: float
    netto_setahun: float
    total_pajak_setahun: float
    pajak_bulanan: float
    gaji_bersih_bulanan: float

# --- PPH 23 INPUT & OUTPUT MODELS ---
class Pph23Input(BaseModel):
    """Model Input untuk perhitungan PPh Pasal 23"""
    jenis_penghasilan: Literal['dividen', 'royalti', 'jasa_teknik', 'sewa_harta']
    jumlah_bruto: float
    memiliki_npwp: bool = True

class Pph23Output(BaseModel):
    """Model Output hasil perhitungan PPh Pasal 23"""
    tarif_dasar: float
    persentase_tarif: float
    pajak_terutang: float
    keterangan: str