from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.key import Key
from models.user import CustProdWithCustomer


KeyDB = sqlalchemy_to_pydantic(Key)


class PostKey(BaseModel):
    product_id: int = Field(ge=1)
    code: str = Field(min_length=1)


class KeyWithCustomer(KeyDB):
    cust_prod: CustProdWithCustomer | None = None


class KeyWithCustomerSecret(KeyDB):
    cust_prod: CustProdWithCustomer | None = None

    class Config:
        orm_mode = True
        fields = {"code": {"exclude": True}}
