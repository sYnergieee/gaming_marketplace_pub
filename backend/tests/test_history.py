from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_all_sales(access_token):
    response = client.get(
        "/const/get_history_self_sales", headers={"Authorization": access_token}
    )
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_all_cust(access_token):
    response = client.get(
        "/const/get_history_self_cust", headers={"Authorization": access_token}
    )
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0
