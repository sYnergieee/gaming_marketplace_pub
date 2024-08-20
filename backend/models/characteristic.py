from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.characteristic import Characteristic


CharacteristicDB = sqlalchemy_to_pydantic(Characteristic)


class PostCharacteristic(BaseModel):
    name: str = Field(min_length=1)
    unit: str | None = None
