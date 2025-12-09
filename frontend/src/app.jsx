import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Komponen Layout
import Navbar from './components/navbar';
import ScrollToTop from './components/ScrollToTop';

// Import Halaman Utama
import Beranda from './pages/beranda';
import Hitung from './pages/hitung';
import Referensi from './pages/referensi';

// Import Halaman Form Perhitungan
// (Pastikan file-file ini sudah dibuat, lihat langkah 3 untuk contoh isinya)
import FormPph21 from './pages/forms/formpph21';
import FormPph23 from './pages/forms/formpph23';
import FormPph42 from './pages/forms/formpph42';
import FormPph22 from './pages/forms/formpph22';
import FormPph15 from './pages/forms/formpph15';
import FormPpn from './pages/forms/formppn';

function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Container utama dengan min-height agar footer (jika ada) turun ke bawah */}
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        
        {/* Navbar akan selalu muncul di setiap halaman */}
        <Navbar />

        {/* Area konten yang berubah-ubah sesuai URL */}
        <main className="fade-in-enter">
          <Routes>
            {/* Route Halaman Utama */}
            <Route path="/" element={<Beranda />} />
            <Route path="/hitung" element={<Hitung />} />
            <Route path="/referensi" element={<Referensi />} />

            {/* Route Detail Perhitungan */}
            <Route path="/hitung/pph21" element={<FormPph21 />} />
            <Route path="/hitung/pph23" element={<FormPph23 />} />
            <Route path="/hitung/pph42" element={<FormPph42 />} />
            <Route path="/hitung/pph22" element={<FormPph22 />} />
            <Route path="/hitung/pph15" element={<FormPph15 />} />
            <Route path="/hitung/ppn" element={<FormPpn />} />

            {/* Route 404 (Jika halaman tidak ditemukan) */}
            <Route path="*" element={
              <div className="text-center mt-20">
                <h1 className="text-4xl font-bold text-gray-300">404</h1>
                <p className="text-gray-500">Halaman tidak ditemukan</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;