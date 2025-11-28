from pathlib import Path
import yaml
from .tax_engine import TaxEngine

RULES_PATH = Path(__file__).parent.parent / "knowledge" / "rules.yaml"

def run_engine(user_facts: dict):
    engine = TaxEngine(rules_path=RULES_PATH)
    result = engine.evaluate(user_facts)

    results = result.get("results", {})
    explanation = result.get("explanation_trace", [])

    return {
        "input": user_facts,
        "results": results,
        "explanation": explanation,
        "error": results.get("error") if "error" in results else None
    }
