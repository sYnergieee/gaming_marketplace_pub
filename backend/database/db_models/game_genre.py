from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship


class GameGenre(Base):
    __tablename__ = "game_genres"
    game_id = Column(Integer, ForeignKey("games.id"), primary_key=True)
    genre_id = Column(Integer, ForeignKey(
        "genres.id"), primary_key=True)
