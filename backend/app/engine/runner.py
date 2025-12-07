from pathlib import Path
import yaml
from .tax_engine import TaxEngine

RULES_PATH = Path(__file__).parent.parent / "knowledge" / "rules.yaml"

def run_tax_engine(user_facts: dict):
    """
    user_facts: dict berisi data transaksi/penghasilan,
    misal: {
        "wp_type": "orang_pribadi",
        "wp_residence": "dalam_negeri",
        "gaji": 10000000,
        "tunjangan": 2000000,
        "bonus": 500000,
        ...
    }
    """
    engine = TaxEngine(rules_path=RULES_PATH)
    applied_rules = engine.evaluate(user_facts)

    # Gabungkan total pajak dari semua rules yang taxable
    total_tax = sum(
        r["tax_amount"] for r in applied_rules
        if r["taxable"] and r["tax_amount"] is not None
    )

    return {
        "input": user_facts,
        "applied_rules": applied_rules,
        "total_tax": total_tax
    }
