from pydantic import BaseModel

class TaxInput(BaseModel):
    PKP: int
    income_type: str
    via_official_institution: bool | None = False
    related_to_work: bool | None = False

class TaxOutput(BaseModel):
    PKP: int | None = None
    taxable: bool | None = None
    tax_rate: float | None = None
    final_tax: float | None = None
    error: str | None = None
