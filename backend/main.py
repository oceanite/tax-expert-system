from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Tax Expert System API")

class TaxInput(BaseModel):
    status: str
    anak: int
    penghasilan: float
    iuran_pensiun: float = 0.0

@app.post("/infer")
def infer_tax(data: TaxInput):
    # sementara: dummy response (ganti dengan engine call)
    return {
        "result": {"pkp": 0, "pajak": 0},
        "explanation": ["engine not yet connected"]
    }
