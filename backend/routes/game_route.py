from fastapi import APIRouter, status, Request
from fastapi.security import HTTPBearer
from common.auth import Auth
from common.depends import get_db
from controllers.game_controller import GameController
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from fastapi import HTTPException, Query, Security, Depends, BackgroundTasks
from controllers.user_controller import UserController
from exceptions.game_exception import GameException
from exceptions.role_exception import RoleException
from models.characteristic import CharacteristicDB, PostCharacteristic
from models.characteristic_game import CharacteristicGameDB
from models.game import PostGame, PutGame
from models.genre import GenreDB, PostGenre

from models.platform import PlatformDB, PostPlatform
from models.publisher import PostPublisher, PublisherDB

router = APIRouter(tags=["Game"])
game_controller = GameController()
user_controller = UserController()
auth_controller = Auth()
security = HTTPBearer()


@router.post('/post_platform', summary='Создание платформы')
def post_platform(
        request: Request,
        platform: PostPlatform,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.post_platform(db, platform)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.post('/post_genre', summary='Создание жанра')
def post_genre(
        request: Request,
        genre: PostGenre,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.post_genre(db, genre)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.post('/post_publisher', summary='Создание издателя')
def post_publisher(
        request: Request,
        publisher: PostPublisher,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.post_publisher(db, publisher)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.post('/post_characteristic', summary='Создание характеристики')
def post_characteristic(
        request: Request,
        characteristic: PostCharacteristic,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.post_characteristic(db, characteristic)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.post('/post_game', summary='Создание игры')
def post_game(
        request: Request,
        game: PostGame,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.post_game(db, game)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put('/put_game', summary='Изменение игры')
def put_game(
        request: Request,
        game: PutGame,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.put_game(db, game)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.delete('/delete_game', summary='Удаление игры')
def delete_game(
        request: Request,
        game_id: int,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.delete_game(db, game_id)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.post('/post_game_characteristic', summary='Создание характеристики для игры')
def post_game_characteristic(
        request: Request,
        game_characteristic: CharacteristicGameDB,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.post_game_characteristic(
            db, game_characteristic)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put('/put_game_characteristic', summary='Изменение значения характеристики для игры')
def put_game_characteristic(
        request: Request,
        new_value_char: CharacteristicGameDB,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.put_game_characteristic(db, new_value_char)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.delete('/delete_game_characteristic', summary='Удаление характеристики для игры')
def delete_game_characteristic(
        request: Request,
        game_id: int,
        characteristic_id: int,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.delete_game_characteristic(
            db, game_id, characteristic_id)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.post('/post_application', summary='Создание заявки игры')
def post_application(
        request: Request,
        game_name: str,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.post_application(db, user_id, game_name)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put('/put_platform', summary='Изменение платформы')
def put_platform(
        request: Request,
        platform: PlatformDB,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.put_platform(db, platform)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put('/put_genre', summary='Изменение жанра')
def put_genre(
        request: Request,
        genre: GenreDB,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.put_genre(db, genre)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put('/put_publisher', summary='Изменение издателя')
def put_publisher(
        request: Request,
        publisher: PublisherDB,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.put_publisher(db, publisher)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.put('/put_characteristic', summary='Изменение характеристики')
def put_characteristic(
        request: Request,
        characteristic: CharacteristicDB,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.put_characteristic(db, characteristic)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.delete('/delete_platform', summary='Удаление платформы')
def delete_platform(
        request: Request,
        platform_id: int,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.delete_platform(db, platform_id)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.delete('/delete_genre', summary='Удаление жанра')
def delete_genre(
        request: Request,
        genre_id: int,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.delete_genre(db, genre_id)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.delete('/delete_publisher', summary='Удаление издателя')
def delete_publisher(
        request: Request,
        publisher_id: int,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.delete_publisher(db, publisher_id)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.delete('/delete_characteristic', summary='Удаление характеристики')
def delete_characteristic(
        request: Request,
        characteristic_id: int,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.delete_characteristic(
            db, characteristic_id)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)


@router.delete('/delete_application', summary='Удаление заявки игры после обработки')
def delete_application(
        request: Request,
        application_id: int,
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db)):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return game_controller.delete_application(
            db, application_id)
    except GameException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except RoleException as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
