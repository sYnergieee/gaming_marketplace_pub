from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship

from database.db_models.game_platform import GamePlatform
from database.db_models.product import Product


class Platform(Base):
    __tablename__ = "platforms"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)

    games = relationship(GamePlatform, backref="platform", cascade="all,delete")
    products = relationship(Product, backref="platform", cascade="all,delete")
