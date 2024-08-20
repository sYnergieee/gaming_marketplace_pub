from database.base import Base, Engine
from sqlalchemy.orm import Session
from database.db_models.game import Game

from database.db_models.user import User
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
from database.db_models.status import Status
from database.db_models.publisher import Publisher

class ImageHandler:
    def __init__(self) -> None:
        Base.metadata.create_all(Engine)

    def get_user_image(self, session: Session, user_id: int) -> str:
        query = session.query(User).get(user_id)
        return query.img

    def put_user_image(self, session: Session, user_id: int, str_path: str) -> str:
        image_name = f'{user_id}{str_path}'
        query = session.query(User).get(user_id)
        query.img = image_name
        session.add(query)
        session.commit()
        return image_name

    def put_game_image(self, session: Session, game_id: int, str_path: str) -> str:
        image_name = f'{game_id}{str_path}'
        query = session.query(Game).get(game_id)
        query.img = image_name
        session.add(query)
        session.commit()
        return image_name

    def get_game_image(self, session: Session, game_id: int) -> str:
        query = session.query(Game).get(game_id)
        return query.img