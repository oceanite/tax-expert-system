import { Link } from "react-router-dom";
import "../index.css";
import { Award, Briefcase, Building, Calculator, FileText, Globe, Percent, ShoppingCart } from "lucide-react";

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
          <Link to="/hitung" className="btn-primary-hero">
        <div className="icon"><Calculator /></div>
            Mulai Hitung Pajak
          </Link>

          <Link to="/referensi" className="btn-outline-hero">
        <div className="icon"><FileText /></div>
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
        <div className="icon"><Briefcase size={30} /></div>
        <div className="text">
          <h3>PPh Pasal 21</h3>
          <p>
            Pajak atas penghasilan berupa gaji, upah, honorarium, tunjangan, dan pembayaran lain yang diterima oleh Wajib Pajak Orang Pribadi dalam negeri sehubungan dengan pekerjaan, jabatan, atau kegiatan.
Pemotongan dilakukan oleh pemberi kerja, bendahara pemerintah, atau pemberi penghasilan lainnya.
          </p>
        </div>
        <div className="arrow">→</div>
      </div>

      <div className="tax-card green">
        <div className="icon"><Award size={30} /></div>
        <div className="text">
          <h3>PPh Pasal 23</h3>
          <p>
            Pajak atas penghasilan dari modal, penyerahan jasa, atau hadiah dan penghargaan, selain yang telah dipotong PPh Pasal 21. 
Dipungut oleh pihak pemberi penghasilan seperti perusahaan atau instansi yang melakukan pembayaran.
          </p>
        </div>
        <div className="arrow">→</div>
      </div>

      <div className="tax-card purple">
        <div className="icon"><Building size={30} /></div>
        <div className="text">
          <h3>PPh Final (Pasal 4 ayat 2)</h3>
          <p>
            Pajak penghasilan yang bersifat final atas jenis penghasilan tertentu seperti sewa tanah/bangunan, jasa konstruksi, dan hadiah undian. Tarifnya sudah ditentukan khusus dan tidak digabung dengan penghasilan lain dalam SPT Tahunan.
          </p>
        </div>
        <div className="arrow">→</div>
      </div>

    <div className="tax-card orange">
        <div className="icon"><Percent size={30} /></div>
        <div className="text">
          <h3>PPh Pasal 22</h3>
          <p>
            Pajak penghasilan yang dipungut atas transaksi perdagangan barang tertentu, baik oleh badan pemerintah maupun pelaku usaha tertentu.
Biasanya berlaku untuk transaksi impor, penjualan barang yang tergolong sangat mewah, atau transaksi pemerintah.
Pemotongan dilakukan oleh pihak yang ditunjuk sebagai pemungut PPh 22 seperti bank devisa, bendahara pemerintah, atau badan usaha tertentu.
          </p>
        </div>
        <div className="arrow">→</div>
      </div>

      <div className="tax-card yellow">
        <div className="icon"><Globe size={30} /></div>
        <div className="text">
          <h3>PPh Pasal 15</h3>
          <p>
            Pajak penghasilan dengan perhitungan khusus untuk sektor usaha tertentu seperti pelayaran, penerbangan, dan perusahaan dagang asing. Jenis pajak ini digunakan untuk wajib pajak yang bergerak di bidang: pelayaran dan penerbangan internasional, perusahaan asuransi luar negeri, perusahaan pengeboran minyak/gas, perusahaan dagang asing.
            Tarif dan dasar pengenaannya mengikuti ketentuan khusus sesuai jenis usaha tersebut.
          </p>
        </div>
        <div className="arrow">→</div>
      </div>

      <div className="tax-card pink">
        <div className="icon"><ShoppingCart size={30} /></div>
        <div className="text">
          <h3>PPN (Pajak Pertambahan Nilai)</h3>
          <p>
            Pajak atas konsumsi barang dan jasa dalam negeri.
Pajak ini dipungut dalam setiap mata rantai produksi hingga distribusi — tetapi beban akhirnya ditanggung oleh konsumen akhir. Objek PPN meliputi: penyerahan barang kena pajak (BKP), penyerahan jasa kena pajak (JKP), impor barang, pemanfaatan BKP/JKP dari luar negeri.
Tarif umumnya 11%, dan akan naik menjadi 12% sesuai ketentuan UU HPP.
          </p>
        </div>
        <div className="arrow">→</div>
      </div>
          </div>
          </div>

      <footer className="main-footer">
            <p className="footer-text">
              © 2025 Pajakuy - Sistem Pakar Pajak Indonesia. Semua hak dilindungi.
            </p>
      </footer>
        </>
      );
    };

export default Beranda;