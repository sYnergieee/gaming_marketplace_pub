from pydantic import BaseModel
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from database.db_models.status import Status


StatusDB = sqlalchemy_to_pydantic(Status)
