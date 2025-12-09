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
      <button onClick={() => navigate('/hitung')} className="mb-4 text-blue-600 hover:underline flex items-center">&larr; Kembali</button>
      <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-green-500">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4">Kalkulator PPh Pasal 23</h2>
        
        <form onSubmit={handleHitung} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Jenis Penghasilan</label>
            <select value={jenis} onChange={(e) => setJenis(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none">
              {opsiPph23.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Jumlah Bruto (Rp)</label>
            <input type="number" required value={bruto} onChange={(e) => setBruto(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none" placeholder="Contoh: 10000000" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-bold mt-2">
            Hitung PPh 23
          </button>
        </form>

        {hasil && (
          <div className="mt-8 bg-green-50 p-6 rounded-md border border-green-200">
            <h3 className="font-bold text-green-800 mb-2 text-lg">Hasil Perhitungan</h3>
            <p className="text-gray-600 mb-4 text-sm">{hasil.keterangan}</p>
            
            <div className="flex justify-between items-center border-t border-green-200 pt-2">
              <span className="text-gray-800 font-bold">Pajak Terutang:</span>
              <span className="font-mono font-bold text-2xl text-green-700">
                Rp {hasil.pajak_terutang.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
              Tarif: {(hasil.tarif * 100)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPph23;