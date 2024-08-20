from sqlalchemy import JSON, and_, or_
from database.base import Base, Engine
from sqlalchemy.orm import Session, subqueryload, contains_eager
from database.db_models.customer import Customer

from database.db_models.platform import Platform
from database.db_models.game import Game
from database.db_models.application import Application
from database.db_models.characteristic import Characteristic
from database.db_models.characteristic_game import CharacteristicGame
from database.db_models.customer_product import CustomerProduct
from database.db_models.game import Game
from database.db_models.game_genre import GameGenre
from database.db_models.game_platform import GamePlatform
from database.db_models.genre import Genre
from database.db_models.key import Key
from database.db_models.product import Product
from database.db_models.salesman import Salesman
from database.db_models.status import Status
from database.db_models.publisher import Publisher
from database.db_models.user import User
from models.genre import GenreDB
from models.platform import PlatformDB
from models.publisher import PublisherDB
from common.phrases import *
from common.consts import *
import datetime


class ConstHandler:
    def __init__(self) -> None:
        Base.metadata.create_all(Engine)

    def get_platforms(self, session: Session, name: str | None, game_id: int | None):
        query = session.query(Platform)
        if name:
            query = query.filter(Platform.name.ilike(f"%{name}%"))
        if game_id:
            plat_ids = session.query(GamePlatform.platform_id).filter(
                GamePlatform.game_id == game_id
            )
            query = query.filter(Platform.id.in_(plat_ids))
        return query.order_by(Platform.id)

    def get_genres(self, session: Session, name: str | None):
        query = session.query(Genre)
        if name:
            query = query.filter(Genre.name.ilike(f"%{name}%"))
        return query.order_by(Genre.id)

    def get_publishers(self, session: Session, name: str | None):
        query = session.query(Publisher)
        if name:
            query = query.filter(Publisher.name.ilike(f"%{name}%"))
        return query.order_by(Publisher.id)

    def get_characteristics(self, session: Session, name: str | None):
        query = session.query(Characteristic)
        if name:
            query = query.filter(Characteristic.name.ilike(f"%{name}%"))
        return query.order_by(Characteristic.id)

    def get_applications(self, session: Session, salesman_id: int | None):
        query = (
            session.query(Application)
            .options(subqueryload(Application.salesman).subqueryload(Salesman.user))
            .order_by(Application.id)
        )
        if salesman_id:
            query = query.join(Salesman).filter(Salesman.id == salesman_id)
        return query

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
    ):
        query = (
            session.query(Game)
            .options(
                subqueryload(Game.publishers),
                subqueryload(Game.platforms).subqueryload(GamePlatform.platform),
                subqueryload(Game.genres).subqueryload(GameGenre.genre),
                subqueryload(Game.characteristics).subqueryload(
                    CharacteristicGame.characteristic
                ),
            )
            .order_by(Game.name)
        )
        if name:
            query = query.filter(Game.name.ilike(f"%{name}%"))
        if publisher_id:
            query = query.filter(Game.publisher_id == publisher_id)
        if release_date:
            query = query.filter(Game.release_date >= release_date)
        if platform_ids:
            for p_id in platform_ids:
                tmp = (
                    session.query(GamePlatform)
                    .join(Platform)
                    .filter(GamePlatform.platform_id == p_id)
                    .subquery()
                )
                query = query.join(tmp)
        if genre_ids:
            for g_id in genre_ids:
                tmp = (
                    session.query(GameGenre)
                    .join(Genre)
                    .filter(GameGenre.genre_id == g_id)
                    .subquery()
                )
                query = query.join(tmp)
        query = query.limit(limit).offset(offset * limit)
        return query

    def get_curr_game_short(self, session: Session, game_id: int):
        query = (
            session.query(Game)
            .options(
                subqueryload(Game.publishers),
                subqueryload(Game.platforms).subqueryload(GamePlatform.platform),
                subqueryload(Game.genres).subqueryload(GameGenre.genre),
                subqueryload(Game.characteristics).subqueryload(
                    CharacteristicGame.characteristic
                ),
            )
            .get(game_id)
        )
        return query

    def get_statuses(self, session: Session):
        query = session.query(Status)
        return query.order_by(Status.id)

    def check_for_block(self, session: Session, game_id: int):
        """блокировка продуктов по негативным необработанным отзывам"""
        query = session.query(Game).options(subqueryload(Game.products)).get(game_id)
        for prod in query.products:
            if prod.product_status_id == STATUS_P_AVAILABLE:
                total = (
                    prod.in_stock["В наличии"]
                    + prod.count_neg_review_not_proc
                    + prod.count_no_review
                    + prod.count_review_pos
                )
                if (
                    total != 0
                    and prod.count_neg_review_not_proc / total
                    > PERCENT_FOR_BLOCK_PRODUCT
                ):
                    prod.product_status_id = STATUS_P_BLOCKED
        session.add(query)
        session.commit()

    def get_curr_game(
        self,
        session: Session,
        game_id: int,
        limit: int,
        offset: int,
        status_id: int | None,
        salesman_id: int | None,
        platform_id: int | None,
    ):
        self.check_for_block(session, game_id)
        query = (
            session.query(Product).options(
                subqueryload(Product.salesmans).subqueryload(Salesman.user),
                subqueryload(Product.platform),
            )
        ).filter(Product.game_id == game_id)
        if status_id:
            query = query.filter(Product.product_status_id == status_id)
        if salesman_id:
            query = query.filter(Product.salesman_id == salesman_id)
        if platform_id:
            query = query.filter(Product.platform_id == platform_id)
        query = query.order_by(Product.price)
        query = query.limit(limit).offset(offset * limit)
        return query

    def get_history_self_sales(
        self,
        session: Session,
        user_id: int,
        game_name: str | None,
    ):
        query = (
            session.query(Game)
            .options(
                contains_eager(Game.products)
                .subqueryload(Product.keys)
                .subqueryload(Key.cust_prod)
            )
            .order_by(Game.name)
        )
        query = query.outerjoin(
            Product, and_(Product.salesman_id == user_id, Product.game_id == Game.id)
        ).order_by(Product.published_date.desc())
        if game_name:
            query = query.filter(Game.name.ilike(f"%{game_name}%"))
        return query

    def get_history_self_cust(
        self,
        session: Session,
        limit: int,
        offset: int,
        user_id: int,
        game_name: str | None,
    ):
        query = (
            session.query(CustomerProduct)
            .options(
                subqueryload(CustomerProduct.key)
                .subqueryload(Key.product)
                .subqueryload(Product.game),
                subqueryload(CustomerProduct.key)
                .subqueryload(Key.product)
                .subqueryload(Product.salesmans)
                .subqueryload(Salesman.user),
            )
            .filter(CustomerProduct.customer_id == user_id)
        )
        tmp = session.query(Key).join(Product).join(Game)
        if game_name:
            tmp = tmp.filter(Game.name.ilike(f"%{game_name}%"))
        query = query.join(tmp.subquery())
        query = query.order_by(CustomerProduct.purshase_date.desc())
        query = query.limit(limit).offset(offset * limit)
        return query

    def get_curr_product(self, session: Session, product_id: int):
        query = session.query(Product).get(product_id)
        return query

    def get_reviews(
        self,
        session: Session,
        product_id: int,
        limit: int,
        offset: int,
        is_used: bool | None,
        customer_id: int | None,
        customer_status_id: int | None,
    ):
        query = session.query(Key).options(
            subqueryload(Key.cust_prod)
            .subqueryload(CustomerProduct.customers)
            .subqueryload(Customer.user)
        )
        query = query.filter(Key.product_id == product_id)
        if is_used is not None:
            query = query.filter(Key.is_used == is_used)
        tmp = session.query(CustomerProduct).join(Customer).join(User)
        if customer_status_id:
            if customer_status_id == STATUS_C_P_NEG_REVIEW_PROC:
                tmp = tmp.filter(
                    or_(
                        CustomerProduct.customer_status_id == customer_status_id,
                        CustomerProduct.customer_status_id
                        == STATUS_C_P_NEG_REVIEW_NOT_PROC,
                    )
                )
            else:
                tmp = tmp.filter(
                    CustomerProduct.customer_status_id == customer_status_id
                )
        if customer_id:
            tmp = tmp.filter(CustomerProduct.customer_id == customer_id)
        if customer_id or customer_status_id:
            query = query.join(tmp.subquery())
        else:
            query = query.outerjoin(tmp.subquery())
        query = query.order_by(Key.id.desc())
        query = query.limit(limit).offset(offset * limit)
        return query

    def check_hide_code_review(self, session: Session, product_id: int):
        query = session.query(Product).get(product_id)
        return query.salesman_id

    def get_prod_neg_not_proc(self, session: Session, is_blocked: int):
        query = (
            session.query(Product)
            .options(
                subqueryload(Product.keys).subqueryload(Key.cust_prod),
                subqueryload(Product.game),
            )
            .order_by(Product.published_date.desc())
        )
        query = query.filter(
            (Product.product_status_id == is_blocked),
        )
        return query
