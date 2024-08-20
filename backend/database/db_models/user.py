from common.timezone import get_datetime
from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db_models.administrator import Administrator
from database.db_models.customer import Customer

from database.db_models.role import Role
from database.db_models.salesman import Salesman


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    nickname = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    firstname = Column(String(255), nullable=False)
    lastname = Column(String(255), nullable=False)
    birthdate = Column(DateTime, nullable=False)
    reg_date = Column(DateTime(timezone=True), default=get_datetime)
    telegram = Column(String(255), nullable=True)
    discord = Column(String(255), nullable=True)
    img = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)

    role_id = Column(Integer, ForeignKey("roles.id"))

    role = relationship(Role, backref="user")
    customers = relationship(
        Customer, backref="user", uselist=False, cascade="all,delete"
    )
    salesmans = relationship(
        Salesman, backref="user", uselist=False, cascade="all,delete"
    )
    administrators = relationship(
        Administrator, backref="user", uselist=False, cascade="all,delete"
    )
