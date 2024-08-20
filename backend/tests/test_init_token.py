import json
from fastapi.testclient import TestClient

from main import app
from tests.data import *

client = TestClient(app)


def test_init_token_salesman():
    response = client.post(
        "/user/signin", json={"email": SALESMAN_EMAIL, "password": SALESMAN_PASSOWRD}
    )
    result = response.json()
    with open(PATH_2_TOKEN, "w") as outfile:
        json.dump(result, outfile)


def test_init_token_customer():
    response = client.post(
        "/user/signin", json={"email": CUSTOMER_EMAIL, "password": CUSTOMER_PASSOWRD}
    )
    result = response.json()
    with open(PATH_2_TOKEN, "w") as outfile:
        json.dump(result, outfile)


def test_init_token_admin():
    response = client.post(
        "/user/signin", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    )
    result = response.json()
    with open(PATH_2_TOKEN, "w") as outfile:
        json.dump(result, outfile)


def test_init_refresh_token(refresh_token):
    response = client.get(
        "/user/refresh_token", headers={"Authorization": f"Bearer {refresh_token}"}
    )
    result = response.json()
    with open(PATH_2_TOKEN, "w") as outfile:
        json.dump(result, outfile)
