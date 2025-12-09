const Beranda = () => {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Selamat Datang di Sistem Pakar Pajak</h2>
      <p className="text-gray-600 mb-8 text-center">
        Platform ini membantu Anda menghitung berbagai jenis pajak penghasilan dan pertambahan nilai sesuai peraturan terbaru di Indonesia.
      </p>

      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-2">PPh Pasal 21</h3>
          <p className="text-sm text-gray-700">Pajak atas penghasilan berupa gaji, upah, honorarium, tunjangan, dan pembayaran lain yang diterima Wajib Pajak Orang Pribadi dalam negeri sehubungan dengan pekerjaan atau jabatan[cite: 4].</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
          <h3 className="font-bold text-lg mb-2">PPh Pasal 23</h3>
          <p className="text-sm text-gray-700">Pajak atas penghasilan dari modal, penyerahan jasa, atau hadiah dan penghargaan, selain yang telah dipotong PPh Pasal 21[cite: 7].</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
          <h3 className="font-bold text-lg mb-2">PPh Final (Pasal 4 ayat 2)</h3>
          <p className="text-sm text-gray-700">Pajak penghasilan yang bersifat final atas jenis penghasilan tertentu seperti sewa tanah/bangunan, jasa konstruksi, dan hadiah undian[cite: 15].</p>
        </div>
        
        {/* Tambahkan penjelasan PPh 22, 15, dan PPN disini */}
      </div>
    </div>
  );
};

export default Beranda;