// Hitung.jsx

import { useNavigate } from 'react-router-dom';
// Ikon yang digunakan
import { Calculator, Briefcase, Building, Ship, ShoppingCart, Percent, ArrowRight } from 'lucide-react';
import "../index.css";

const taxes = [
  { id: 'pph21', name: 'PPh Pasal 21', desc: 'Gaji Karyawan, Pesangon', icon: <Briefcase />, color: 'blue' },
  { id: 'pph23', name: 'PPh Pasal 23', desc: 'Jasa, Sewa Aset, Dividen', icon: <Percent />, color: 'green' },
  { id: 'pph42', name: 'PPh Pasal 4(2)', desc: 'Sewa Tanah/Bangunan, Konstruksi', icon: <Building />, color: 'purple' },
  { id: 'pph22', name: 'PPh Pasal 22', desc: 'Impor, Bendahara, Barang Mewah', icon: <Calculator />, color: 'orange' },
  { id: 'pph15', name: 'PPh Pasal 15', desc: 'Pelayaran & Penerbangan', icon: <Ship />, color: 'yellow' },
  { id: 'ppn',   name: 'PPN',          desc: 'Pertambahan Nilai (11%)', icon: <ShoppingCart />, color: 'pink' },
];

const Hitung = () => {
  const navigate = useNavigate();

  return (
    <div className="section-title">
      <h2 className="header-hitung">Pilih Jenis Pajak</h2>
        
      {/* Menggunakan tax-list untuk tata letak vertikal seperti Beranda */}
      <div className="tax-list tax-list-hitung">
        {taxes.map((tax) => (
          <a 
            key={tax.id}
            onClick={(e) => {
               e.preventDefault(); // Mencegah navigasi ganda jika ada elemen <a> lain di dalamnya
               navigate(`/hitung/${tax.id}`);
            }}
            href={`/hitung/${tax.id}`}
            // Menggunakan class tax-card + class warna
            className={`tax-card ${tax.color} tax-card-hitung`}
          >
            {/* Icon */}
            <div className="icon">
              {tax.icon}
            </div>
            {/* Text */}
            <div className="text">
              <h3>{tax.name}</h3>
              <p>{tax.desc}</p>
              {/* Mengganti tombol dengan teks link sederhana
              <p className="mt-2 text-blue-600 font-semibold text-sm hover:underline">
                Mulai Hitung &rarr;
              </p> */}
            </div>
            {/* Arrow */}
            <div className="arrow"><ArrowRight size={22} /></div>
          </a>
        ))}
      </div>

      <footer className="main-footer">
            <p className="footer-text">
              © 2025 Pajakuy - Sistem Pakar Pajak Indonesia. Semua hak dilindungi.
            </p>
      </footer>
    </div>
    
  );
};

export default Hitung;