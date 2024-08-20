from common.timezone import get_datetime
from database.base import Base
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Column, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import backref

from database.db_models.key import Key
from database.db_models.salesman import Salesman
from database.db_models.status import Status
from common.phrases import *
from common.consts import *


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)
    published_date = Column(DateTime(timezone=True), default=get_datetime)

    game_id = Column(Integer, ForeignKey("games.id"))
    salesman_id = Column(Integer, ForeignKey("salesmans.id"))
    product_status_id = Column(Integer, ForeignKey("statuses.id"))
    platform_id = Column(Integer, ForeignKey("platforms.id"))

    salesmans = relationship(Salesman, backref=backref("product", cascade="all,delete"))
    product_statuses = relationship(Status, backref="product")
    keys = relationship(Key, backref="product", cascade="all,delete")

    @hybrid_property
    def count_neg_review_not_proc(self):
        count = 0
        for cust in self.keys:
            if cust.cust_prod:
                if cust.cust_prod.customer_status_id == STATUS_C_P_NEG_REVIEW_NOT_PROC:
                    count += 1
        return count

    @hybrid_property
    def count_review_pos(self):
        count = 0
        for cust in self.keys:
            if cust.cust_prod:
                if cust.cust_prod.customer_status_id == STATUS_C_P_POS_REVIEW:
                    count += 1
        return count

    @hybrid_property
    def in_stock(self):
        count = 0
        for k in self.keys:
            if k.is_used == False:
                count += 1
        return {"Продано": len(self.keys) - count, "В наличии": count}

    @hybrid_property
    def count_no_review(self):
        count = 0
        for cust in self.keys:
            if cust.cust_prod:
                if cust.cust_prod.customer_status_id == STATUS_C_P_NO_REVIEW:
                    count += 1
        return count
