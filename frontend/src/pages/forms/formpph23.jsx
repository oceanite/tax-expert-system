import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormPph23 = () => {
  const navigate = useNavigate();
  
  // Mapping Label (User Friendly) -> Value (Sesuai rules.yaml/engine.py)
  const opsiPph23 = [
    { label: "Dividen", value: "dividen" },
    { label: "Bunga", value: "bunga" },
    { label: "Royalti", value: "royalti" },
    { label: "Hadiah & Penghargaan", value: "hadiah" },
    { label: "Sewa & Penghasilan Lain", value: "sewa" },
    { label: "Jasa Teknik", value: "jasa_teknik" },
    { label: "Jasa Manajemen", value: "jasa_manajemen" },
    { label: "Jasa Konsultan", value: "jasa_konsultan" },
    { label: "Jasa Lainnya", value: "jasa_lainnya" }
  ];

  const [jenis, setJenis] = useState(opsiPph23[0].value);
  const [bruto, setBruto] = useState('');
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleHitung = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/pph23", {
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
      <button onClick={() => navigate('/hitung')} className="form-back-button green">
        &larr; Kembali ke Pilihan Pajak
      </button>
      
      {/* Menggunakan class kustom 'form-card' dan skema warna 'green' */}
      <div className="form-card green">
        <h2 className="form-header green">
          Kalkulator PPh Pasal 23
        </h2>
        
        <form onSubmit={handleHitung} className="space-y-4">
          <div>
            <label className="form-label">Jenis Penghasilan</label>
            <select value={jenis} onChange={(e) => setJenis(e.target.value)} className="form-input green">
              {opsiPph23.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Jumlah Bruto (Rp)</label>
            <div className="input-group">
                <span className="input-prefix">Rp</span>
            <input type="number" required value={bruto} onChange={(e) => setBruto(e.target.value)} className="form-input green" placeholder="Contoh: 10000000" />
          </div>
          </div>

          <button type="submit" disabled={loading} className="form-submit green">
            {loading ? "Menghitung..." : "Hitung PPh 23"}
          </button>
        </form>

        {hasil && (
          <div className="form-result green">
            <h3 className="result-header green">Hasil Perhitungan</h3>
            <p className="result-keterangan">{hasil.keterangan}</p>
             
            <div className="result-total green">
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

export default FormPph23;