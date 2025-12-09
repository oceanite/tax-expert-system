import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormPph21 = () => {
  const navigate = useNavigate();
  
  // State untuk input
  const [formData, setFormData] = useState({
    gaji_pokok_bulanan: '',
    tunjangan_lainnya: '0',
    iuran_jht_pegawai: '0',
    iuran_jp_pegawai: '0',
    status_ptkp: 'TK/0'
  });

  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  // Opsi PTKP sesuai rules.yaml
  const opsiPTKP = [
    "TK/0", "TK/1", "TK/2", "TK/3",
    "K/0", "K/1", "K/2", "K/3"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHitung = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Siapkan payload sesuai engine.py
    const payload = {
      gaji_pokok_bulanan: parseFloat(formData.gaji_pokok_bulanan || 0),
      tunjangan_lainnya: parseFloat(formData.tunjangan_lainnya || 0),
      iuran_jht_pegawai: parseFloat(formData.iuran_jht_pegawai || 0),
      iuran_jp_pegawai: parseFloat(formData.iuran_jp_pegawai || 0),
      status_ptkp: formData.status_ptkp
    };

    try {
      const response = await fetch("http://localhost:8000/api/pph21", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <div className="container mx-auto p-8 max-w-3xl">
      <button onClick={() => navigate('/hitung')} className="mb-4 text-blue-600 hover:underline flex items-center">&larr; Kembali</button>
      <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 pb-4 border-b">Kalkulator PPh Pasal 21</h2>
        
        <form onSubmit={handleHitung} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom Kiri: Pendapatan */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">Pendapatan</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Gaji Pokok (Sebulan)</label>
              <input type="number" name="gaji_pokok_bulanan" required value={formData.gaji_pokok_bulanan} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tunjangan Lainnya</label>
              <input type="number" name="tunjangan_lainnya" value={formData.tunjangan_lainnya} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
            </div>
          </div>

          {/* Kolom Kanan: Pengurang & Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">Pengurang & Status</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Iuran JHT (Dibayar Pegawai)</label>
              <input type="number" name="iuran_jht_pegawai" value={formData.iuran_jht_pegawai} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Iuran JP (Dibayar Pegawai)</label>
              <input type="number" name="iuran_jp_pegawai" value={formData.iuran_jp_pegawai} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status PTKP</label>
              <select name="status_ptkp" value={formData.status_ptkp} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none">
                {opsiPTKP.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="col-span-1 md:col-span-2 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-bold mt-4">
            {loading ? "Menghitung..." : "Hitung PPh 21"}
          </button>
        </form>

        {hasil && (
          <div className="mt-8 bg-blue-50 p-6 rounded-md border border-blue-200 animate-fade-in">
            <h3 className="font-bold text-blue-800 mb-4 text-lg border-b border-blue-200 pb-2">Hasil Perhitungan (Setahun)</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 mb-4">
              <span>Penghasilan Netto:</span> <span className="text-right font-mono">Rp {hasil.netto_setahun.toLocaleString('id-ID')}</span>
              <span>PKP:</span> <span className="text-right font-mono">Rp {hasil.pkp_setahun.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="bg-white p-4 rounded border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-600">Pajak Setahun:</span>
                <span className="font-mono font-bold text-lg text-blue-600">Rp {hasil.total_pajak_setahun.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Pajak Per Bulan:</span>
                <span className="font-mono text-gray-600">Rp {hasil.pajak_bulanan.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t">
                <span className="font-bold text-green-600">Gaji Bersih (Take Home Pay):</span>
                <span className="font-mono font-bold text-green-700">Rp {hasil.gaji_bersih_bulanan.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPph21;