from pydantic import BaseModel, Field


class ChangeRecovery(BaseModel):
    code: str = Field(min_length=32)
    password: str = Field(min_length=5)