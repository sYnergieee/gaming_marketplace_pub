from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from database.db_models.product import Product
from models.key import KeyWithCustomer, KeyWithCustomerSecret
from models.platform import PlatformDB
from models.user import SalesmanUser


ProductDB = sqlalchemy_to_pydantic(Product)


class PostProduct(BaseModel):
    name: str = Field(min_length=1)
    price: int = Field(ge=1)
    game_id: int = Field(ge=1)
    description: str = Field(min_length=1)
    platform_id: int = Field(ge=1)


class PutProduct(BaseModel):
    id: int = Field(ge=1)
    name: str = Field(min_length=1)
    price: int = Field(ge=1)
    game_id: int = Field(ge=1)
    description: str = Field(min_length=1)


class PutProductAdmin(PutProduct):
    product_status_id: int = Field(ge=5, le=6)


class ProductWithoutSalesman(ProductDB):
    count_neg_review_not_proc: int
    in_stock: dict
    platform: PlatformDB


class FullProduct(ProductDB):
    count_neg_review_not_proc: int
    in_stock: dict
    salesmans: SalesmanUser
    platform: PlatformDB
