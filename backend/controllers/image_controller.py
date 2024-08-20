from database.handlers.image_handler import ImageHandler
from sqlalchemy.orm import Session


class ImageController:
    def __init__(self):
        self.__db_handler = ImageHandler()

    def get_user_image(self, session: Session, user_id: int):
        image_name = self.__db_handler.get_user_image(session, user_id)
        return image_name

    def put_user_image(self, session: Session, user_id: int, str_path: str) -> str:
        image_name = self.__db_handler.put_user_image(
            session, user_id, str_path)
        return image_name

    def put_game_image(self, session: Session, game_id: int, str_path: str) -> str:
        image_name = self.__db_handler.put_game_image(
            session, game_id, str_path)
        return image_name

    def get_game_image(self, session: Session, game_id: int):
        game_name = self.__db_handler.get_game_image(session, game_id)
        return game_name