from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_reviews(access_token):
    response = client.get(
        "/const/get_reviews?product_id=5",
        headers={"Authorization": access_token},
    )
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0


def test_get_prod_neg(access_token):
    response = client.get(
        "/const/get_prod_neg_not_proc?is_blocked=5",
        headers={"Authorization": access_token},
    )
    assert response.status_code == 200
    result = response.json()
    assert len(result) > 0
