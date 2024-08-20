from database.base import Base, Engine
from sqlalchemy.orm import Session, subqueryload
from database.db_models.permission import Permission
from database.db_models.recovery import Recovery
from database.db_models.role import Role
from database.db_models.user import User
from models.user import UserEdit


class UserHandler:
    def __init__(self) -> None:
        Base.metadata.create_all(Engine)

    def getAccessRole(self, session: Session, role_id: int, url_path: str):
        query = session.query(Permission).filter(
            Permission.role_id == role_id, Permission.url == url_path).first()
        return True if query else False
    
    def create_recovery(self, session: Session, user: User, code: str):
        recovery = Recovery(
            code = code,
            user_id = user.id,
        )
        session.add(recovery)
        session.commit()
        
    def delete_recovery(self, session: Session, code: str):
        query = session.query(Recovery).get(code)
        if query:
            session.delete(query)
            session.commit()

    def change_password_rec(self, session: Session, code: str, new_password: str):
        query = session.query(Recovery).get(code)
        if query:
            user = session.query(User).get(query.user_id)
            if user:
                user.password = new_password
                session.add(user)
                session.delete(query)
                session.commit()
                return True
            return False
        return False

    def get_user(self, session: Session, user_id: int) -> User:
        query = session.query(User).options(
            subqueryload(User.role),
            subqueryload(User.administrators),
            subqueryload(User.customers),
            subqueryload(User.salesmans)
        ).get(user_id)
        return query

    def get_users(self, session: Session, role_id: int | None, nickname: str | None):
        query = session.query(User).options(
            subqueryload(User.role),
        ).order_by(User.id)
        if role_id:
            query = query.filter(User.role_id == role_id)
        if nickname:
            query = query.filter(User.nickname.ilike(f'%{nickname}%'))
        return query

    def get_role_by_name(self, session: Session, name: str) -> Role:
        role = session.query(Role).filter(Role.name == name).first()
        return role

    def get_roles(self, session: Session) -> list[Role]:
        roles = session.query(Role).order_by(Role.id)
        return roles

    def get_user_by_email(self, session: Session, email: str) -> User:
        query = session.query(User).options(
            subqueryload(User.role),
            subqueryload(User.administrators),
            subqueryload(User.customers),
            subqueryload(User.salesmans)
        )
        query = query.filter(User.email == email).first()
        return query

    def add_user(self, session: Session, user):
        session.add(user)
        session.commit()
        return self.get_user_by_email(session, user.user.email)

    def delete_user_by_id(self, session: Session, id: int) -> bool:
        user = session.query(User).get(id)
        if user is None:
            return False
        else:
            session.delete(user)
            session.commit()
            return True

    def change_user(self, session: Session, user: UserEdit, user_id: int) -> bool:
        new_user = session.query(User).get(user_id)
        if new_user is not None:
            new_user.nickname = user.nickname
            new_user.email = user.email
            new_user.firstname = user.firstname
            new_user.lastname = user.lastname
            new_user.birthdate = user.birthdate
            new_user.telegram = user.telegram
            new_user.discord = user.discord
            if user.password is not None and user.password != '':
                new_user.password = user.password
            session.add(new_user)
            session.commit()
            return True
        else:
            return None

    def get_user_by_id(self, session: Session, user_id: int) -> User:
        user = session.query(User).get(user_id)
        return user
