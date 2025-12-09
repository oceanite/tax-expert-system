import pytest
from engine import calculate_pph15, calculate_pph21, calculate_pph22, calculate_pph23, calculate_pph42, calculate_ppn

# --- Test Case PPh 21 ---

def test_pph21_standar():
    """Gaji 10jt, TK/0. Expect PKP 60jt, Pajak 3jt."""
    data = {
        "gaji_pokok_bulanan": 10000000.0, 
        "tunjangan_lainnya": 0.0,
        "iuran_jht_pegawai": 0.0,
        "iuran_jp_pegawai": 0.0,
        "status_ptkp": "TK/3"
    }
    res = calculate_pph21(data)
    assert "error" not in res
    assert res['pkp_setahun'] == 46500000.0
    assert res['total_pajak_setahun'] == 2325000
    print(res)

def test_pph21_kecil():
    """Gaji 4jt (dibawah PTKP). Pajak harus 0."""
    data = {
        "gaji_pokok_bulanan": 4000000.0,
        "status_ptkp": "TK/1"
    }
    res = calculate_pph21(data)
    assert res['total_pajak_setahun'] == 0
    print(res)

# --- Test Case PPh 23 ---

def test_pph23_dividen():
    """Dividen 10jt, Tarif 15%."""
    data = {
        "jenis_penghasilan": "dividen",
        "jumlah_bruto": 10000000.0
    }
    res = calculate_pph23(data)
    assert res['tarif'] == 0.15
    assert res['pajak_terutang'] == 1500000.0
    print(res)

def test_pph23_jasa():
    """Jasa Teknik 5jt, Tarif 2%."""
    data = {
        "jenis_penghasilan": "jasa_teknik",
        "jumlah_bruto": 5000000.0
    }
    res = calculate_pph23(data)
    assert res['tarif'] == 0.02
    assert res['pajak_terutang'] == 100000.0
    print(res)

def test_pph23_invalid():
    """Input ngawur."""
    data = {
        "jenis_penghasilan": "kripto_ilegal",
        "jumlah_bruto": 1000000.0
    }
    res = calculate_pph23(data)
    assert res['pajak_terutang'] == 0.0
    print(res)

def test_pph42_sewa_tanah():
    """
    Kasus: Sewa Kantor.
    Objek: Persewaan Tanah dan/atau Bangunan.
    Tarif: 10%
    Bruto: 100.000.000
    Ekspektasi Pajak: 10.000.000
    """
    data = {
        "jenis_penghasilan": "Persewaan Tanah dan/atau Bangunan",
        "jumlah_bruto": 100000000.0
    }
    res = calculate_pph42(data)
    
    assert "error" not in res
    assert res['tarif'] == 0.10
    assert res['pajak_terutang'] == 10000000.0

def test_pph42_undian():
    """
    Kasus: Menang Undian Bank.
    Objek: Hadiah Undian.
    Tarif: 25%
    Bruto: 5.000.000
    Ekspektasi Pajak: 1.250.000
    """
    data = {
        "jenis_penghasilan": "Hadiah Undian",
        "jumlah_bruto": 5000000.0
    }
    res = calculate_pph42(data)
    
    assert res['tarif'] == 0.25
    assert res['pajak_terutang'] == 1250000.0

def test_pph42_konstruksi_kecil():
    """
    Kasus: Kontraktor Kecil memperbaiki rumah.
    Objek: Konstruksi: Pelaksana (Kualifikasi Kecil / Orang Perseorangan).
    Tarif: 1.75%
    Bruto: 200.000.000
    Ekspektasi Pajak: 3.500.000
    """
    data = {
        # String harus PERSIS sama dengan di rules.yaml
        "jenis_penghasilan": "Konstruksi: Pelaksana (Kualifikasi Kecil / Orang Perseorangan)",
        "jumlah_bruto": 200000000.0
    }
    res = calculate_pph42(data)
    
    assert res['tarif'] == 0.0175
    assert res['pajak_terutang'] == 3500000.0

