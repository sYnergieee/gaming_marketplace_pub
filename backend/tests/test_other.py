from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_all_roles():
    response = client.get("/user/get_roles")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_all_appls():
    response = client.get("/const/get_applications")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_all_statuses():
    response = client.get("/const/get_statuses")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0