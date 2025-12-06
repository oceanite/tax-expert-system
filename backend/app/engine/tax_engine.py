import yaml

# ----- Contoh fungsi pajak khusus -----
def calculate_pph21(gaji=0, tunjangan=0, bonus=0):
    return (gaji + tunjangan + bonus) * 0.05

def calculate_pph23(income_amount=0):
    return income_amount * 0.15

def calculate_pph4_2(income_amount=0):
    return income_amount * 0.2

def calculate_pph_badan(income_amount=0):
    return income_amount * 0.25

class TaxEngine:
    def __init__(self, rules_path):
        with open(rules_path, "r") as f:
            self.rules = yaml.safe_load(f).get("rules", [])

    def _eval_condition(self, condition: str, facts: dict):
        """Evaluates rule condition with extended context"""
        context = {}
        for k, v in facts.items():
            context[k] = v
            context[k.upper()] = v

        context.update({"true": True, "false": False, "True": True, "False": False})
        try:
            return bool(eval(condition, {}, context))
        except Exception:
            return False

    def _apply_action(self, action: dict, facts: dict):
        """Apply action from rule and return tax amount if formula exists"""
        result = {
            "taxable": action.get("taxable", True),
            "final": action.get("final", False),
            "tax_amount": None
        }

        formula = action.get("formula")
        if formula:
            local_vars = dict(facts)
            local_vars.update({
                "calculate_pph21": calculate_pph21,
                "calculate_pph23": calculate_pph23,
                "calculate_pph4_2": calculate_pph4_2,
                "calculate_pph_badan": calculate_pph_badan
            })
            try:
                # formula bisa berupa assignment (exec) atau expression (eval)
                if "=" in formula:
                    exec(formula, {}, local_vars)
                    # cari variabel "tax" kalau ada
                    result["tax_amount"] = local_vars.get("tax", None)
                else:
                    result["tax_amount"] = eval(formula, {}, local_vars)
            except Exception as e:
                result["tax_amount"] = None
                print(f"Error evaluating formula '{formula}': {e}")

        return result

    def evaluate(self, user_facts: dict):
        """Run rule evaluation and return list of applied rules with tax"""
        facts = dict(user_facts)
        applied_rules = []

        for rule in self.rules:
            cond = rule.get("condition", "")
            if cond and not self._eval_condition(cond, facts):
                continue

            action = rule.get("action", {})
            result = self._apply_action(action, facts)
            applied_rules.append({
                "rule_id": rule.get("id"),
                "description": rule.get("description"),
                **result
            })

        return applied_rules
