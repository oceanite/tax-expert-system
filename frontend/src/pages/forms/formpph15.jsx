import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../index.css";

const FormPph15 = () => {
  const navigate = useNavigate();

  // List opsi HARUS SAMA PERSIS dengan rules.yaml -> tarif_pph15_list
  const opsiPph15 = [
    "Pelayaran DN: Pengangkutan orang/barang termasuk penyewaan kapal",
    "Pelayaran DN: Imbalan yang dibayarkan/terutang ke perusahaan pelayaran DN",
    "Pelayaran/Penerbangan LN: Pengangkutan orang/barang (Non-Charter)",
    "Pelayaran/Penerbangan LN: Charter Kapal/Pesawat melalui BUT di Indonesia",
    "Kantor Perwakilan Dagang Asing (Representative Office) di Indonesia",
    "Maklon Internasional (Produksi Mainan Anak-anak)",
    "Charter Pesawat Udara (Perusahaan Penerbangan Dalam Negeri)"
  ];

  const [jenis, setJenis] = useState(opsiPph15[0]);
  const [bruto, setBruto] = useState('');
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleHitung = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/pph15", {
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
      <button onClick={() => navigate('/hitung')} className="form-back-button yellow">
        &larr; Kembali ke Pilihan Pajak
      </button>

      {/* Menggunakan class kustom baru 'form-card' dan skema warna 'yellow' */}
      <div className="form-card yellow">
        <h2 className="form-header yellow">
          Kalkulator PPh Pasal 15
        </h2>

        <form onSubmit={handleHitung} className="space-y-4">
          <div>
            <label className="form-label">Kategori Kegiatan</label>
            <select 
               value={jenis} 
               onChange={(e) => setJenis(e.target.value)} 
               className="form-input yellow" // Gunakan form-input
            >
              {opsiPph15.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Nilai Bruto / Penggantian</label>
            <input 
               type="number" 
               required 
               value={bruto} 
               onChange={(e) => setBruto(e.target.value)} 
               className="form-input yellow" // Gunakan form-input
               placeholder="Masukkan nilai rupiah..." 
            />
          </div>

          <button 
               type="submit" 
               disabled={loading} 
               className="form-submit yellow"
            >
            Hitung PPh 15
          </button>
        </form>

        {hasil && (
          <div className="form-result yellow">
            <h3 className="result-header">Hasil Perhitungan</h3>
            <div className="result-keterangan">{hasil.keterangan}</div>

            <div className="result-total yellow">
              <span className="result-label">Pajak Terutang:</span>
              <span className="result-value">
                Rp {hasil.pajak_terutang.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FormPph15;