import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const incomeTypes = [
    // Kena pajak (R8)
    "salary",
    "business",
    "interest",
    "dividend",
    "royalty",
    "rental",
    "capital_gain",
    "insurance",

    // Bukan objek pajak
    "donation",                  // R6
    "zakat", "infak", "sedekah", // R7
    "warisan",                   // R12
    "hibah_keluarga",            // R13
    "hibah_badan_keagamaan",
    "hibah_badan_pendidikan",
    "hibah_badan_sosial",
    "beasiswa",                  // R14
  ];

  const [form, setForm] = useState({
    PKP: "",
    income_type: "salary",
    via_official_institution: false,
    related_to_work: false,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      PKP: Number(form.PKP),
      income_type: form.income_type,
      via_official_institution: form.via_official_institution,
      related_to_work: form.related_to_work,
    };

    try {
      const resp = await fetch(API_BASE + "/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setResult(await resp.json());
    } catch (err) {
      setResult({ error: "Cannot connect to backend" });
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">🧾 Tax Expert System</h1>

        <form onSubmit={submit} className="flex flex-col gap-4">

          {/* PKP */}
          <div>
            <label className="font-medium">PKP (Penghasilan Kena Pajak)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Contoh: 75000000"
              value={form.PKP}
              onChange={(e) => setForm({ ...form, PKP: e.target.value })}
              required
            />
          </div>

          {/* Income Type */}
          <div>
            <label className="font-medium">Jenis Penghasilan</label>
            <select
              className="w-full border rounded px-3 py-2 mt-1"
              value={form.income_type}
              onChange={(e) => setForm({ ...form, income_type: e.target.value })}
            >
              {incomeTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional: via_official_institution */}
          {["zakat", "infak", "sedekah"].includes(form.income_type) && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.via_official_institution}
                onChange={(e) =>
                  setForm({ ...form, via_official_institution: e.target.checked })
                }
              />
              <label>Disalurkan melalui lembaga resmi?</label>
            </div>
          )}

          {/* Conditional: related_to_work */}
          {form.income_type === "donation" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.related_to_work}
                onChange={(e) =>
                  setForm({ ...form, related_to_work: e.target.checked })
                }
              />
              <label>Sumbangan terkait pekerjaan?</label>
            </div>
          )}

          <button
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Menghitung..." : "Hitung Pajak"}
          </button>
        </form>

        {/* Output */}
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h2 className="font-semibold mb-2">Hasil Perhitungan:</h2>
            <pre className="text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
