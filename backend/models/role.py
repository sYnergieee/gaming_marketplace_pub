from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.role import Role


RoleDB = sqlalchemy_to_pydantic(Role)
