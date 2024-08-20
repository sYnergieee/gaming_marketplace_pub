from fastapi import (
    BackgroundTasks,
    HTTPException,
    Query,
    Security,
    Depends,
    APIRouter,
    UploadFile,
    File,
    status,
    Request,
)
from fastapi.security import HTTPBearer

from common.auth import Auth
from common.mailer import send_key_email_background
from controllers.product_controller import ProductController
from common.depends import get_db
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from controllers.user_controller import UserController
from exceptions.product_exception import ProductException
from exceptions.role_exception import RoleException
from models.customer_product import (
    PostCustomerProduct,
    PutCustomerProduct,
    PutCustomerProductAdmin,
)
from models.key import PostKey
from common.phrases import *
from common.consts import *
from models.message import MessageModel

from models.product import PostProduct, PutProduct, PutProductAdmin

router = APIRouter(tags=["Product"])
product_controller = ProductController()
user_controller = UserController()
auth_controller = Auth()
security = HTTPBearer()


@router.post("/post_product", summary="Создание продукта")
def post_product(
    request: Request,
    product: PostProduct,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return product_controller.post_product(db, product, user_id)
    except ProductException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.post("/post_key_product", summary="Создание ключа для продукта")
def post_key_product(
    request: Request,
    key: PostKey,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return product_controller.post_key_product(db, key, user_id)
    except ProductException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.post("/post_customer_product", summary="Создание ключа покупателя (покупка)")
def post_customer_product(
    request: Request,
    background_tasks: BackgroundTasks,
    key_c_p: PostCustomerProduct,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        key_code = product_controller.post_customer_product(db, key_c_p, user_id)
        curr_user = user_controller.get_user_by_id(db, user_id)
        send_key_email_background(background_tasks, EMAIL_SUBJECT, curr_user, key_code)
        return MessageModel(message="Ключ успешно приобретен!")
    except ProductException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put("/put_customer_product", summary="Добавление отзыва и обновление статуса")
def put_customer_product(
    request: Request,
    customer_product: PutCustomerProduct,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return product_controller.put_customer_product(db, customer_product, user_id)
    except ProductException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put(
    "/put_stat_customer_product", summary="Изменение отриц отзыва администратором"
)
def put_stat_customer_product(
    request: Request,
    customer_product: PutCustomerProductAdmin,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return product_controller.put_stat_customer_product(db, customer_product)
    except ProductException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.delete("/delete_key", summary="Удаление ключа")
def delete_key(
    request: Request,
    key_id: int,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return product_controller.delete_key(db, key_id, user_id, role_id)
    except ProductException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put("/put_product", summary="Изменение продукта")
def put_product(
    request: Request,
    product: PutProduct,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return product_controller.put_product(db, product, user_id, role_id)
    except ProductException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put("/put_stat_product", summary="Изменение статуса продукта администратором")
def put_stat_product(
    request: Request,
    product: PutProductAdmin,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return product_controller.put_stat_product(db, product)
    except ProductException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
