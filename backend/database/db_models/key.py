from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship

from database.db_models.customer_product import CustomerProduct


class Key(Base):
    __tablename__ = "keys"
    id = Column(Integer, primary_key=True)
    code = Column(String(1024), nullable=False)
    is_used = Column(Boolean, default=False, nullable=True)

    product_id = Column(Integer, ForeignKey("products.id"))

    cust_prod = relationship(CustomerProduct, backref="key", uselist=False, cascade="all,delete")
