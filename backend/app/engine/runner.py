from .tax_engine import TaxEngine
from app.core.config import settings
import yaml
from pathlib import Path

RULES_PATH = Path(settings.YAML_RULES_PATH)

def load_rules_yaml(path=RULES_PATH):
    if not path.exists():
        return {}
    with open(path, 'r') as f:
        return yaml.safe_load(f)
    

def run_tax_engine(initial_facts: dict):
    rules = load_rules_yaml()
    engine = TaxEngine(initial_facts=input_facts, rules=rules)
    engine.reset()
    engine.load_initial_facts()
    engine.run()

    ptkp = None
    for fact in engine.facts:
        try:
            if 'ptkp' in fact:
                ptkp = fact['ptkp']
        except Exception:
            pass
    result = engine.results

    final = {
        'ptkp': ptkp if ptkp is not None else 0,
        'pkp': result.get('pkp', 0),
        'pajak': result.get('pajak', 0),
    }
    return {'result': final, 'explanation': engine.explanations}

def run_tax_engine_sync(input_facts: dict):
    return run_tax_engine(input_facts)