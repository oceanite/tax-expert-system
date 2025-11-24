from pydantic import BaseModel, ValidationError
from typing import Any

def validate_schema(schema: BaseModel, data: dict) -> Any:
    try:
        return schema(**data)
    except ValidationError as e:
        raise e
    