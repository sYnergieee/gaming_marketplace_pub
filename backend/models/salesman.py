from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.salesman import Salesman


SalesmanDB = sqlalchemy_to_pydantic(Salesman)


class FullSalesman(SalesmanDB):
    info_salesman: dict
