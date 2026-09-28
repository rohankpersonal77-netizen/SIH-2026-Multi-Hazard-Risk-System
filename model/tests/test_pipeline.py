"""
tests/test_pipeline.py

Unit tests for data loaders, features, risk classifier, geospatial mapper, alerts, and API.
"""

from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from src.utils.config_loader import load_config, get_project_root
from src.models.risk_classifier import RiskClassifier
from src.geospatial.district_mapper import DistrictMapper
from src.alerts.alert_manager import AlertManager
from src.prediction.predictor import FloodPredictor
from src.data.loaders import load_districtwise_rainfall, load_statewise_rainfall, load_river_discharge
from src.features.engineering import compute_daily_rainfall_features
from src.api.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_config_loader():
    cfg = load_config()
    assert "project" in cfg
    assert cfg["project"]["state"].lower() == "maharashtra"


def test_risk_classifier():
    clf = RiskClassifier()
    assert clf.classify(0.10) == "LOW"
    assert clf.classify(0.45) == "MEDIUM"
    assert clf.classify(0.70) == "HIGH"
    assert clf.classify(0.92) == "EXTREME"
    assert clf.get_color(0.92) == "#ef4444"
    assert clf.get_color(0.10) == "#22c55e"


def test_district_mapper():
    dm = DistrictMapper()
    geojson = dm.load_geojson()
    assert geojson["type"] == "FeatureCollection"
    assert len(geojson["features"]) == 36

    # Test coordinate lookup
    nearest = dm.get_district_by_coordinates(16.705, 74.243)
    assert nearest == "KOLHAPUR"


def test_alert_manager():
    am = AlertManager()
    alert = am.generate_cap_alert(
        district="Kolhapur",
        risk_level="EXTREME",
        probability=0.92,
        horizon="24h",
        rainfall_mm=180.0,
        discharge_m3s=8950.0
    )
    assert alert["msgType"] == "Alert"
    assert alert["info"]["severity"] == "Extreme"
    assert "Kolhapur" in alert["info"]["headline"]


def test_flood_predictor():
    pred = FloodPredictor()
    res = pred.predict_location("Kolhapur")
    assert "probability_6h" in res
    assert "probability_12h" in res
    assert "probability_24h" in res
    assert res["probability_24h"] >= res["probability_6h"]
    assert res["risk_24h"] in ["LOW", "MEDIUM", "HIGH", "EXTREME"]


def test_data_loaders():
    root = get_project_root()
    rf_path = root / "data/raw/rainfall/rainfall_districtwise_daily_imd.csv"
    if rf_path.exists():
        df_rf = load_districtwise_rainfall(rf_path)
        assert not df_rf.empty
        assert "daily_actual_mm" in df_rf.columns
        assert "district" in df_rf.columns

    rd_path = root / "data/raw/river_discharge/river_discharge_manual_daily_cwc_mh_2026_2030.csv"
    if rd_path.exists():
        df_rd = load_river_discharge(rd_path)
        assert not df_rd.empty
        assert "discharge_m3s" in df_rd.columns
        assert "station" in df_rd.columns


def test_api_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


def test_api_model_status(client):
    res = client.get("/model/status")
    assert res.status_code == 200
    data = res.json()
    assert "model_available" in data
    assert "data_status" in data


def test_api_predict(client):
    payload = {
        "district": "Kolhapur",
        "rainfall_24h": 120.0,
        "river_discharge": 6500.0
    }
    res = client.post("/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["district"] == "Kolhapur"
    assert "probability_24h" in data
    assert data["risk_24h"] in ["LOW", "MEDIUM", "HIGH", "EXTREME"]


def test_api_risk_map(client):
    res = client.get("/risk-map?horizon=24h")
    assert res.status_code == 200
    geojson = res.json()
    assert geojson["type"] == "FeatureCollection"
    assert len(geojson["features"]) == 36
    # Check that properties contain required color & risk fields
    props = geojson["features"][0]["properties"]
    assert "risk_24h" in props
    assert "risk_color" in props


def test_api_stations(client):
    res = client.get("/stations")
    assert res.status_code == 200
    data = res.json()
    assert "stations" in data
    assert data["count"] > 0


def test_api_alerts(client):
    res = client.get("/alerts?horizon=24h")
    assert res.status_code == 200
    data = res.json()
    assert "alerts" in data
    assert data["count"] > 0
