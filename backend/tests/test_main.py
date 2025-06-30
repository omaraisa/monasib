import pytest
import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert data["version"] == "1.0.0"


def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code in [200, 503]  # Healthy or unhealthy
    data = response.json()
    assert "status" in data
    assert "timestamp" in data


def test_metrics_endpoint():
    """Test the metrics endpoint"""
    response = client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "database_size_mb" in data
    assert "timestamp" in data


def test_analysis_endpoint():
    """Test the analysis endpoint with valid criteria"""
    test_criteria = {
        "criteria": {
            "competitors": {"value": 500, "weight": 50},
            "foot_traffic": {"value": 7, "weight": 50}
        },
        "totalWeight": 100
    }
    
    response = client.post("/analysis", json=test_criteria)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "total_locations_analyzed" in data
    assert "suitable_locations_found" in data
    assert "best_location" in data


def test_analysis_endpoint_no_criteria():
    """Test the analysis endpoint with no criteria"""
    response = client.post("/analysis", json={"criteria": {}})
    assert response.status_code == 400


def test_get_parameters():
    """Test the parameters endpoint"""
    response = client.get("/parameters")
    assert response.status_code == 200
    data = response.json()
    assert "parameters" in data


def test_get_layers():
    """Test the layers endpoint"""
    response = client.get("/layers")
    assert response.status_code == 200
    data = response.json()
    assert "layers" in data


def test_generate_report():
    """Test the report generation endpoint"""
    test_data = {
        "analysisResults": {
            "total_locations_analyzed": 100,
            "suitable_locations_found": 20,
            "best_location": {
                "suitability_score": 85.5,
                "coordinates": "40.7128, -74.0060"
            },
            "analysis_summary": {
                "average_score": 65.2,
                "median_score": 67.8,
                "parameters_count": 3
            }
        }
    }
    
    response = client.post("/report", json=test_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "generated"
    assert "report" in data


def test_frontend_serving():
    """Test that frontend files are served correctly"""
    response = client.get("/app")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/html")


def test_static_files():
    """Test static file serving"""
    response = client.get("/app.js")
    assert response.status_code == 200
    
    response = client.get("/style.css")
    assert response.status_code == 200
