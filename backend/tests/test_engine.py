from app.engine.runner import run_tax_engine

def test_engine_basic():
    inp = {
        'status': 'K1',
        'anak': 1,
        'penghasilan': 80000000,
        'iuran_pensiun': 0
    }

    out = run_tax_engine(inp)
    assert 'result' in out
    assert 'explanation' in out