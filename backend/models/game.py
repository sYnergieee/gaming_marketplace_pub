from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from database.db_models.game import Game
import datetime
from models.characteristic_game import GetCharacteristicGame
from models.customer_product import CustomerProductDB
from models.game_genre import GetGameGenre
from models.game_platform import GetGamePlatform
from models.key import KeyDB
from models.product import FullProduct, ProductDB, ProductWithoutSalesman

from models.publisher import PublisherDB
from models.user import SalesmanUser


GameDB = sqlalchemy_to_pydantic(Game)


class PostGame(BaseModel):
    name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    release_date: datetime.date
    publisher_id: int = Field(ge=1)
    platforms_ids: list[int]
    genres_ids: list[int]


class PutGame(PostGame):
    id: int = Field(ge=1)


class GetGame(GameDB):
    publishers: PublisherDB
    platforms: list[GetGamePlatform]
    characteristics: list[GetCharacteristicGame]
    genres: list[GetGameGenre]


class GetGameHistorySalesman(GameDB):
    products: list[ProductWithoutSalesman]


class ProductWithGameSalesman(ProductDB):
    game: GameDB
    salesmans: SalesmanUser


class KeyWithProductSalesman(KeyDB):
    product: ProductWithGameSalesman


class GetCustomerProduct(CustomerProductDB):
    key: KeyWithProductSalesman


class KeyWithProductSalesmanSecret(KeyDB):
    product: ProductWithGameSalesman

    class Config:
        orm_mode = True
        fields = {"code": {"exclude": True}}


class GetCustomerProductSecret(CustomerProductDB):
    key: KeyWithProductSalesmanSecret


class FullProductWithGame(FullProduct):
    game: GameDB
