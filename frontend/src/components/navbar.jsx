import { Link, useLocation } from 'react-router-dom';
import '../index.css';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <h1 className="logo">TaxExpert ⚖️</h1>
        <div className="nav-menu">
          <Link to="/" className={isActive("/")}>Beranda</Link>
          <Link to="/hitung" className={isActive("/hitung")}>Kalkulator Pajak</Link>
          <Link to="/referensi" className={isActive("/referensi")}>Referensi</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;