# Sistem Pakar Pajak PPh21 – Mini TurboTax Indonesia

Proyek ini adalah sistem pakar berbasis web yang membantu pengguna menghitung pajak penghasilan (PPh21) berdasarkan aturan perpajakan Indonesia yang disederhanakan. Sistem menggunakan pendekatan **Rule-Based Expert System** dengan **inference engine forward chaining**, serta menyediakan UI interaktif mirip TurboTax.

---

## Teknologi yang Digunakan

### Backend
- **Python**
- **FastAPI** – REST API
- **Experta (PyKnow)** – Rule-based inference engine
- **YAML** – Penyimpanan rule base

### Frontend
- **React**
- **Tailwind CSS**
- **Fetch API / Axios** – Komunikasi dengan backend

---

## Fitur Utama

- Sistem Pakar berbasis aturan (**Production Rules IF–THEN**)
- Inference Engine (**Forward Chaining**)
- Calculation untuk:
  - PTKP
  - Biaya Jabatan
  - PKP / Taxable Income
  - Tarif PPh21 progresif
  - Pajak terutang
- Explanation Facility (menampilkan rule yang aktif)
- UI wizard seperti TurboTax (step-by-step)
- Responsif dan mudah digunakan

---

## Struktur Repository (Ringkas)

