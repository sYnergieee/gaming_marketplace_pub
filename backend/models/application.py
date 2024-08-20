from pydantic import BaseModel
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.application import Application
from models.user import SalesmanUser


ApplicationDB = sqlalchemy_to_pydantic(Application)


class ApplicationFull(ApplicationDB):
    salesman: SalesmanUser
