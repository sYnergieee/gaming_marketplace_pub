from sqlalchemy import Integer, String, Column, ForeignKey
from sqlalchemy.orm import relationship

from database.base import Base


class Permission(Base):
    __tablename__ = "permissions"
    role_id = Column(Integer, ForeignKey("roles.id"), primary_key=True)
    url = Column(String(50), primary_key=True)
