import yaml
import os

class RuleEngine:
    def __init__(self, rules_path=None):
        if rules_path is None:
            rules_path = os.path.join(os.path.dirname(__file__), "..", "knowledge", "rules.yaml")

        with open(rules_path, "r") as f:
            self.rules = yaml.safe_load(f)["rules"]

    def evaluate(self, facts: dict):
        """
        facts = {
            "PKP": int,
            "income_type": str,
            "via_official_institution": bool,
            "related_to_work": bool
        }
        """
        facts = facts.copy()
        
        for rule in self.rules:
            condition = rule["condition"]

            try:
                if eval(condition, {}, facts):
                    action = rule["action"]
                    for key, value in action.items():
                        # formula handling
                        if key == "formula":
                            facts["final_tax"] = eval(value, {}, facts)
                        else:
                            facts[key] = value
            except Exception as e:
                print(f"[ERROR evaluating rule {rule['id']}] {e}")

        return facts
