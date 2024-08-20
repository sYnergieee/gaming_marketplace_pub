from fastapi.testclient import TestClient

from tests.data import *
from main import app

client = TestClient(app)


def test_signin():
    response = client.post(
        "/user/signin", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    )
    assert response.status_code == 200
    result = response.json()
    assert "access_token" in result
    assert "refresh_token" in result


def test_refresh_token(refresh_token):
    response = client.get(
        "/user/refresh_token", headers={"Authorization": f"Bearer {refresh_token}"}
    )
    assert response.status_code == 200
    result = response.json()
    assert "access_token" in result
