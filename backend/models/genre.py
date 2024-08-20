from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.genre import Genre


GenreDB = sqlalchemy_to_pydantic(Genre)


class PostGenre(BaseModel):
    name: str = Field(min_length=1)
