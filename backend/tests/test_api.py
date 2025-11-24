from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_infer_endpoint():
    payload = {
        'status': 'K0',
        'anak': 0,
        'penghasilan': 50000000,
        'iuran_pensiun': 0
    }

    r = client.post("/api/v1/infer", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert 'result' in data
    assert 'explanation' in data