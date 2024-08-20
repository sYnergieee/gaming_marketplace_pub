from sqlalchemy.orm import Session
from common.consts import ID_ADMINISTRATOR
from common.hasher_key import HasherKey
from database.handlers.const_handler import ConstHandler
from models.application import ApplicationDB, ApplicationFull
from models.characteristic import CharacteristicDB
from models.game import (
    FullProductWithGame,
    GameDB,
    GetCustomerProduct,
    GetCustomerProductSecret,
    GetGame,
    GetGameHistorySalesman,
)
from models.genre import GenreDB

from models.key import KeyWithCustomer, KeyWithCustomerSecret
from models.platform import PlatformDB
from models.product import FullProduct, ProductDB
from models.publisher import PublisherDB
import datetime

from models.status import StatusDB


cipher_controller = HasherKey()


class ConstController:
    def __init__(self):
        self.__db_handler = ConstHandler()

    def get_platforms(self, session: Session, name: str | None, game_id: int | None) -> list[PlatformDB]:
        platforms = self.__db_handler.get_platforms(session, name, game_id)
        return [PlatformDB.from_orm(pl) for pl in platforms]

    def get_genres(self, session: Session, name: str | None) -> list[GenreDB]:
        genres = self.__db_handler.get_genres(session, name)
        return [GenreDB.from_orm(g) for g in genres]

    def get_publishers(self, session: Session, name: str | None) -> list[PublisherDB]:
        publs = self.__db_handler.get_publishers(session, name)
        return [PublisherDB.from_orm(pub) for pub in publs]

    def get_characteristics(
        self, session: Session, name: str | None
    ) -> list[CharacteristicDB]:
        characteristics = self.__db_handler.get_characteristics(session, name)
        return [CharacteristicDB.from_orm(chrct) for chrct in characteristics]

    def get_applications(
        self, session: Session, salesman_id: int | None
    ) -> list[ApplicationFull]:
        applications = self.__db_handler.get_applications(session, salesman_id)
        return (
            [ApplicationFull.from_orm(appl) for appl in applications]
            if applications
            else []
        )

    def get_games(
        self,
        session: Session,
        limit: int,
        offset: int,
        name: str | None,
        publisher_id: int | None,
        release_date: datetime.date | None,
        platform_ids: list[int] | None,
        genre_ids: list[int] | None,
    ) -> list[GetGame]:
        games = self.__db_handler.get_games(
            session,
            limit,
            offset,
            name,
            publisher_id,
            release_date,
            platform_ids,
            genre_ids,
        )
        return [GetGame.from_orm(g) for g in games]

    def get_curr_game_short(self, session: Session, game_id: int) -> GetGame:
        game = self.__db_handler.get_curr_game_short(session, game_id)
        return GetGame.from_orm(game)

    def get_statuses(self, session: Session) -> list[StatusDB]:
        statuses = self.__db_handler.get_statuses(session)
        return [StatusDB.from_orm(s) for s in statuses]

    def get_curr_game(
        self,
        session: Session,
        game_id: int,
        limit: int,
        offset: int,
        status_id: int | None,
        salesman_id: int | None,
        platform_id: int | None
    ) -> list[FullProduct]:
        prods = self.__db_handler.get_curr_game(
            session, game_id, limit, offset, status_id, salesman_id, platform_id
        )
        return [FullProduct.from_orm(p) for p in prods]

    def get_history_self_sales(
        self,
        session: Session,
        limit: int,
        offset: int,
        user_id: int,
        game_name: str | None,
    ) -> list[GetGameHistorySalesman]:
        games = self.__db_handler.get_history_self_sales(session, user_id, game_name)
        pydantic_games = [GetGameHistorySalesman.from_orm(g) for g in games]
        return pydantic_games[limit * offset : limit + limit * offset]

    def get_history_self_cust(
        self,
        session: Session,
        limit: int,
        offset: int,
        user_id: int,
        game_name: str | None,
        hide_code: bool,
    ):
        keys = self.__db_handler.get_history_self_cust(
            session, limit, offset, user_id, game_name
        )
        if hide_code:
            return [GetCustomerProductSecret.from_orm(k) for k in keys]
        else:
            keys_pydantic = []
            for k in keys:
                k.key.code = cipher_controller.decrypt_key(k.key.code)
                keys_pydantic.append(GetCustomerProduct.from_orm(k))
            return keys_pydantic

    def get_curr_product(self, session: Session, product_id: int) -> ProductDB:
        product = self.__db_handler.get_curr_product(session, product_id)
        return ProductDB.from_orm(product)

    def get_reviews(
        self,
        session: Session,
        product_id: int,
        hide_code: bool,
        limit: int,
        offset: int,
        is_used: bool | None,
        customer_id: int | None,
        customer_status_id: int | None,
    ):
        keys = self.__db_handler.get_reviews(
            session, product_id, limit, offset, is_used, customer_id, customer_status_id
        )
        if hide_code:
            return [KeyWithCustomerSecret.from_orm(k) for k in keys]
        else:
            keys_pydantic = []
            for k in keys:
                k.code = cipher_controller.decrypt_key(k.code)
                keys_pydantic.append(KeyWithCustomer.from_orm(k))
            return keys_pydantic

    def check_hide_code_review(
        self, session: Session, user_id: int, role_id: int, product_id: int
    ):
        salesman_id = self.__db_handler.check_hide_code_review(session, product_id)
        return False if salesman_id == user_id or role_id == ID_ADMINISTRATOR else True

    def get_prod_neg_not_proc(
        self, session: Session, is_blocked: int
    ) -> FullProductWithGame:
        products_db = self.__db_handler.get_prod_neg_not_proc(session, is_blocked)
        res = []
        for p in products_db:
            if p.count_neg_review_not_proc > 0:
                res.append(p)
        return [FullProductWithGame.from_orm(p) for p in res]
