import { useNavigate } from 'react-router-dom';
import { Calculator, Briefcase, Building, Ship, ShoppingCart, Percent } from 'lucide-react';

const taxes = [
  { id: 'pph21', name: 'PPh Pasal 21', desc: 'Gaji Karyawan, Pesangon', icon: <Briefcase /> },
  { id: 'pph23', name: 'PPh Pasal 23', desc: 'Jasa, Sewa Aset, Dividen', icon: <Percent /> },
  { id: 'pph42', name: 'PPh Pasal 4(2)', desc: 'Sewa Tanah/Bangunan, Konstruksi', icon: <Building /> },
  { id: 'pph22', name: 'PPh Pasal 22', desc: 'Impor, Bendahara, Barang Mewah', icon: <Calculator /> },
  { id: 'pph15', name: 'PPh Pasal 15', desc: 'Pelayaran & Penerbangan', icon: <Ship /> },
  { id: 'ppn',   name: 'PPN',           desc: 'Pertambahan Nilai (11%)', icon: <ShoppingCart /> },
];

const Hitung = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-8 text-center">Pilih Jenis Pajak</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taxes.map((tax) => (
          <div 
            key={tax.id}
            onClick={() => navigate(`/hitung/${tax.id}`)}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 flex flex-col items-center text-center hover:border-blue-400"
          >
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4">
              {tax.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{tax.name}</h3>
            <p className="text-gray-500 text-sm">{tax.desc}</p>
            <button className="mt-4 text-blue-600 font-semibold text-sm hover:underline">
              Mulai Hitung &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hitung;