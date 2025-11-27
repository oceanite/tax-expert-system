from fastapi import APIRouter, HTTPException
from fastapi import Depends
from pydantic import ValidationError
from app.models.schemas import TaxInput, TaxOutput
from app.engine.runner import run_tax_engine

router = APIRouter()

@router.post("/infer", response_model=TaxOutput)
def infer_tax(payload: TaxInput):
    try:
        result = run_tax_engine(payload.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/rules")
def get_rules():
    from pathlib import Path
    p = Path(__file__).resolve().parents[2] / 'knowledge' / 'rules.yaml'
    return {"rules_path": str(p), "content": p.read_text()}