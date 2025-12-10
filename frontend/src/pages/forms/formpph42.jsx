import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormPph42 = () => {
  const navigate = useNavigate();

  // List opsi HARUS SAMA PERSIS dengan rules.yaml -> tarif_final_list
  const opsiPph42 = [
    "Bunga Obligasi/SUN/Obligasi Daerah (WP DN & BUT)",
    "Bunga Obligasi (WP LN)",
    "Bunga Obligasi (WP DN & BUT - Tarif Rendah)",
    "Diskonto SPN (WP DN & BUT)",
    "Diskonto SPN (WP LN)",
    "Bunga/Diskonto Obligasi dan Surat Berharga Negara (SBN) - 0%",
    "Pengalihan Hak atas Tanah dan/atau Bangunan (Umum 2.5%)",
    "Pengalihan Rumah Sederhana/Rusun Sederhana (Developer 1%)",
    "Pengalihan Tanah/Bangunan kepada Pemerintah/BUMN/BUMD (0%)",
    "Persewaan Tanah dan/atau Bangunan",
    "Bunga Tabungan/Diskonto Umum (Non-DHE), Diskonto SBI, Jasa Giro",
    "Bunga Simpanan/Tabungan Luar Negeri (melalui Bank di Indonesia)",
    "Bunga Deposito/Tabungan, Diskonto SBI, Jasa Giro (Pengecualian Tertentu 0%)",
    "Bunga Deposito DHE IDR Tenor 1 Bulan",
    "Bunga Deposito DHE IDR Tenor 3 Bulan",
    "Bunga Deposito DHE IDR Tenor 6 Bulan atau lebih",
    "Bunga Deposito DHE USD Tenor 1 Bulan",
    "Bunga Deposito DHE USD Tenor 3 Bulan",
    "Bunga Deposito DHE USD Tenor 6 Bulan",
    "Bunga Deposito DHE USD Tenor lebih dari 6 Bulan",
    "Hadiah Undian",
    "Penjualan Saham di Bursa Efek (Bukan Saham Pendiri)",
    "Penjualan Saham di Bursa Efek (Saham Pendiri)",
    "Penjualan Saham Perusahaan Modal Ventura (Tidak di Bursa)",
    "Konstruksi: Pelaksana (Kualifikasi Kecil / Orang Perseorangan)",
    "Konstruksi: Pelaksana (Non-Kualifikasi Kecil / Badan Usaha)",
    "Konstruksi: Pelaksana (Tidak Bersertifikat)",
    "Konstruksi: Terintegrasi (Bersertifikat Badan Usaha)",
    "Konstruksi: Terintegrasi (Tidak Bersertifikat Badan Usaha)",
    "Konsultansi Konstruksi (Bersertifikat Badan Usaha/Kompetensi Kerja)",
    "Konsultansi Konstruksi (Tidak Bersertifikat)",
    "Bunga Simpanan Koperasi (s.d. Rp240.000 per Bulan)",
    "Bunga Simpanan Koperasi (di atas Rp240.000 per Bulan)",
    "Dividen Diterima WP Orang Pribadi Dalam Negeri",
    "UMKM PPh Final 0.5% (PP 23/PP 55)",
    "UMKM OP Peredaran Bruto s.d 500 Juta (PP 55 - 0%)",
    "UMKM di IKN (Fasilitas PPh Final 0%)",
    "Kerja Sama dengan Lembaga Pengelola Investasi (LPI)"
  ];

  const [jenis, setJenis] = useState(opsiPph42[0]);
  const [bruto, setBruto] = useState('');
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleHitung = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/pph42", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jenis_penghasilan: jenis,
          jumlah_bruto: parseFloat(bruto)
        }),
      });
      const data = await response.json();
      if (data.error) alert(data.error);
      else setHasil(data);
    } catch (err) {
      alert("Gagal terhubung ke server backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <button onClick={() => navigate('/hitung')} className="form-back-button purple">&larr; Kembali ke Pilihan Pajak</button>
      <div className="form-card purple">
        <h2 className="form-header purple">Kalkulator PPh Pasal 4(2) Final</h2>
        
        <form onSubmit={handleHitung} className="space-y-4">
          <div>
            <label className="form-label">Jenis Penghasilan</label>
            <select value={jenis} onChange={(e) => setJenis(e.target.value)} className="form-input purple">
              {opsiPph42.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Jumlah Bruto / Transaksi</label>
            <div className="input-group">
                <span className="input-prefix">Rp</span>
            <input type="number" required value={bruto} onChange={(e) => setBruto(e.target.value)} className="form-input purple" placeholder="Masukkan nilai rupiah..." />
          </div>
          </div>

          <button type="submit" disabled={loading} className="form-submit purple">
            Hitung PPh Final
          </button>
        </form>

        {hasil && (
          <div className="form-result purple">
            <h3 className="result-header purple">Hasil Perhitungan</h3>
            <div className="result-keterangan">{hasil.keterangan}</div>
            
            <div className="result-total purple">
              <span className="result-label">Pajak Terutang:</span>
              <span className="result-value">
                Rp {hasil.pajak_terutang.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="result-tax-rate">
              Tarif: {(hasil.tarif * 100)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPph42;