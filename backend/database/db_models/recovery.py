from sqlalchemy import DateTime, Integer, String, Column, ForeignKey
from sqlalchemy.orm import relationship

from common.timezone import get_datetime
from database.base import Base
from database.db_models.user import User
from datetime import datetime


class Recovery(Base):
    __tablename__ = "recoveries"
    code = Column(String(255), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created = Column(DateTime(timezone=True), default=get_datetime)

    user = relationship(User)
