from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_all_games():
    response = client.get("/const/get_games")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_game_cur():
    response = client.get("/const/get_curr_game_short?game_id=1")
    assert response.status_code == 200
    result = response.json()
    assert "id" in result