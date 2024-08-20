from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship
from database.db_models.characteristic_game import CharacteristicGame
from database.db_models.game_genre import GameGenre
from database.db_models.game_platform import GamePlatform
from database.db_models.product import Product
from database.db_models.publisher import Publisher
from common.phrases import *
from common.consts import *

from datetime import datetime


class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    release_date = Column(DateTime, nullable=False)
    img = Column(String(255), default=NOIMG_GAME, nullable=True)

    publisher_id = Column(Integer, ForeignKey("publishers.id"))

    publishers = relationship(Publisher, backref="game")
    platforms = relationship(GamePlatform, backref="game", cascade="all,delete")
    characteristics = relationship(
        CharacteristicGame, backref="game", cascade="all,delete"
    )
    genres = relationship(GameGenre, backref="game", cascade="all,delete")
    products = relationship(Product, backref="game", cascade="all,delete")
