from common.hasher_key import HasherKey
from database.db_models.customer_product import CustomerProduct
from database.db_models.key import Key
from database.db_models.product import Product
from database.handlers.product_handler import ProductHandler
from sqlalchemy.orm import Session
from exceptions.product_exception import ProductException
from models.customer_product import (
    PostCustomerProduct,
    PutCustomerProduct,
    PutCustomerProductAdmin,
)
from models.key import PostKey
from models.message import MessageModel

from models.product import PostProduct, PutProduct, PutProductAdmin
from common.phrases import *
from common.consts import *


cipher_controller = HasherKey()


class ProductController:
    def __init__(self):
        self.__db_handler = ProductHandler()

    def post_product(self, session: Session, product: PostProduct, salesman_id: int):
        try:
            flag = True
            g_p = self.__db_handler.get_game_platforms(session, product.game_id)
            for p in g_p:
                if p.platform_id == product.platform_id:
                    flag = False
            if flag:
                raise ProductException
            p = Product(
                name=product.name,
                description=product.description,
                price=product.price,
                game_id=product.game_id,
                salesman_id=salesman_id,
                product_status_id=STATUS_P_AVAILABLE,
                platform_id=product.platform_id,
            )
            isCreated = self.__db_handler.post_item(session, p)
            if isCreated:
                return MessageModel(message="Продукт успешно создан!")
            raise ProductException
        except Exception:
            raise ProductException("Продукт не создан")

    def post_key_product(self, session: Session, key: PostKey, user_id: int):
        try:
            prod_db = self.__db_handler.get_product_by_id(session, key.product_id)
            self.__check_for_not_self_ids(user_id, prod_db.salesman_id)
            encr_key = cipher_controller.encrypt_key(key.code)
            k = Key(code=encr_key, product_id=key.product_id)
            isCreated = self.__db_handler.post_item(session, k)
            if isCreated:
                return MessageModel(message="Ключ продукта успешно создан!")
            raise ProductException
        except Exception:
            raise ProductException("Ключ продукта не создан")

    def post_customer_product(
        self, session: Session, key_c_p: PostCustomerProduct, customer_id: int
    ):
        key_id, key_code = self.__db_handler.get_free_product_key(
            session, key_c_p.product_id
        )
        if key_id:
            k_c_p = CustomerProduct(
                key_id=key_id,
                customer_status_id=STATUS_C_P_NO_REVIEW,
                customer_id=customer_id,
            )
            if self.__db_handler.post_item(session, k_c_p):
                return cipher_controller.decrypt_key(key_code)
            raise ProductException("Ключ не куплен")
        raise ProductException("Ключ не куплен")

    def put_customer_product(
        self, session: Session, customer_product: PutCustomerProduct, customer_id: int
    ):
        try:
            cust_prod_db = self.__db_handler.get_cust_prod_by_id(
                session, customer_product.key_id
            )
            self.__check_for_not_self_ids(cust_prod_db.customer_id, customer_id)
            isChanged = self.__db_handler.put_customer_product(
                session, customer_product, cust_prod_db
            )
            if isChanged:
                return MessageModel(message="Отзыв успешно оставлен!")
            raise ProductException
        except Exception:
            raise ProductException("Отзыв не оставлен")

    def put_stat_customer_product(
        self, session: Session, customer_product: PutCustomerProductAdmin
    ):
        try:
            isChanged = self.__db_handler.put_stat_customer_product(
                session, customer_product
            )
            if isChanged:
                return MessageModel(message="Отзыв успешно обработан!")
            raise ProductException
        except Exception:
            raise ProductException("Отзыв не обработан")

    def delete_key(self, session: Session, key_id: int, user_id: int, role_id: int):
        try:
            key_db = self.__db_handler.get_key_by_id(session, key_id)
            if role_id != ID_ADMINISTRATOR:
                self.__check_for_not_self_ids(key_db.product.salesman_id, user_id)
            isDeleted = self.__db_handler.delete_key(session, key_db)
            if isDeleted:
                return MessageModel(message="Ключ успешно удален!")
            raise ProductException
        except Exception:
            raise ProductException("Ключ не удален")

    def put_product(
        self, session: Session, product: PutProduct, user_id: int, role_id: int
    ):
        try:
            product_db = self.__db_handler.get_product_by_id(session, product.id)
            if role_id != ID_ADMINISTRATOR:
                self.__check_for_not_self_ids(user_id, product_db.salesman_id)
            isChanged = self.__db_handler.put_product(session, product, product_db)
            if isChanged:
                return MessageModel(message="Продукт успешно изменен!")
            raise ProductException
        except Exception:
            raise ProductException("Продукт не изменен")

    def put_stat_product(self, session: Session, product: PutProductAdmin):
        try:
            isChanged = self.__db_handler.put_stat_product(session, product)
            if isChanged:
                return MessageModel(message="Статус продукта успешно изменен!")
            raise ProductException
        except Exception:
            raise ProductException("Статус продукта не изменен")

    def __check_for_not_self_ids(self, first, second):
        if first != second:
            raise ProductException
