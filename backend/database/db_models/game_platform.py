from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship


class GamePlatform(Base):
    __tablename__ = "game_platforms"
    game_id = Column(Integer, ForeignKey("games.id"), primary_key=True)
    platform_id = Column(Integer, ForeignKey(
        "platforms.id"), primary_key=True)
