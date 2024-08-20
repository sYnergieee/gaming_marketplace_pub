from sqlalchemy import Integer, Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from common.consts import *
from database.base import Base


class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, ForeignKey("users.id"), primary_key=True)

    @hybrid_property
    def count_purshase(self):
        return len(self.cust_prod)
    
    @hybrid_property
    def count_reviews(self):
        c_pos = 0
        c_neg = 0
        for c_p in self.cust_prod:
            if c_p.customer_status_id == STATUS_C_P_POS_REVIEW:
                c_pos+=1
            elif c_p.customer_status_id == STATUS_C_P_NEG_REVIEW_PROC or c_p.customer_status_id == STATUS_C_P_NEG_REVIEW_NOT_PROC:
                c_neg+=1
        return {"Хороших отзывов": c_pos, "Плохих отзывов": c_neg}
                
