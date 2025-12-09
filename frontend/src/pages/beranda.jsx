import { Link } from "react-router-dom";
import "../index.css";

const Beranda = () => {
  return (
    <>
      <section className="hero-container">
        <h1 className="hero-title">
          Sistem Pakar <span>Pajak Indonesia</span>
        </h1>

        <p className="hero-description">
          Biar urusan negara gak nge-<span>ghosting</span>.
        </p>
        <div className="hero-buttons">
          <Link to="hitung" className="btn-primary-hero">
            <span className="icon">🧮</span>
            Mulai Hitung Pajak
          </Link>

          <Link to="/referensi" className="btn-outline-hero">
            <span className="icon">📄</span>
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </section>
    
    <div className="section-title">
      <h2>Jenis-Jenis Pajak</h2>
      <p>
        Pelajari berbagai jenis pajak yang berlaku di Indonesia dan cara menghitungnya dengan benar.
      </p>

      <div className="tax-list">
      <div className="tax-card blue">
        <div className="icon">🎁</div>
        <div className="text">
          <h3>PPh Pasal 21</h3>
          <p>
            Pajak atas penghasilan berupa gaji, upah, honorarium, tunjangan, dan pembayaran lain yang diterima Wajib Pajak Orang Pribadi dalam negeri sehubungan dengan pekerjaan atau jabatan.
          </p>
        </div>
        <div className="arrow">→</div>
      </div>

      <div className="tax-card green">
        <div className="icon">🎁</div>
        <div className="text">
          <h3>PPh Pasal 23</h3>
          <p>
            Pajak atas penghasilan dari modal, penyerahan jasa, atau hadiah dan penghargaan, selain yang telah dipotong PPh Pasal 21.
          </p>
        </div>
        <div className="arrow">→</div>
      </div>

      <div className="tax-card purple">
        <div className="icon">📄</div>
        <div className="text">
          <h3>PPh Final (Pasal 4 ayat 2)</h3>
          <p>
            Pajak penghasilan yang bersifat final atas jenis penghasilan tertentu seperti sewa tanah/bangunan, jasa konstruksi, dan hadiah undian.
          </p>
        </div>
        <div className="arrow">→</div>
      </div>
    </div>

            
            {/* Tambahkan penjelasan PPh 22, 15, dan PPN disini */}
          </div>
        </>
      );
    };

export default Beranda;