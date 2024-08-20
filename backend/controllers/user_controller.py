from database.db_models.administrator import Administrator
from database.db_models.customer import Customer
from database.db_models.salesman import Salesman
from database.db_models.user import User
from database.db_models.recovery import Recovery
from database.handlers.user_handler import UserHandler
from sqlalchemy.orm import Session
from common.phrases import *
from common.consts import *
from exceptions.role_exception import RoleException
from exceptions.user_exception import UserException
from models.message import MessageModel
from models.role import RoleDB
from models.user import GetUsers, UserDB, UserEdit, UserLogin, UserRegister, FullUser
import asyncio


class UserController:
    def __init__(self):
        self.__db_handler = UserHandler()

    def role_checker(self, session: Session, role_id: int, url_path: str):
        try:
            isAccess = self.__db_handler.getAccessRole(session, role_id, url_path)
            if not isAccess:
                raise RoleException
        except Exception:
            raise RoleException("Отказано в доступе")

    def create_recovery(self, session: Session, email: str, code: str):
        user = self.__db_handler.get_user_by_email(session, email)
        if user:
            self.__db_handler.create_recovery(session, user, code)

    async def delete_recovery(self, session: Session, code: str):
        await asyncio.sleep(REC_CODE_EXPIRE)
        self.__db_handler.delete_recovery(session, code)

    def change_password_rec(self, session: Session, code: str, new_password: str):
        try:
            isChanged = self.__db_handler.change_password_rec(
                session, code, new_password
            )
            if isChanged:
                return MessageModel(message="Пароль успешно изменен")
            raise UserException
        except Exception:
            raise UserException(
                "Пароль не изменен, возможно, истекло время действия кода"
            )

    def sign_up(self, session: Session, user: UserRegister) -> FullUser:
        role = self.__db_handler.get_role_by_name(session, user.role)
        u = User(
            nickname=user.nickname,
            email=user.email,
            firstname=user.firstname,
            lastname=user.lastname,
            birthdate=user.birthdate,
            telegram=user.telegram,
            discord=user.discord,
            role=role,
            password=user.password,
        )
        if role.id == ID_SALESMAN:
            u.img = IMG_SALESMAN
            ur = Salesman(user=u)
        elif role.id == ID_CUSTOMER:
            u.img = IMG_CUSTOMER
            ur = Customer(user=u)
        else:
            u.img = IMG_ADMINISTRATOR
            ur = Administrator(user=u)
        new_user = self.__db_handler.add_user(session, ur)
        return FullUser.from_orm(new_user)

    def sign_in(self, session: Session, user: UserLogin):
        check_user = self.__db_handler.get_user_by_email(session, user.email)
        return check_user

    def delete_user_by_id(self, session: Session, id: int) -> bool:
        try:
            isDeleted = self.__db_handler.delete_user_by_id(session, id)
            if isDeleted:
                return MessageModel(message="Пользователь успешно удален!")
            raise UserException
        except Exception:
            raise UserException("Пользователь не удален")

    def change_user(self, session: Session, user: UserEdit, user_id: int) -> bool:
        try:
            isChanged = self.__db_handler.change_user(session, user, user_id)
            if isChanged:
                return MessageModel(message="Пользователь успешно изменен!")
            raise UserException
        except Exception:
            raise UserException("Пользователь не изменен")

    def get_user(self, session: Session, user_id: int) -> FullUser:
        curr_user = self.__db_handler.get_user(session, user_id)
        # hide password in get request
        curr_user.password = None
        return FullUser.from_orm(curr_user)

    def get_users(
        self, session: Session, role_id: int | None, nickname: str | None
    ) -> list[GetUsers]:
        users = self.__db_handler.get_users(session, role_id, nickname)
        return [GetUsers.from_orm(u) for u in users]

    def get_roles(self, session: Session) -> list[RoleDB]:
        roles = self.__db_handler.get_roles(session)
        return [RoleDB.from_orm(r) for r in roles]

    def get_user_by_id(self, session: Session, user_id: int) -> UserDB:
        user = self.__db_handler.get_user_by_id(session, user_id)
        return UserDB.from_orm(user)
