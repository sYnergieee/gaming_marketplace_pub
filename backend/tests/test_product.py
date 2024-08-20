from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_product_curr():
    response = client.get("/const/get_curr_product?product_id=5")
    assert response.status_code == 200
    result = response.json()
    assert "id" in result


def test_get_game_with_prods():
    response = client.get("/const/get_curr_game?game_id=1")
    assert response.status_code == 200
    result = response.json()
    assert "id" in result