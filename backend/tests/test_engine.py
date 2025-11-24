from backend.app.engine.runner import run_engine
import json

def pretty(result: dict):
    print(json.dumps(result, indent=4, ensure_ascii=False))


# original test cases (TIDAK DIUBAH)
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
