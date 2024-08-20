from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.game_platform import GamePlatform
from models.platform import PlatformDB


GamePlatformDB = sqlalchemy_to_pydantic(GamePlatform)

class GetGamePlatform(GamePlatformDB):
    platform: PlatformDB