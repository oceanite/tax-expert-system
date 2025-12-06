from backend.app.engine.runner import run_tax_engine
import json

def pretty(result: dict):
    print(json.dumps(result, indent=4, ensure_ascii=False))


print("\n=== Test 1: PPh21 orang pribadi dalam negeri ===")
pretty(run_tax_engine({
    "wp_type": "orang_pribadi",
    "wp_residence": "dalam_negeri",
    "gaji": 10000000,
    "tunjangan": 2000000,
    "bonus": 500000
}))

print("\n=== Test 2: PPh23 atas dividen ===")
pretty(run_tax_engine({
    "income_type": "dividen",
    "income_amount": 5000000
}))

print("\n=== Test 3: PPh4(2) final transaksi saham ===")
pretty(run_tax_engine({
    "income_type": "transaksi_saham",
    "income_amount": 10000000
}))

print("\n=== Test 4: PPh22 impor API ===")
pretty(run_tax_engine({
    "transaction_type": "impor",
    "importer_api": True,
    "nilai_impor": 100000000
}))

print("\n=== Test 5: PPh22 penjualan rumah > 10M & luas > 500m2 ===")
pretty(run_tax_engine({
    "product_type": "rumah",
    "harga_jual": 12000000000,
    "luas_bangunan": 600
}))

print("\n=== Test 6: PPh22 kendaraan roda 4 > 5M & silinder > 3000cc ===")
pretty(run_tax_engine({
    "product_type": "kendaraan",
    "harga_jual": 6000000000,
    "kapasitas_silinder": 3500
}))

print("\n=== Test 7: PPh15 charter penerbangan dalam negeri ===")
pretty(run_tax_engine({
    "category": "charter_penerbangan_dalam_negeri",
    "peredaran_bruto": 500000000
}))

print("\n=== Test 8: PPN untuk PKP ===")
pretty(run_tax_engine({
    "wp_type": "PKP",
    "harga_bkp_jkp": 100000000
}))

print("\n=== Test 9: PPnBM atas barang mewah ===")
pretty(run_tax_engine({
    "barang_type": "mewah",
    "harga_barang": 500000000,
    "tarif_ppnbm": 0.25
}))

print("\n=== Test 10: PPh Badan atas penghasilan kena pajak ===")
pretty(run_tax_engine({
    "taxpayer_type": "badan",
    "income_type": "penghasilan",
    "income_amount": 200000000
}))

print("\n=== Test 11: Pengecualian zakat via lembaga resmi ===")
pretty(run_tax_engine({
    "income_type": "zakat",
    "via_official_institution": True
}))

print("\n=== Test 12: Pengecualian warisan ===")
pretty(run_tax_engine({
    "income_type": "warisan"
}))

print("\n=== Test 13: Pengecualian hibah keluarga ===")
pretty(run_tax_engine({
    "income_type": "hibah_keluarga"
}))

print("\n=== Test 14: Pengecualian beasiswa ===")
pretty(run_tax_engine({
    "income_type": "beasiswa"
}))

print("\n=== Test 15: PPh22 emas perhiasan ===")
pretty(run_tax_engine({
    "gold_type": "perhiasan",
    "harga_jual": 100000000
}))
