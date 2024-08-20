from database.db_models.application import Application
from database.db_models.characteristic import Characteristic
from database.db_models.characteristic_game import CharacteristicGame
from database.db_models.game import Game
from database.db_models.game_genre import GameGenre
from database.db_models.game_platform import GamePlatform
from database.db_models.genre import Genre
from database.db_models.platform import Platform
from database.db_models.publisher import Publisher
from database.handlers.game_handler import GameHandler
from sqlalchemy.orm import Session
from exceptions.game_exception import GameException
from models.characteristic import CharacteristicDB, PostCharacteristic
from models.characteristic_game import CharacteristicGameDB
from models.game import PostGame, PutGame
from models.genre import GenreDB, PostGenre
from models.message import MessageModel

from models.platform import PlatformDB, PostPlatform
from models.publisher import PostPublisher, PublisherDB


class GameController:
    def __init__(self):
        self.__db_handler = GameHandler()

    def post_platform(self, session: Session, platform: PostPlatform):
        try:
            pl = Platform(name=platform.name)
            isCreated = self.__db_handler.post_item(session, pl)
            if isCreated:
                return MessageModel(message="Платформа успешно создана!")
            raise GameException
        except Exception:
            raise GameException("Платформа не создана")

    def post_genre(self, session: Session, genre: PostGenre):
        try:
            gn = Genre(name=genre.name)
            isCreated = self.__db_handler.post_item(session, gn)
            if isCreated:
                return MessageModel(message="Жанр успешно создан!")
            raise GameException
        except Exception:
            raise GameException("Жанр не создан")

    def post_publisher(self, session: Session, publisher: PostPublisher):
        try:
            pub = Publisher(name=publisher.name)
            isCreated = self.__db_handler.post_item(session, pub)
            if isCreated:
                return MessageModel(message="Издатель успешно создан!")
            raise GameException
        except Exception:
            raise GameException("Издатель не создан")

    def post_characteristic(self, session: Session, characteristic: PostCharacteristic):
        try:
            chrct = Characteristic(name=characteristic.name, unit=characteristic.unit)
            isCreated = self.__db_handler.post_item(session, chrct)
            if isCreated:
                return MessageModel(message="Характеристика успешно создана!")
            raise GameException
        except Exception:
            raise GameException("Характеристика не создана")

    def post_game(self, session: Session, game: PostGame):
        try:
            g = Game(
                name=game.name,
                description=game.description,
                publisher_id=game.publisher_id,
                release_date=game.release_date,
            )
            for i in game.platforms_ids:
                plat = self.__db_handler.get_platform_by_id(session, i)
                g.platforms.append(GamePlatform(platform=plat))
            for i in game.genres_ids:
                genre = self.__db_handler.get_genre_by_id(session, i)
                g.genres.append(GameGenre(genre=genre))
            isCreated = self.__db_handler.post_item(session, g)
            if isCreated:
                return MessageModel(message="Игра успешно создана!")
            raise GameException
        except Exception:
            raise GameException("Игра не создана")

    def post_game_characteristic(
        self, session: Session, game_char: CharacteristicGameDB
    ):
        if (
            session.query(CharacteristicGame)
            .filter(
                CharacteristicGame.game_id == game_char.game_id,
                CharacteristicGame.characteristic_id == game_char.characteristic_id,
            )
            .first()
        ):
            raise GameException("Такая характеристика уже есть")
        try:
            gc = CharacteristicGame(
                game_id=game_char.game_id,
                characteristic_id=game_char.characteristic_id,
                value=game_char.value,
            )
            isCreated = self.__db_handler.post_item(session, gc)
            if isCreated:
                return MessageModel(message="Характеристика успешно добавлена!")
            raise GameException
        except Exception:
            raise GameException("Характеристика не добавлена")

    def post_application(self, session: Session, salesman_id: int, game_name: str):
        try:
            appl = Application(game_name=game_name, salesman_id=salesman_id)
            isCreated = self.__db_handler.post_item(session, appl)
            if isCreated:
                return MessageModel(message="Заявка успешно создана!")
            raise GameException
        except Exception:
            raise GameException("Заявка не добавлена")

    def put_platform(self, session: Session, platform: PlatformDB):
        try:
            isChanged = self.__db_handler.put_platform(session, platform)
            if isChanged:
                return MessageModel(message="Платформа успешно изменена!")
            raise GameException
        except Exception:
            raise GameException("Платформа не изменена")

    def put_genre(self, session: Session, genre: GenreDB):
        try:
            isChanged = self.__db_handler.put_genre(session, genre)
            if isChanged:
                return MessageModel(message="Жанр успешно изменен!")
            raise GameException
        except Exception:
            raise GameException("Жанр не изменен")

    def put_publisher(self, session: Session, publisher: PublisherDB):
        try:
            isChanged = self.__db_handler.put_publisher(session, publisher)
            if isChanged:
                return MessageModel(message="Издатель успешно изменен!")
            raise GameException
        except Exception:
            raise GameException("Издатель не изменен")

    def put_characteristic(self, session: Session, characteristic: CharacteristicDB):
        try:
            isChanged = self.__db_handler.put_characteristic(session, characteristic)
            if isChanged:
                return MessageModel(message="Характеристика успешно изменена!")
            raise GameException
        except Exception:
            raise GameException("Характеристика не изменена")

    def put_game_characteristic(
        self, session: Session, new_value_char: CharacteristicGameDB
    ):
        try:
            isChanged = self.__db_handler.put_game_characteristic(
                session, new_value_char
            )
            if isChanged:
                return MessageModel(message="Характеристика успешно изменена!")
            raise GameException
        except Exception:
            raise GameException("Характеристика не изменена")

    def put_game(self, session: Session, game: PutGame):
        try:
            isChanged = self.__db_handler.put_game(session, game)
            if isChanged:
                return MessageModel(message="Игра успешно изменена!")
            raise GameException
        except Exception:
            raise GameException("Игра не изменена")

    def delete_platform(self, session: Session, platform_id: int):
        try:
            isDeleted = self.__db_handler.delete_platform(session, platform_id)
            if isDeleted:
                return MessageModel(message="Платформа успешно удалена!")
            raise GameException
        except Exception:
            raise GameException("Платформа не удалена")

    def delete_genre(self, session: Session, genre_id: int):
        try:
            isDeleted = self.__db_handler.delete_genre(session, genre_id)
            if isDeleted:
                return MessageModel(message="Жанр успешно удален!")
            raise GameException
        except Exception:
            raise GameException("Жанр не удален")

    def delete_publisher(self, session: Session, publisher_id: int):
        try:
            isDeleted = self.__db_handler.delete_publisher(session, publisher_id)
            if isDeleted:
                return MessageModel(message="Издатель успешно удален!")
            raise GameException
        except Exception:
            raise GameException("Издатель не удален")

    def delete_characteristic(self, session: Session, characteristic_id: int):
        try:
            isDeleted = self.__db_handler.delete_characteristic(
                session, characteristic_id
            )
            if isDeleted:
                return MessageModel(message="Характеристика успешно удалена!")
            raise GameException
        except Exception:
            raise GameException("Характеристика не удалена")

    def delete_application(self, session: Session, application_id: int):
        try:
            isDeleted = self.__db_handler.delete_application(session, application_id)
            if isDeleted:
                return MessageModel(message="Заявка успешно удалена")
            raise GameException
        except Exception:
            raise GameException("Заявка не удалена")

    def delete_game_characteristic(
        self, session: Session, game_id: int, characteristic_id: int
    ):
        try:
            isDeleted = self.__db_handler.delete_game_characteristic(
                session, game_id, characteristic_id
            )
            if isDeleted:
                return MessageModel(message="Характеристика успешно удалена")
            raise GameException
        except Exception:
            raise GameException("Характеристика не удалена")

    def delete_game(self, session: Session, game_id: int):
        try:
            isDeleted = self.__db_handler.delete_game(session, game_id)
            if isDeleted:
                return MessageModel(message="Игра успешно удалена!")
            raise GameException
        except Exception:
            raise GameException("Игра не удалена")