def test_pph42_umkm_nol_persen():
    """
    Kasus: UMKM Perorangan dengan omzet dibawah 500jt.
    Objek: UMKM OP Peredaran Bruto s.d 500 Juta (PP 55 - 0%).
    Tarif: 0%
    Bruto: 450.000.000
    Ekspektasi Pajak: 0
    """
    data = {
        "jenis_penghasilan": "UMKM OP Peredaran Bruto s.d 500 Juta (PP 55 - 0%)",
        "jumlah_bruto": 450000000.0
    }
    res = calculate_pph42(data)
    
    assert res['tarif'] == 0.0
    assert res['pajak_terutang'] == 0.0

def test_pph42_bunga_obligasi():
    """
    Kasus: Investor DN menerima bunga obligasi.
    Objek: Bunga Obligasi (WP DN & BUT - Tarif Rendah).
    Tarif: 10%
    Bruto: 10.000.000
    Ekspektasi Pajak: 1.000.000
    """
    data = {
        "jenis_penghasilan": "Bunga Obligasi (WP DN & BUT - Tarif Rendah)",
        "jumlah_bruto": 10000000.0
    }
    res = calculate_pph42(data)
    
    assert res['tarif'] == 0.10
    assert res['pajak_terutang'] == 1000000.0

def test_pph42_invalid_input():
    """Menguji jika string jenis penghasilan salah/typo."""
    data = {
        "jenis_penghasilan": "Sewa Planet Mars", # Tidak ada di list
        "jumlah_bruto": 10000000.0
    }
    res = calculate_pph42(data)
    
    # Berdasarkan logic engine terakhir, jika tidak match, tarif & pajak 0
    # dan keterangan berisi pesan error/tidak ditemukan
    assert res['pajak_terutang'] == 0.0
    assert "Tidak ditemukan" in res.get('keterangan', '') or "tidak valid" in res.get('keterangan', '')

def test_pph22_impor_api():
    """
    Kasus: Impor dengan API (Tarif 2.5%).
    Bruto: 100.000.000
    Ekspektasi Pajak: 2.500.000
    """
    data = {
        "jenis_penghasilan": "Impor (Importir memiliki API)",
        "jumlah_bruto": 100000000.0
    }
    res = calculate_pph22(data)
    
    assert "error" not in res
    assert res['tarif'] == 0.025
    assert res['pajak_terutang'] == 2500000.0

def test_pph22_impor_non_api():
    """
    Kasus: Impor tanpa API (Tarif 7.5%).
    Bruto: 10.000.000
    Ekspektasi Pajak: 750.000
    """
    data = {
        "jenis_penghasilan": "Impor (Importir tidak memiliki API)",
        "jumlah_bruto": 10000000.0
    }
    res = calculate_pph22(data)
    
    assert res['tarif'] == 0.075
    assert res['pajak_terutang'] == 750000.0

def test_pph22_pembelian_bumn():
    """
    Kasus: Pembelian oleh BUMN/Badan Usaha Tertentu.
    Tarif: 1.5%
    Bruto: 50.000.000
    Ekspektasi Pajak: 750.000
    """
    data = {
        "jenis_penghasilan": "Pembelian barang dan/atau bahan oleh BUMN/Badan Usaha Tertentu",
        "jumlah_bruto": 50000000.0
    }
    res = calculate_pph22(data)
    
    assert res['tarif'] == 0.015
    assert res['pajak_terutang'] == 750000.0

def test_pph22_barang_sangat_mewah():
    """
    Kasus: Penjualan Pesawat Pribadi.
    Objek: Barang Sangat Mewah: Pesawat/Kapal Pesiar/...
    Tarif: 5%
    Bruto: 1.000.000.000
    Ekspektasi Pajak: 50.000.000
    """
    data = {
        "jenis_penghasilan": "Penjualan Barang Sangat Mewah: Pesawat/Kapal Pesiar/Yacht/Kendaraan Bermotor",
        "jumlah_bruto": 1000000000.0
    }
    res = calculate_pph22(data)
    
    assert res['tarif'] == 0.05
    assert res['pajak_terutang'] == 50000000.0

