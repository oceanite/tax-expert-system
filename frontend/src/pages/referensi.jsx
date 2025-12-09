const Referensi = () => {
  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Daftar Referensi & Regulasi</h2>
      <ul className="list-disc pl-5 space-y-3 text-gray-700">
        <li>
          <span className="font-semibold">Undang-Undang PPh & HPP:</span> Dasar hukum pengenaan Pajak Penghasilan di Indonesia.
        </li>
        <li>
          <a href="https://pajak.go.id/id/pph-pasal-2126" target="_blank" className="text-blue-600 hover:underline">
            Direktorat Jenderal Pajak - PPh Pasal 21 [cite: 5]
          </a>
        </li>
        <li>
          <a href="https://www.pajak.go.id/id/pemotongan-pajak-penghasilan-pasal-23" target="_blank" className="text-blue-600 hover:underline">
            Direktorat Jenderal Pajak - PPh Pasal 23 [cite: 14]
          </a>
        </li>
        <li>
          <a href="https://pajak.go.id/id/pph-pasal-4-ayat-2" target="_blank" className="text-blue-600 hover:underline">
            Direktorat Jenderal Pajak - PPh Pasal 4 Ayat 2 [cite: 23]
          </a>
        </li>
        <li>
          <a href="https://pajak.go.id/id/pph-pasal-22" target="_blank" className="text-blue-600 hover:underline">
             Direktorat Jenderal Pajak - PPh Pasal 22 [cite: 53]
          </a>
        </li>
        <li>
           <a href="https://www.pajak.go.id/id/pph-pasal-15" target="_blank" className="text-blue-600 hover:underline">
             Direktorat Jenderal Pajak - PPh Pasal 15 [cite: 79]
           </a>
        </li>
      </ul>
    </div>
  );
};

export default Referensi;