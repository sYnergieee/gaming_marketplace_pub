from database.base import Base, Engine
from sqlalchemy.orm import Session, subqueryload

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
from models.characteristic import CharacteristicDB
from models.characteristic_game import CharacteristicGameDB
from models.game import PutGame
from models.genre import GenreDB
from models.platform import PlatformDB
from models.publisher import PublisherDB


class GameHandler:
    def __init__(self) -> None:
        Base.metadata.create_all(Engine)

    def get_platform_by_id(self, session: Session, plat_id: int):
        return session.query(Platform).get(plat_id)

    def get_genre_by_id(self, session: Session, genre_id: int):
        return session.query(Genre).get(genre_id)

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

    def put_platform(self, session: Session, platform: PlatformDB):
        new_platform = session.query(Platform).get(platform.id)
        new_platform.name = platform.name
        session.add(new_platform)
        session.commit()
        return True

    def put_genre(self, session: Session, genre: GenreDB):
        new_genre = session.query(Genre).get(genre.id)
        new_genre.name = genre.name
        session.add(new_genre)
        session.commit()
        return True

    def put_publisher(self, session: Session, publ: PublisherDB):
        new_publ = session.query(Publisher).get(publ.id)
        new_publ.name = publ.name
        session.add(new_publ)
        session.commit()
        return True

    def put_characteristic(self, session: Session, chrct: CharacteristicDB):
        new_chrct = session.query(Characteristic).get(chrct.id)
        new_chrct.name = chrct.name
        new_chrct.unit = chrct.unit
        session.add(new_chrct)
        session.commit()
        return True

    def put_game_characteristic(self, session: Session, new_value_char: CharacteristicGameDB):
        new_char = session.query(CharacteristicGame).filter(
            CharacteristicGame.game_id == new_value_char.game_id,
            CharacteristicGame.characteristic_id == new_value_char.characteristic_id).first()
        new_char.value = new_value_char.value
        session.add(new_char)
        session.commit()
        return True

    def put_game(self, session: Session, game: PutGame):
        g = session.query(Game).get(game.id)
        g.name = game.name
        g.description = game.description
        g.release_date = game.release_date
        g.publisher_id = game.publisher_id
        for i in g.platforms:
            self.delete_item(session, i)
        for i in g.genres:
            self.delete_item(session, i)
        for i in game.platforms_ids:
            plat = session.query(Platform).get(i)
            g.platforms.append(GamePlatform(platform=plat))
        for i in game.genres_ids:
            genre = session.query(Genre).get(i)
            g.genres.append(GameGenre(genre=genre))
        session.add(g)
        session.commit()
        return True

    def delete_platform(self, session: Session, platform_id: int):
        platform = session.query(Platform).get(platform_id)
        return self.delete_item(session, platform)

    def delete_genre(self, session: Session, genre_id: int):
        genre = session.query(Genre).get(genre_id)
        return self.delete_item(session, genre)

    def delete_publisher(self, session: Session, publ_id: int):
        publ = session.query(Publisher).get(publ_id)
        return self.delete_item(session, publ)

    def delete_characteristic(self, session: Session, chrct_id: int):
        chrct = session.query(Characteristic).get(chrct_id)
        return self.delete_item(session, chrct)

    def delete_application(self, session: Session, appl_id: int):
        appl = session.query(Application).get(appl_id)
        return self.delete_item(session, appl)

    def delete_game_characteristic(self, session: Session, game_id: int, characteristic_id: int):
        chrct = session.query(CharacteristicGame).filter(
            game_id == CharacteristicGame.game_id,
            characteristic_id == CharacteristicGame.characteristic_id).first()
        return self.delete_item(session, chrct)

    def delete_game(self, session: Session, game_id: int):
        game = session.query(Game).get(game_id)
        return self.delete_item(session, game)