def test_pph22_aset_kripto_setor_sendiri():
    """
    Kasus: Penghasilan Aset Kripto (Setor Sendiri Umum).
    Tarif: 0.1%
    Bruto: 200.000.000
    Ekspektasi Pajak: 200.000
    """
    data = {
        "jenis_penghasilan": "Penghasilan Aset Kripto (Setor Sendiri - Umum)",
        "jumlah_bruto": 200000000.0
    }
    res = calculate_pph22(data)
    
    assert res['tarif'] == 0.001
    assert res['pajak_terutang'] == 200000.0


def test_pph15_pelayaran_dn():
    """
    Kasus: Perusahaan Pelayaran Dalam Negeri.
    Tarif: 1.2%
    Bruto: 100.000.000
    Ekspektasi Pajak: 1.200.000
    """
    data = {
        "jenis_penghasilan": "Pelayaran DN: Pengangkutan orang/barang termasuk penyewaan kapal",
        "jumlah_bruto": 100000000.0
    }
    res = calculate_pph15(data)
    
    assert "error" not in res
    assert res['tarif'] == 0.012
    assert res['pajak_terutang'] == 1200000.0

def test_pph15_penerbangan_ln():
    """
    Kasus: Maskapai Luar Negeri (Charter via BUT).
    Tarif: 2.64%
    Bruto: 200.000.000
    Ekspektasi Pajak: 5.280.000
    """
    data = {
        "jenis_penghasilan": "Pelayaran/Penerbangan LN: Charter Kapal/Pesawat melalui BUT di Indonesia",
        "jumlah_bruto": 200000000.0
    }
    res = calculate_pph15(data)
    
    assert res['tarif'] == 0.0264
    assert res['pajak_terutang'] == 5280000.0

def test_pph15_kantor_perwakilan():
    """
    Kasus: Kantor Perwakilan Dagang Asing.
    Tarif: 0.44%
    Bruto: 500.000.000 (Nilai Ekspor Bruto)
    Ekspektasi Pajak: 2.200.000
    """
    data = {
        "jenis_penghasilan": "Kantor Perwakilan Dagang Asing (Representative Office) di Indonesia",
        "jumlah_bruto": 500000000.0
    }
    res = calculate_pph15(data)
    
    assert res['tarif'] == 0.0044
    assert res['pajak_terutang'] == 2200000.0

def test_pph15_maklon_mainan():
    """
    Kasus: Maklon Internasional Mainan Anak.
    Tarif: 2.1%
    Bruto: 50.000.000
    Ekspektasi Pajak: 1.050.000
    """
    data = {
        "jenis_penghasilan": "Maklon Internasional (Produksi Mainan Anak-anak)",
        "jumlah_bruto": 50000000.0
    }
    res = calculate_pph15(data)
    
    assert res['tarif'] == 0.021
    assert res['pajak_terutang'] == 1050000.0

def test_pph15_charter_pesawat_dn():
    """
    Kasus: Charter Pesawat Penerbangan DN.
    Tarif: 1.8%
    Bruto: 100.000.000
    Ekspektasi Pajak: 1.800.000
    """
    data = {
        "jenis_penghasilan": "Charter Pesawat Udara (Perusahaan Penerbangan Dalam Negeri)",
        "jumlah_bruto": 100000000.0
    }
    res = calculate_pph15(data)
    
    assert res['tarif'] == 0.018
    assert res['pajak_terutang'] == 1800000.0


def test_ppn_standar():
    """
    Kasus: Pembelian Elektronik.
    DPP: 10.000.000
    Tarif: 11%
    Ekspektasi PPN: 1.100.000
    Ekspektasi Total: 11.100.000
    """
    data = {"dpp": 10000000.0}
    res = calculate_ppn(data)
    
    assert "error" not in res
    assert res['ppn'] == 1100000.0
    assert res['total_harga'] == 11100000.0

def test_ppn_desimal():
    """
    Kasus: DPP Desimal.
    DPP: 1.500.500
    Tarif: 11% -> 165.055
    """
    data = {"dpp": 1500500.0}
    res = calculate_ppn(data)
    
    assert res['ppn'] == 165055.0 # math.floor
    assert res['total_harga'] == 1665555.0