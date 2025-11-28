from backend.app.engine.runner import run_engine
import json

def pretty(result: dict):
    print(json.dumps(result, indent=4, ensure_ascii=False))

print("\n=== Test 1 ===")
pretty(run_engine({
    "pkp": 50000000,
    "income_type": "salary"
}))

print("\n=== Test 2 ===")
pretty(run_engine({
    "pkp": 120000000,
    "income_type": "business"
}))

print("\n=== Test 3 ===")
pretty(run_engine({
    "income_type": "zakat",
    "via_official_institution": True
}))

print("\n=== Test 4 ===")
pretty(run_engine({
    "pkp": -1000000
}))

print("\n=== Test 5 ===")
pretty(run_engine({
    "income_type": "hibah_keluarga"
}))

print("\n=== Test 6 ===")
pretty(run_engine({
    "income_type": "warisan"
}))

print("\n=== Test 7 ===")
pretty(run_engine({
    "income_type": "beasiswa"
}))

print("\n=== Test 8 ===")
pretty(run_engine({
    "expense_type": "biaya_operasional",
    "bruto_income": 100000000,
    "expense_amount": 20000000
}))

print("\n=== Test 9 ===")
pretty(run_engine({
    "expense_type": "biaya_pribadi",
    "bruto_income": 100000000,
    "expense_amount": 20000000
}))

print("\n=== Test 10 ===")
pretty(run_engine({
    "taxpayer_type": "badan",
    "year": 2024
}))

print("\n=== Test 11 ===")
pretty(run_engine({
    "taxpayer_type": "badan",
    "year": 2008
}))

print("\n=== Test 12 ===")
pretty(run_engine({
    "foreign_tax_paid": True
}))

print("\n=== Test 13 ===")
pretty(run_engine({
    "pkp": 300000000,
    "income_type": "salary",
    "expense_type": "biaya_operasional",
    "bruto_income": 500000000,
    "expense_amount": 100000000
}))

print("\n=== Test 14 ===")
pretty(run_engine({
    "pkp": 999999999999,
    "income_type": "zakat",
    "via_official_institution": True
}))
