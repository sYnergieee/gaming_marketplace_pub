from database.base import Base, Engine
from sqlalchemy.orm import Session, subqueryload
from database.db_models.customer_product import CustomerProduct
from database.db_models.game_platform import GamePlatform
from database.db_models.key import Key

from database.db_models.product import Product
from models.customer_product import PutCustomerProduct, PutCustomerProductAdmin
from common.phrases import *
from common.consts import *
from models.product import PutProduct, PutProductAdmin


class ProductHandler:
    def __init__(self) -> None:
        Base.metadata.create_all(Engine)

    def post_item(self, session: Session, item):
        session.add(item)
        session.commit()
        return True

    def delete_item(self, session: Session, item):
        if item is None:
            return False
        else:
            session.delete(item)
            session.commit()
            return True

    def put_status_key(self, session: Session, key: Key):
        key.is_used = True
        session.add(key)
        session.commit()

    def get_free_product_key(self, session: Session, product_id: int) -> int | None:
        query = (
            session.query(Key)
            .filter(Key.product_id == product_id, Key.is_used == False)
            .first()
        )
        if query:
            self.put_status_key(session, query)
            return query.id, query.code
        else:
            return None

    def put_customer_product(
        self,
        session: Session,
        customer_product: PutCustomerProduct,
        cust_prod: CustomerProduct,
    ):
        cust_prod.review = customer_product.review
        cust_prod.customer_status_id = customer_product.customer_status_id
        session.add(cust_prod)
        session.commit()
        return True

    def put_stat_customer_product(
        self, session: Session, customer_product: PutCustomerProductAdmin
    ):
        cust_prod = (
            session.query(CustomerProduct)
            .filter(
                CustomerProduct.key_id == customer_product.key_id,
            )
            .first()
        )
        cust_prod.customer_status_id = customer_product.customer_status_id
        session.add(cust_prod)
        session.commit()
        return True

    def delete_key(self, session: Session, key: Key):
        if key.is_used == False:
            return self.delete_item(session, key)
        else:
            return False

    def put_product(self, session: Session, product: PutProduct, prod: Product):
        prod.name = product.name
        prod.description = product.description
        prod.price = product.price
        session.add(prod)
        session.commit()
        return True

    def put_stat_product(self, session: Session, product: PutProductAdmin):
        prod = session.query(Product).get(product.id)
        prod.product_status_id = product.product_status_id
        session.add(prod)
        session.commit()
        return True

    def get_product_by_id(self, session: Session, product_id: int):
        return session.query(Product).get(product_id)

    def get_key_by_id(self, session: Session, key_id: int):
        return session.query(Key).options(subqueryload(Key.product)).get(key_id)

    def get_cust_prod_by_id(self, session: Session, key_id: int):
        return session.query(CustomerProduct).get(key_id)

    def get_game_platforms(self, session: Session, game_id: int):
        return session.query(GamePlatform).filter(GamePlatform.game_id == game_id)
