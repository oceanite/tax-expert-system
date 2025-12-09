import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <button onClick={() => navigate('/hitung')} className="mb-4 text-blue-600 hover:underline flex items-center">&larr; Kembali</button>
      <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-indigo-500">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4">Kalkulator PPh Pasal 15</h2>
        
        <form onSubmit={handleHitung} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Kategori Kegiatan</label>
            <select value={jenis} onChange={(e) => setJenis(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none">
              {opsiPph15.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Nilai Bruto / Penggantian</label>
            <input type="number" required value={bruto} onChange={(e) => setBruto(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Masukkan nilai rupiah..." />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-bold mt-2">
            Hitung PPh 15
          </button>
        </form>

        {hasil && (
          <div className="mt-8 bg-indigo-50 p-6 rounded-md border border-indigo-200">
            <h3 className="font-bold text-indigo-800 mb-2 text-lg">Hasil Perhitungan</h3>
            <div className="text-sm text-gray-600 mb-4 italic">{hasil.keterangan}</div>
            
            <div className="flex justify-between items-center border-t border-indigo-200 pt-2">
              <span className="text-gray-800 font-bold">Pajak Terutang:</span>
              <span className="font-mono font-bold text-xl text-indigo-700">
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