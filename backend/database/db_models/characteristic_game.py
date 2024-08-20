from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship


class CharacteristicGame(Base):
    __tablename__ = "characteristic_games"
    game_id = Column(Integer, ForeignKey("games.id"), primary_key=True)
    characteristic_id = Column(Integer, ForeignKey(
        "characteristics.id"), primary_key=True)
    value = Column(String(255), nullable=False)
