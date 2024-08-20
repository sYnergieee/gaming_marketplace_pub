from fastapi.testclient import TestClient
from httpx import Headers
from main import app


client = TestClient(app)


def test_get_img():
    response = client.get("/img/1_game.jpg")
    assert response.status_code == 200
    assert response.headers == Headers({'content-type': 'image/jpg'})
