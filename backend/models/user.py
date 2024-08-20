import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, SecretStr
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.user import User
from models.administrator import AdministratorDB
from models.customer import CustomerDB, FullCustomer
from models.customer_product import CustomerProductDB
from models.role import RoleDB
from models.salesman import FullSalesman, SalesmanDB

UserDB = sqlalchemy_to_pydantic(User)


class UserRegister(BaseModel):
    nickname: str = Field(min_length=1)
    email: EmailStr
    firstname: str = Field(min_length=1)
    lastname: str = Field(min_length=1)
    birthdate: datetime.date
    role: str = Field(min_length=1)
    telegram: str | None = None
    discord: str | None = None
    password: str = Field(min_length=5)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=5)


class UserEdit(BaseModel):
    nickname: str = Field(min_length=1)
    email: EmailStr
    firstname: str = Field(min_length=1)
    lastname: str = Field(min_length=1)
    birthdate: datetime.date
    telegram: str | None = None
    discord: str | None = None
    password: str | None = None


class GetUsers(UserDB):
    password: str | None = None
    role: RoleDB

    class Config:
        orm_mode = True
        fields = {"password": {"exclude": True}}


class FullUser(UserDB):
    password: str | None = None
    role: RoleDB
    customers: FullCustomer | None = None
    administrators: AdministratorDB | None = None
    salesmans: FullSalesman | None = None


class SalesmanUser(SalesmanDB):
    user: UserDB


class CustomerUser(CustomerDB):
    user: UserDB


class CustProdWithCustomer(CustomerProductDB):
    customers: CustomerUser | None = None
