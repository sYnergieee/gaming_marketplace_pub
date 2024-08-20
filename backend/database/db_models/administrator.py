from sqlalchemy import Integer, Column, ForeignKey
from sqlalchemy.orm import relationship

from database.base import Base


class Administrator(Base):
    __tablename__ = "administrators"
    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
