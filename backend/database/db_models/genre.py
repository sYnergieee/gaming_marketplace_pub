from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship

from database.db_models.game_genre import GameGenre


class Genre(Base):
    __tablename__ = "genres"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)

    games = relationship(GameGenre, backref='genre', cascade="all,delete")
