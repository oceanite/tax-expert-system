from experta import KnowledgeEngine, Fact, Rule, FIELD, MATCH

class TaxFact(Fact):
    pass

class TaxEngine(KnowledgeEngine):
    @Rule(TaxFact(status='kawin', anak=MATCH.a))
    def set_ptkp_kawin(self, a):
        # contoh: deklarasi fakta baru
        self.declare(TaxFact(ptkp=58500000))
