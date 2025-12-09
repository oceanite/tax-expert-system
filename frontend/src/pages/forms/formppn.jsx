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
      <button onClick={() => navigate('/hitung')} className="mb-4 text-blue-600 hover:underline flex items-center">&larr; Kembali</button>
      <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-pink-500">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 pb-4 border-b">Kalkulator PPN</h2>
        
        <form onSubmit={handleHitung} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Dasar Pengenaan Pajak (DPP)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">Rp</span>
              <input type="number" required value={dpp} onChange={(e) => setDpp(e.target.value)} className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-pink-500 outline-none" placeholder="Harga Barang/Jasa..." />
            </div>
            <p className="text-xs text-gray-400 mt-1">Masukkan harga sebelum pajak.</p>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition font-bold">
            Hitung PPN (11%)
          </button>
        </form>

        {hasil && (
          <div className="mt-8 bg-gray-50 p-6 rounded-md border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg text-center">Rincian Harga</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">DPP:</span>
                <span className="font-mono">Rp {hasil.dpp.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-pink-600 font-bold">
                <span>PPN (11%):</span>
                <span className="font-mono">+ Rp {hasil.ppn.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-xl font-bold">
                <span>Total Bayar:</span>
                <span className="font-mono">Rp {hasil.total_harga.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPpn;