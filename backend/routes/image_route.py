from fastapi import APIRouter, Request, UploadFile, File, status
from controllers.image_controller import ImageController
from deta import Deta
import os
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
from common.auth import Auth
from common.depends import get_db
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from fastapi import HTTPException, Query, Security, Depends
from common.phrases import *
from common.consts import *
from controllers.user_controller import UserController
from exceptions.role_exception import RoleException


load_dotenv()
DETA_PROJECT_KEY = os.getenv("DETA_PROJECT_KEY")
DETA_NAME_DRIVE = os.getenv("DETA_NAME_DRIVE")
deta = Deta(DETA_PROJECT_KEY)
drive = deta.Drive(DETA_NAME_DRIVE)


router = APIRouter(tags=["Image"])
image_controller = ImageController()
user_controller = UserController()
auth_controller = Auth()
security = HTTPBearer()


@router.get("/{name}")
async def get_image(name: str):
    data = drive.get(name)
    if data:
        return StreamingResponse(data.iter_chunks(2048), media_type="image/jpg")
    return None


@router.get("/user_image", summary="Получение картинки пользователя")
def get_user_image(user_id: int, db: Session = Depends(get_db)):
    image_name = image_controller.get_user_image(db, user_id)
    return image_name


@router.get("/game_image", summary="Получение картинки игры")
def get_game_image(game_id: int, db: Session = Depends(get_db)):
    game_name = image_controller.get_game_image(db, game_id)
    if game_name:
        return game_name
    return None


@router.put("/upl_user_image", summary="Загрузка новой картинки пользователя")
def upload_user_image(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    if user_id:
        image_name = image_controller.put_user_image(db, user_id, IMAGE_USER_PATH)
        drive.put(image_name, file.file)
        return True
    return False


@router.put("/upl_game_image", summary="Загрузка картинки игры")
def upload_game_image(
    request: Request,
    game_id: int,
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
    except RoleException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    if user_id:
        image_name = image_controller.put_game_image(db, game_id, IMAGE_GAME_PATH)
        drive.put(image_name, file.file)
        return True
    return False
