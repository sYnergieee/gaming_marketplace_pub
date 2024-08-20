from sqlalchemy import Integer, Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from database.base import Base
from common.phrases import *
from common.consts import *
from database.db_models.application import Application


class Salesman(Base):
    __tablename__ = "salesmans"
    id = Column(Integer, ForeignKey("users.id"), primary_key=True)

    applications = relationship(Application, backref="salesman", cascade="all,delete")

    @hybrid_property
    def info_salesman(self):
        d = {
            "Количество продаж": 0,
            "Заработано без учета комиссии": 0,
            "Заработано с учетом комиссии": 0,
            "Хороших отзывов": 0,
            "Плохих отзывов": 0,
        }
        for prod in self.product:
            for key in prod.keys:
                if key.is_used == True:
                    if key.cust_prod.customer_status_id == STATUS_C_P_POS_REVIEW:
                        d["Хороших отзывов"] += 1
                    elif (
                        key.cust_prod.customer_status_id == STATUS_C_P_NEG_REVIEW_PROC
                        or key.cust_prod.customer_status_id
                        == STATUS_C_P_NEG_REVIEW_NOT_PROC
                    ):
                        d["Плохих отзывов"] += 1
                    d["Количество продаж"] += 1
                    d["Заработано без учета комиссии"] += prod.price
                    d["Заработано с учетом комиссии"] += prod.price * CONST_COMISSION
        d["Заработано с учетом комиссии"] = int(d["Заработано с учетом комиссии"])
        return d
