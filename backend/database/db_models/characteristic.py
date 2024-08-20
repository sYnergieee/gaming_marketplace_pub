from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship

from database.db_models.characteristic_game import CharacteristicGame


class Characteristic(Base):
    __tablename__ = "characteristics"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    unit = Column(String(255), nullable=True)

    games = relationship(
        CharacteristicGame, backref='characteristic', cascade="all,delete")
