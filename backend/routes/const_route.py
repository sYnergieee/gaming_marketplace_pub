from fastapi import APIRouter, Request, status
from fastapi.security import HTTPBearer
from common.auth import Auth
from common.consts import *
from common.depends import get_db
from common.phrases import OBJECTS_NOT_FOUND
from controllers.const_controller import ConstController
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from fastapi import HTTPException, Query, Security, Depends, BackgroundTasks
from controllers.user_controller import UserController
from exceptions.role_exception import RoleException
from models.application import ApplicationFull
from models.characteristic import CharacteristicDB
from models.game import (
    GameDB,
    GetCustomerProduct,
    GetGame,
    GetGameHistorySalesman,
)
from models.genre import GenreDB

from models.platform import PlatformDB
from models.product import FullProduct, ProductDB
from models.publisher import PublisherDB
import datetime

from models.status import StatusDB

router = APIRouter(tags=["Const"])
const_controller = ConstController()
auth_controller = Auth()
user_controller = UserController()
security = HTTPBearer()


@router.get(
    "/get_platforms", response_model=list[PlatformDB], summary="Получение всех платформ"
)
def get_platforms(
    name: str | None = None, game_id: int | None = None, db: Session = Depends(get_db)
):
    # try:
        platforms = const_controller.get_platforms(db, name, game_id)
        return platforms
    # except Exception as ex:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
    #     )
    


@router.get(
    "/get_genres", response_model=list[GenreDB], summary="Получение всех жанров"
)
def get_genres(name: str | None = None, db: Session = Depends(get_db)):
    try:
        genres = const_controller.get_genres(db, name)
        return genres
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get(
    "/get_publishers",
    response_model=list[PublisherDB],
    summary="Получение всех издателей",
)
def get_publishers(name: str | None = None, db: Session = Depends(get_db)):
    try:
        publishers = const_controller.get_publishers(db, name)
        return publishers
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get(
    "/get_characteristics",
    response_model=list[CharacteristicDB],
    summary="Получение всех характеристик",
)
def get_characteristics(name: str | None = None, db: Session = Depends(get_db)):
    try:
        characteristics = const_controller.get_characteristics(db, name)
        return characteristics
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get("/get_games", response_model=list[GetGame], summary="Получение всех игр")
def get_games(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=MAX_LIMIT),
    offset: int = Query(
        default=DEFAULT_OFFSET,
        ge=VALUE_NOT_LESS,
    ),
    name: str | None = None,
    publisher_id: int | None = None,
    release_date: datetime.date | None = None,
    platform_ids: list[int] | None = Query(default=None),
    genre_ids: list[int] | None = Query(default=None),
    db: Session = Depends(get_db),
):
    try:
        games = const_controller.get_games(
            db, limit, offset, name, publisher_id, release_date, platform_ids, genre_ids
        )
        return games
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get(
    "/get_applications",
    response_model=list[ApplicationFull],
    summary="Получение всех заявок",
)
def get_applications(salesman_id: int | None = None, db: Session = Depends(get_db)):
    try:
        applications = const_controller.get_applications(db, salesman_id)
        return applications
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get(
    "/get_statuses", response_model=list[StatusDB], summary="Получение всех статусов"
)
def get_statuses(db: Session = Depends(get_db)):
    try:
        statuses = const_controller.get_statuses(db)
        return statuses
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get(
    "/get_curr_game_short",
    response_model=GetGame,
    summary="Получение игры (без продуктов)",
)
def get_curr_game_short(game_id: int, db: Session = Depends(get_db)):
    try:
        statuses = const_controller.get_curr_game_short(db, game_id)
        return statuses
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get(
    "/get_curr_game",
    response_model=list[FullProduct],
    summary="Получение информации об игре (с продуктами)",
)
def get_curr_game(
    game_id: int,
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=MAX_LIMIT),
    offset: int = Query(
        default=DEFAULT_OFFSET,
        ge=VALUE_NOT_LESS,
    ),
    status_id: int | None = None,
    salesman_id: int | None = None,
    platform_id: int | None = None,
    db: Session = Depends(get_db),
):
    try:
        game = const_controller.get_curr_game(
            db, game_id, limit, offset, status_id, salesman_id, platform_id
        )
        return game
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get(
    "/get_history_self_sales",
    response_model=list[GetGameHistorySalesman],
    summary="Получение всех продуктов конкретного продавца",
)
def get_history_self_sales(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=MAX_LIMIT),
    offset: int = Query(
        default=DEFAULT_OFFSET,
        ge=VALUE_NOT_LESS,
    ),
    u_id: int | None = Query(default=None, description="Посмотреть не свою историю"),
    game_name: str | None = None,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        history = const_controller.get_history_self_sales(
            db, limit, offset, u_id if u_id else user_id, game_name
        )
        return history
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get(
    "/get_history_self_cust",
    summary="Получение всех ключей конкретного покупателя",
)
def get_history_self_cust(
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=MAX_LIMIT),
    offset: int = Query(
        default=DEFAULT_OFFSET,
        ge=VALUE_NOT_LESS,
    ),
    u_id: int | None = Query(default=None, description="Посмотреть не свою историю"),
    game_name: str | None = None,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        hide_code = True if u_id and role_id != ID_ADMINISTRATOR else False
        history = const_controller.get_history_self_cust(
            db, limit, offset, u_id if u_id else user_id, game_name, hide_code
        )
        return history
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get(
    "/get_curr_product",
    response_model=ProductDB,
    summary="Получение конкретного продукта (без ключей)",
)
def get_curr_product(product_id: int, db: Session = Depends(get_db)):
    try:
        product = const_controller.get_curr_product(db, product_id)
        return product
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get("/get_reviews", summary="Получение отзывов/ключей о продукте")
def get_reviews(
    product_id: int,
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=MAX_LIMIT),
    offset: int = Query(
        default=DEFAULT_OFFSET,
        ge=VALUE_NOT_LESS,
    ),
    is_used: bool | None = None,
    customer_id: int | None = None,
    customer_status_id: int | None = None,
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        hide_code = const_controller.check_hide_code_review(
            db, user_id, role_id, product_id
        )
        reviews = const_controller.get_reviews(
            db,
            product_id,
            hide_code,
            limit,
            offset,
            is_used,
            customer_id,
            customer_status_id,
        )
        return reviews
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )


@router.get(
    "/get_prod_neg_not_proc",
    summary="Получение продуктов с необработанными отрицательными отзывами",
)
def get_prod_neg_not_proc(
    request: Request,
    is_blocked: int = Query(ge=5, le=6),
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    user_id, role_id = auth_controller.decode_token(token).values()
    try:
        user_controller.role_checker(db, role_id, request.url.path)
        return const_controller.get_prod_neg_not_proc(db, is_blocked)
    except RoleException as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ex.message)
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OBJECTS_NOT_FOUND
        )
