from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.publisher import Publisher


PublisherDB = sqlalchemy_to_pydantic(Publisher)


class PostPublisher(BaseModel):
    name: str = Field(min_length=1)
