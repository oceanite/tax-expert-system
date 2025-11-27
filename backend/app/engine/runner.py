from app.engine.tax_engine import TaxEngine
from pathlib import Path
import yaml

RULES_PATH = Path(__file__).parent.parent / "knowledge" / "rules.yaml"


def load_rules():
    with open(RULES_PATH, "r") as f:
        return yaml.safe_load(f)


def run_engine(user_facts: dict):
    rules = load_rules()
    engine = TaxEngine(yaml_path=RULES_PATH, user_facts=user_facts)

    result = engine.run_engine()

    return {
        "input": user_facts,
        "results": result.get("results", {}),
        "explanation": result.get("explanation_trace", []),
        "error": result.get("error")
    }
