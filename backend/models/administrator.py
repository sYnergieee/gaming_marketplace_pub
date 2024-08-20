from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.administrator import Administrator


AdministratorDB = sqlalchemy_to_pydantic(Administrator)
