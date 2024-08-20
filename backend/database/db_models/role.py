from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship

from database.db_models.permission import Permission


class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)

    permissions = relationship(
        Permission, backref='role', cascade='all,delete')
