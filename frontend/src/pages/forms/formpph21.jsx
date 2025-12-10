import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormPph21 = () => {
  const navigate = useNavigate();
  
  // State untuk input
  const [formData, setFormData] = useState({
    gaji_pokok_bulanan: '',
    tunjangan_lainnya: '0',
    iuran_jht_pegawai: '0',
    iuran_jp_pegawai: '0',
    status_ptkp: 'TK/0'
  });

  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  // Opsi PTKP sesuai rules.yaml
  const opsiPTKP = [
    "TK/0", "TK/1", "TK/2", "TK/3",
    "K/0", "K/1", "K/2", "K/3"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHitung = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Siapkan payload sesuai engine.py
    const payload = {
      gaji_pokok_bulanan: parseFloat(formData.gaji_pokok_bulanan || 0),
      tunjangan_lainnya: parseFloat(formData.tunjangan_lainnya || 0),
      iuran_jht_pegawai: parseFloat(formData.iuran_jht_pegawai || 0),
      iuran_jp_pegawai: parseFloat(formData.iuran_jp_pegawai || 0),
      status_ptkp: formData.status_ptkp
    };

    try {
      const response = await fetch("http://localhost:8000/api/pph21", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.error) alert(data.error);
      else setHasil(data);
    } catch (err) {
      alert("Gagal terhubung ke server backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <button onClick={() => navigate('/hitung')} className="form-back-button blue">
        &larr; Kembali ke Pilihan Pajak
      </button>

      {/* Menggunakan class kustom 'form-card' dan skema warna 'blue' */}
      <div className="form-card blue">
        <h2 className="form-header blue">
          Kalkulator PPh Pasal 21
        </h2>
         
        <form onSubmit={handleHitung} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom Kiri: Pendapatan */}
          <div className="space-y-4">
            <h3 className="form-subtitle">Pendapatan</h3>
            <div>
              <label className="form-label">Gaji Pokok (Sebulan)</label>
              <div className="input-group">
                <span className="input-prefix">Rp</span>
              <input type="number" name="gaji_pokok_bulanan" required value={formData.gaji_pokok_bulanan} onChange={handleChange} className="form-input blue" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="form-label">Tunjangan Lainnya</label>
              <div className="input-group">
                <span className="input-prefix">Rp</span>
              <input type="number" name="tunjangan_lainnya" value={formData.tunjangan_lainnya} onChange={handleChange} className="form-input blue" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Pengurang & Status */}
          <div className="space-y-4">
            <h3 className="form-subtitle">Pengurang & Status</h3>
            <div>
              <label className="form-label">Iuran JHT (Dibayar Pegawai)</label>
              <div className="input-group">
                <span className="input-prefix">Rp</span>
              <input type="number" name="iuran_jht_pegawai" value={formData.iuran_jht_pegawai} onChange={handleChange} className="form-input blue" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="form-label">Iuran JP (Dibayar Pegawai)</label>
              <div className="input-group">
                <span className="input-prefix">Rp</span>
              <input type="number" name="iuran_jp_pegawai" value={formData.iuran_jp_pegawai} onChange={handleChange} className="form-input blue" placeholder="0" />
            </div>
            </div>
            <div>
              <label className="form-label">Status PTKP</label>
              <select name="status_ptkp" value={formData.status_ptkp} onChange={handleChange} className="form-input blue">
                {opsiPTKP.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="col-span-1 md:col-span-2 form-submit blue">
            {loading ? "Menghitung..." : "Hitung PPh 21"}
          </button>
        </form>

        {hasil && (
          <div className="form-result blue">
            <h3 className="result-header blue">Hasil Perhitungan (Setahun)</h3>
            <div className="result-detail">
              <span>Penghasilan Netto:</span> <span className="text-right font-mono">Rp {hasil.netto_setahun.toLocaleString('id-ID')}</span>
              <span>PKP:</span> <span className="text-right font-mono">Rp {hasil.pkp_setahun.toLocaleString('id-ID')}</span>
            </div>
             
            <div className="result-summary blue">
              <div className="flex justify-between items-center mb-2">
                <span className="result-label-summary">Pajak Per Tahun:</span>
                <span className="text-right result-value-summary">Rp {hasil.total_pajak_setahun.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="result-label-summary">Pajak Per Bulan:</span>
                <span className="result-value-summary">Rp {hasil.pajak_bulanan.toLocaleString('id-ID')}</span>
              </div>
              <div className="result-take-home-pay">
                <span className="result-label-thp">Gaji Bersih (Take Home Pay):</span>
                <span className="result-value-thp">Rp {hasil.gaji_bersih_bulanan.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPph21;