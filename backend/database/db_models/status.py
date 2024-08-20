from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship


class Status(Base):
    __tablename__ = "statuses"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
