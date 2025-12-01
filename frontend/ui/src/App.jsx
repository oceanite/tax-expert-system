import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [form, setForm] = useState({
    PKP: "",
    income_type: "salary",
    via_official_institution: false,
    related_to_work: false,
  });

  const [result, setResult] = useState(null);

  async function submit(e) {
    e.preventDefault();

    const payload = {
      PKP: Number(form.PKP),
      income_type: form.income_type,
      via_official_institution: form.via_official_institution,
      related_to_work: form.related_to_work,
    };

    const resp = await fetch(API_BASE + "/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setResult(await resp.json());
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-xl font-semibold mb-3">Tax Expert Calculator</h1>

      <form onSubmit={submit} className="flex flex-col gap-3 max-w-sm">
        <input
          className="border p-2 rounded"
          placeholder="PKP"
          value={form.PKP}
          onChange={(e) => setForm({ ...form, PKP: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={form.income_type}
          onChange={(e) => setForm({ ...form, income_type: e.target.value })}
        >
          <option value="salary">Salary</option>
          <option value="business">Business</option>
          <option value="interest">Interest</option>
          <option value="donation">Donation</option>
        </select>

        <button className="bg-blue-600 text-white px-3 py-2 rounded">
          Hitung
        </button>
      </form>

      <pre className="mt-4 bg-gray-100 p-3 rounded">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
