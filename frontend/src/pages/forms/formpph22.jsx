import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormPph22 = () => {
  const navigate = useNavigate();
  
  // List opsi HARUS SAMA PERSIS dengan rules.yaml -> tarif_pph22_list
  const opsiPph22 = [
    "Impor yang dipungut Ditjen Bea dan Cukai (Tarif 10%)",
    "Impor yang dipungut Ditjen Bea dan Cukai (Tarif 7.5%)",
    "Impor yang dipungut Ditjen Bea dan Cukai (Tarif 0.5%)",
    "Impor (Importir memiliki API)",
    "Impor (Importir tidak memiliki API)",
    "Pembelian barang dan/atau bahan oleh BUMN/Badan Usaha Tertentu",
    "Pembelian Komoditas Tambang Batubara/Mineral Logam/Bukan Logam (dari pemegang IUP)",
    "Pembelian Bahan Kehutanan/Perkebunan/Pertanian/Peternakan/Perikanan (Belum Manufaktur)",
    "Penjualan hasil produksi: Industri Semen",
    "Penjualan hasil produksi: Industri Baja",
    "Penjualan hasil produksi: Industri Otomotif (kepada distributor)",
    "Penjualan hasil produksi: Industri Farmasi",
    "Penjualan hasil produksi: Industri Kertas",
    "Penjualan Kendaraan Bermotor (ATPM/APM/Importir Umum)",
    "Penjualan Emas Batangan",
    "Penjualan Pelumas oleh Importir/Produsen",
    "Penjualan Pulsa dan Kartu Perdana (Penyelenggara Distribusi Tingkat II)",
    "Penjualan BBM oleh Pertamina/Anak Perusahaan (Non-Final)",
    "Penjualan BBM oleh Badan Usaha selain Pertamina (Non-Final)",
    "Penjualan BBG oleh Produsen/Importir (Non-Final)",
    "Penjualan BBM oleh Pertamina/Anak Perusahaan (Final)",
    "Penjualan BBM oleh Badan Usaha selain Pertamina (Final)",
    "Penjualan BBG oleh Produsen/Importir (Final)",
    "Transaksi melalui SI Pengadaan (Sistem Informasi Pengadaan)",
    "Penjualan Barang Sangat Mewah: Pesawat/Kapal Pesiar/Yacht/Kendaraan Bermotor",
    "Penjualan Barang Sangat Mewah: Rumah/Apartemen/Kondominium",
    "Ekspor Komoditas Tambang Batubara/Mineral Logam/Bukan Logam",
    "Penghasilan Aset Kripto (Dipungut Penyelenggara/Setor Sendiri)",
    "Penghasilan Aset Kripto (Setor Sendiri - Umum)"
  ];

  const [jenis, setJenis] = useState(opsiPph22[0]);
  const [bruto, setBruto] = useState('');
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleHitung = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/pph22", {
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
    <div className="container mx-auto p-8 max-w-3xl">
      <button onClick={() => navigate('/hitung')} className="mb-4 text-blue-600 hover:underline flex items-center">&larr; Kembali</button>
      <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-orange-500">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4">Kalkulator PPh Pasal 22</h2>
        
        <form onSubmit={handleHitung} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Jenis Transaksi</label>
            <select value={jenis} onChange={(e) => setJenis(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none">
              {opsiPph22.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Nilai Impor / Harga Jual / Beli (Bruto)</label>
            <input type="number" required value={bruto} onChange={(e) => setBruto(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Masukkan nilai rupiah..." />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition font-bold mt-2">
            Hitung PPh 22
          </button>
        </form>

        {hasil && (
          <div className="mt-8 bg-orange-50 p-6 rounded-md border border-orange-200">
            <h3 className="font-bold text-orange-800 mb-2 text-lg">Hasil Perhitungan</h3>
            <div className="text-sm text-gray-600 mb-4 italic">{hasil.keterangan}</div>
            
            <div className="flex justify-between items-center border-t border-orange-200 pt-2">
              <span className="text-gray-800 font-bold">Pajak Terutang:</span>
              <span className="font-mono font-bold text-xl text-orange-700">
                Rp {hasil.pajak_terutang.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPph22;