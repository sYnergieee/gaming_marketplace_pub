from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.platform import Platform


PlatformDB = sqlalchemy_to_pydantic(Platform)


class PostPlatform(BaseModel):
    name: str = Field(min_length=1)
