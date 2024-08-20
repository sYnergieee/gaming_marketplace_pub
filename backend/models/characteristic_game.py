from pydantic import BaseModel
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.characteristic_game import CharacteristicGame
from models.characteristic import CharacteristicDB


CharacteristicGameDB = sqlalchemy_to_pydantic(CharacteristicGame)


class GetCharacteristicGame(CharacteristicGameDB):
    characteristic: CharacteristicDB
