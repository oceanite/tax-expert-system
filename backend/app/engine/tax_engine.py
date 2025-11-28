import yaml

class TaxEngine:
    def __init__(self, rules_path):
        with open(rules_path, "r") as f:
            self.rules = yaml.safe_load(f).get("rules", [])

    def _eval_condition(self, condition: str, facts: dict):
        """Evaluates rule condition with extended context"""
        context = {}

        # alias lowercase → uppercase and vice versa
        for k, v in facts.items():
            context[k] = v
            context[k.upper()] = v

        # support booleans written as true/false
        context.update({
            "true": True, "false": False,
            "True": True, "False": False
        })

        try:
            return bool(eval(condition, {}, context))
        except Exception:
            return False

    def _apply_action(self, action: dict, facts: dict):
        """Apply action from rule"""
        for key, val in action.items():

            # formula rules (exec) — supports assignment and expressions
            if key == "formula":
                local_vars = {}
                # expose PKP & others in exec context
                for k, v in facts.items():
                    local_vars[k] = v
                    local_vars[k.upper()] = v

                exec(val, {}, local_vars)

                # update any changed variable back to facts
                for k, v in local_vars.items():
                    facts[k] = v

                continue

            # normal rule — store action result
            facts[key] = val

    def evaluate(self, user_facts: dict):
        """Run rule evaluation and return result + trace explanation"""
        facts = dict(user_facts)
        trace = []

        for rule in self.rules:
            cond = rule.get("condition", "")
            if cond and self._eval_condition(cond, facts):
                self._apply_action(rule.get("action", {}), facts)
                trace.append(rule["id"])

        return {
            "results": facts,
            "explanation_trace": trace
        }
