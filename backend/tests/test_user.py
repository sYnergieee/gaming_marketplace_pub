from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_profile(access_token):
    response = client.get("/user/get_user", headers={"Authorization": access_token})
    assert response.status_code == 200
    result = response.json()
    assert "id" in result


def test_get_all_profiles():
    response = client.get("/user/get_users")
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0
