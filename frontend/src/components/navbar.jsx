import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-500";

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">TaxExpert ⚖️</h1>
        <div className="space-x-6">
          <Link to="/" className={isActive("/")}>Beranda</Link>
          <Link to="/hitung" className={isActive("/hitung")}>Kalkulator Pajak</Link>
          <Link to="/referensi" className={isActive("/referensi")}>Referensi</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;