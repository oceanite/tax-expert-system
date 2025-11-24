from pydantic import BaseModel, Field
from typing import List, Optional

class TaxInput(BaseModel):
    status: str = Field(..., description="Status PTKP: TK0, K0, K1, dst.")
    anak: int = Field(0, ge=0)
    penghasilan: float = Field(..., ge=0)
    iuran_pensiun: Optional[float] = Field(0.0, ge=0)

class TaxResult(BaseModel):
    ptkp: float
    pkp: float
    pajak: float

class TaxOutput(BaseModel):
    result: TaxResult
    explanation: List[str]