from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_all_platforms():
    response = client.get("/const/get_platforms")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0

def test_get_all_genres():
    response = client.get("/const/get_genres")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0

def test_get_all_characteristics():
    response = client.get("/const/get_characteristics")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0

def test_get_all_publishers():
    response = client.get("/const/get_publishers")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0