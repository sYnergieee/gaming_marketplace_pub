import random
import string
from fastapi import APIRouter, status, Request
from common.auth import Auth
from common.depends import get_db
from common.mailer import send_email_background, send_recovery_background
from controllers.user_controller import UserController
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from fastapi import HTTPException, Query, Security, Depends, BackgroundTasks
from common.phrases import *
from common.consts import *
from exceptions.role_exception import RoleException
from exceptions.user_exception import UserException
from models.recovery import ChangeRecovery
from models.role import RoleDB
from models.user import FullUser, GetUsers, UserEdit, UserRegister, UserLogin


router = APIRouter(tags=["User"])
user_controller = UserController()
auth_controller = Auth()
security = HTTPBearer()


@router.post("/signup", summary="Регистрация")
def signup(
    background_tasks: BackgroundTasks, user: UserRegister, db: Session = Depends(get_db)
):
    try:
        hashed_password = auth_controller.encode_password(user.password)
        user.password = hashed_password
        send_email_background(background_tasks, EMAIL_SUBJECT, user)
        new_user = user_controller.sign_up(db, user)
        access_token = auth_controller.encode_token(new_user.id, new_user.role_id)
        refresh_token = auth_controller.encode_refresh_token(
            new_user.id, new_user.role_id
        )
        return {"access_token": access_token, "refresh_token": refresh_token}
    except:
        raise HTTPException(status_code=400, detail=USER_REGISTER_INVALID)


@router.post("/signin", summary="Авторизация")
def signin(user: UserLogin, db: Session = Depends(get_db)):
    check_user = user_controller.sign_in(db, user)
    if check_user is None:
        raise HTTPException(status_code=401, detail=USER_NOT_EXIST)
    if not auth_controller.verify_password(user.password, check_user.password):
        raise HTTPException(status_code=401, detail=PASSWORD_INVALID)
    access_token = auth_controller.encode_token(check_user.id, check_user.role_id)
    refresh_token = auth_controller.encode_refresh_token(
        check_user.id, check_user.role_id
    )
    return {"access_token": access_token, "refresh_token": refresh_token}


@router.get("/refresh_token", summary="Обновление токена по токену обновления")
def refresh_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    refresh_token = credentials.credentials
    new_token = auth_controller.refresh_token(refresh_token)
    return {"access_token": new_token}


@router.delete("/delete", summary="Удаление пользователя по id")
def delete_user_by_id(
    request: Request,
    id: int,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return user_controller.delete_user_by_id(db, id)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except UserException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put("/put", summary="Изменение пользователя")
def change_user(
    user: UserEdit,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        if user.password is not None and user.password != "":
            hashed_password = auth_controller.encode_password(user.password)
            user.password = hashed_password
        if user.telegram == "":
            user.telegram = None
        if user.discord == "":
            user.discord = None
        return user_controller.change_user(db, user, user_id)
    except UserException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.get(
    "/get_users", response_model=list[GetUsers], summary="Получение всех пользователей"
)
def get_users(
    role_id: int | None = None,
    nickname: str | None = None,
    db: Session = Depends(get_db),
):
    users = user_controller.get_users(db, role_id, nickname)
    return users


@router.get("/get_roles", response_model=list[RoleDB], summary="Получение всех ролей")
def get_roles(db: Session = Depends(get_db)):
    roles = user_controller.get_roles(db)
    return roles


@router.get(
    "/get_user", response_model=FullUser, summary="Получение пользователя в профиле"
)
def get_user(
    u_id: int = Query(default=None, description="Ид пользователя если это не вы"),
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    curr_user = user_controller.get_user(db, u_id if u_id else user_id)
    return curr_user


@router.post("/create_recovery", summary="Восстановление пароля")
async def create_recovery(
    email: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)
):
    letters = string.ascii_lowercase
    code = "".join(random.choice(letters) for _ in range(REC_CODE_LENGTH))
    user_controller.create_recovery(db, email, code)
    send_recovery_background(background_tasks, EMAIL_SUBJECT, email, code)
    background_tasks.add_task(user_controller.delete_recovery, db, code)
    return code


@router.put(
    "/change_password_recovery",
    summary="Изменение пароля пользователя при восстановлении",
)
def change_password_rec(recovery: ChangeRecovery, db: Session = Depends(get_db)):
    try:
        new_password = auth_controller.encode_password(recovery.password)
        return user_controller.change_password_rec(db, recovery.code, new_password)
    except UserException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
