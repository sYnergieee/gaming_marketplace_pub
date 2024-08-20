from common.timezone import get_datetime
from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db_models.customer import Customer
from sqlalchemy.orm import backref

from database.db_models.status import Status


class CustomerProduct(Base):
    __tablename__ = "customer_products"
    key_id = Column(Integer, ForeignKey("keys.id"), primary_key=True)
    review = Column(Text, nullable=True)
    purshase_date = Column(DateTime(timezone=True), default=get_datetime)

    customer_id = Column(Integer, ForeignKey("customers.id"))
    customer_status_id = Column(Integer, ForeignKey("statuses.id"))

    statuses = relationship(Status, backref="cust_prod", cascade="all,delete")
    customers = relationship(
        Customer, backref=backref("cust_prod", cascade="all,delete")
    )
