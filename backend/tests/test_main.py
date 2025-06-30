import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_perform_analysis():
    response = client.post("/analysis", json={"criteria": {"some_key": "some_value"}})
    assert response.status_code == 200
    assert response.json() == {
        "message": "GIS analysis successful (placeholder)",
        "criteria": {"some_key": "some_value"},
        "layer_1_feature_count": 0
    }
