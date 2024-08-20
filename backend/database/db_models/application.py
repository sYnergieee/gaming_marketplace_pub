from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship


class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True)
    game_name = Column(String(255), nullable=False)
    salesman_id = Column(Integer, ForeignKey('salesmans.id'))
