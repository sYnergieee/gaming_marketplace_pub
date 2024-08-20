from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from database.db_models.customer import Customer

CustomerDB = sqlalchemy_to_pydantic(Customer)


class FullCustomer(CustomerDB):
    count_purshase: int
    count_reviews: dict
