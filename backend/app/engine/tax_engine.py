from experta import KnowledgeEngine, Fact, Rule, Field, MATCH, P, TEST
import yaml

class TaxFact(Fact):
    """Generic fact for tax evaluation."""
    pass

class TaxEngine(KnowledgeEngine):
    def __init__(self, yaml_path, user_facts=None):
        super().__init__()
        self.yaml_path = yaml_path
        self.user_facts = user_facts or {}
        self.results = {}
        self.explanations = []
        self.loaded_rules = []

        self.load_rules_from_yaml()

    def add_explanation(self, text):
        self.explanations.append(text)

    def load_rules_from_yaml(self):
        with open(self.yaml_path, 'r') as file:
            data = yaml.safe_load(file)

        self.loaded_rules = data.get("rules", [])

    def declare_initial_facts(self):
        for key, value in self.user_facts.items():
            self.declare(TaxFact(**{key: value}))
            self.add_explanation(f"[INPUT] {key} = {value}")

    # ====================== TAX RATE RULES ======================

    @Rule(TaxFact(pkp=P(lambda x: x is not None and x <= 60000000)))
    def tariff_5(self):
        self.results["tax_rate"] = 0.05
        self.add_explanation("Rule: PKP ≤ 60M → Tarif 5%")

    @Rule(TaxFact(pkp=P(lambda x: 60000000 < x <= 250000000)))
    def tariff_15(self):
        self.results["tax_rate"] = 0.15
        self.add_explanation("Rule: 60M < PKP ≤ 250M → Tarif 15%")

    @Rule(TaxFact(pkp=P(lambda x: 250000000 < x <= 500000000)))
    def tariff_25(self):
        self.results["tax_rate"] = 0.25
        self.add_explanation("Rule: 250M < PKP ≤ 500M → Tarif 25%")

    @Rule(TaxFact(pkp=P(lambda x: 500000000 < x <= 5000000000)))
    def tariff_30(self):
        self.results["tax_rate"] = 0.30
        self.add_explanation("Rule: 500M < PKP ≤ 5B → Tarif 30%")

    @Rule(TaxFact(pkp=P(lambda x: x > 5000000000)))
    def tariff_35(self):
        self.results["tax_rate"] = 0.35
        self.add_explanation("Rule: PKP > 5B → Tarif 35%")

    # ====================== NON TAXABLE CASES ======================

    @Rule(TaxFact(income_type='donation', related_to_work=False))
    def donation_exempt(self):
        self.results["taxable"] = False
        self.add_explanation("Rule: Donation not job-related → NON-TAXABLE")

    @Rule(
        TaxFact(income_type=MATCH.i, via_official_institution=True),
        TEST(lambda i: i in ['zakat', 'infak', 'sedekah'])
    )
    def religious_exempt(self, i):
        self.results["taxable"] = False
        self.add_explanation(f"Rule: {i} (official institution) → NON-TAXABLE")

    @Rule(
        TaxFact(income_type=MATCH.i),
        TEST(lambda i: i in ["salary","business","interest","dividend","royalty","rental","capital_gain","insurance"])
    )
    def taxable_income(self, i):
        self.results["taxable"] = True
        self.add_explanation(f"Rule: {i} termasuk objek Pajak → TAXABLE")

    # ====================== ERROR HANDLING ======================

    @Rule(
        TaxFact(pkp=MATCH.pkp),
        TEST(lambda pkp: pkp < 0)
    )
    def invalid_pkp(self, pkp):
        self.results["error"] = "Invalid PKP input"
        self.add_explanation("ERROR: PKP tidak valid (<0)")

    # ====================== FINAL CALCULATION ======================

    @Rule()
    def compute_final_tax(self):
        if "taxable" in self.results and self.results["taxable"] is False:
            self.results["final_tax"] = 0
            self.add_explanation("Since NON-TAXABLE → final tax = 0")
        elif "tax_rate" in self.results and "pkp" in self.user_facts:
            self.results["final_tax"] = self.user_facts["pkp"] * self.results["tax_rate"]
            self.add_explanation(f"Tax = PKP × rate → {self.user_facts['pkp']} × {self.results['tax_rate']}")

    def run_engine(self):
        self.reset()
        self.declare_initial_facts()
        self.run()
        return {
            "results": self.results,
            "explanation_trace": self.explanations
        }
