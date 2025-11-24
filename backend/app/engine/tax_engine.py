from experta import KnowledgeEngine, Fact, Rule, MATCH

class TaxFact(Fact):
    pass

class TaxEngine(KnowledgeEngine):
    def __init__(self, initial_facts=None, rules=None):
        super().__init__()
        self.initial_facts = initial_facts or {}
        self.rules_loaded = rules is not None
        self.results = {}
        self.explanations = []

    def add_explanation(self, text: str):
        self.explanations.append(text)
    
    def load_initial_facts(self):
        for k, v in self.initial_facts.items():
            self.declare(TaxFact(**{k: v}))

    @Rule(TaxFact(status='TK0'))
    def ptkp_tk0(self):
        self.declare(TaxFact(ptkp=54000000))
        self.add_explanation('Rule: PTKP set for TK0 = 54,000,000')

    @Rule(TaxFact(status='K0'))
    def ptkp_k0(self):
        self.declare(TaxFact(ptkp=58500000))
        self.add_explanation('Rule: PTKP set for K0 = 58,500,000')
    
    @Rule(TaxFact(penghasilan=MATCH.p, ptkp=MATCH.ptkp))
    def compute_pkp(self, p, ptkp):
        pkp = max(0, p-ptkp)
        self.declare(TaxFact(pkp=pkp))
        self.results['pkp'] = pkp
        self.add_explanation(f'Computed PKP = {pkp}')

    @Rule(TaxFact(pkp=MATCH.pkp))
    def compute_tax_simple(self, pkp):
        pajak = pkp * 0.05
        self.results['pajak'] = pajak
        self.add_explanation(f'Applied flat 5% on PKP -> pajak {pajak}')