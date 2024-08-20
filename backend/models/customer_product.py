from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.customer_product import CustomerProduct


CustomerProductDB = sqlalchemy_to_pydantic(CustomerProduct)

class PostCustomerProduct(BaseModel):
    product_id: int = Field(ge=1)

class PutCustomerProduct(BaseModel):
    key_id: int = Field(ge=1)
    review: str | None = None
    customer_status_id: int = Field(ge=1, le=4)

class PutCustomerProductAdmin(PutCustomerProduct):
    customer_id: int = Field(ge=1)