from .tax_engine import RuleEngine

def run_tax_engine(data: dict):
    engine = RuleEngine()
    result = engine.evaluate(data)
    return result
