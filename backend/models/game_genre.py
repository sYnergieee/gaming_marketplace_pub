from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database.db_models.game_genre import GameGenre
from models.genre import GenreDB


GameGenreDB = sqlalchemy_to_pydantic(GameGenre)

class GetGameGenre(GameGenreDB):
    genre: GenreDB