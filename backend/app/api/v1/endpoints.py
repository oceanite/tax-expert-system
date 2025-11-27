from fastapi import APIRouter
from app.engine.runner import run_tax_engine
from app.models.schemas import TaxInput, TaxOutput

router = APIRouter()

@router.post("/calculate", response_model=TaxOutput)
def calculate_tax(payload: TaxInput):
    data = payload.dict()
    result = run_tax_engine(data)
    return result
