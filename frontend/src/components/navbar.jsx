import { Link, useLocation } from 'react-router-dom';
import '../index.css';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`) && path !== '/' ? "nav-link active" : "nav-link";

  const handleLinkClick = (path) => {
        if (location.pathname === path || (location.pathname.startsWith(`${path}/`) && path !== '/')) {
            window.scrollTo(0, 0);
        }
    };
  
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <h1 className="logo">Pajakuy ⚖️</h1>
        <div className="nav-menu">
          <Link to="/" className={isActive("/")}onClick={() => handleLinkClick('/')}>Beranda</Link>
          <Link to="/hitung" className={isActive("/hitung")}onClick={() => handleLinkClick('/hitung')}>Kalkulator Pajak</Link>
          <Link to="/referensi" className={isActive("/referensi")}onClick={() => handleLinkClick('/referensi')}>Referensi</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;