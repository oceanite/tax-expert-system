import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormPpn = () => {
  const navigate = useNavigate();
  const [dpp, setDpp] = useState('');
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleHitung = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/ppn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dpp: parseFloat(dpp)
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
    <div className="container mx-auto p-8 max-w-xl">
      <button onClick={() => navigate('/hitung')} className="form-back-button pink">&larr; Kembali ke Pilihan Pajak</button>
      <div className="form-card pink">
        <h2 className="form-header pink">Kalkulator PPN</h2>
        
        <form onSubmit={handleHitung} className="space-y-6">
          <div>
            <label className="form-label">Dasar Pengenaan Pajak (DPP)</label>
            <div className="input-group">
              <span className="input-prefix">Rp</span>
              <input type="number" required value={dpp} onChange={(e) => setDpp(e.target.value)} className="form-input pink" placeholder="Harga Barang/Jasa..." />
            </div>
            <p className="form-helper-text">Masukkan harga sebelum pajak.</p>
          </div>

          <button type="submit" disabled={loading} className="form-submit pink">
            Hitung PPN (11%)
          </button>
        </form>

        {hasil && (
          <div className="form-result pink">
            <h3 className="result-header pink text-center">Rincian Harga</h3>
            <div className="space-y-2">
              <div className="result-detail-item">
                <span className="text-gray-600">DPP:</span>
                <span className="font-mono text-right">Rp {hasil.dpp.toLocaleString('id-ID')}</span>
              </div>
              <div className="text-right">
                <span>PPN (11%):</span>
                <span className="font-mono">+ Rp {hasil.ppn.toLocaleString('id-ID')}</span>
              </div>
              <div className="result-total pink">
                <span className="result-label text-xl">Total Bayar:</span>
                <span className="result-value text-2xl">Rp {hasil.total_harga.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPpn;