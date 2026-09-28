# Maharashtra Proactive Flood Prediction & Real-Time Risk Map

[![Python 3.11](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com)
[![Leaflet.js](https://img.shields.io/badge/Leaflet-1.9.4-brightgreen.svg)](https://leafletjs.com)
[![Tests](https://img.shields.io/badge/tests-12%20passed-brightgreen.svg)]()

> **IMPORTANT DISCLAIMER**
> This is a **research and decision-support system**. It is designed to assist researchers and disaster management authorities with proactive hydrological risk assessment. **It does not claim to replace official government flood warnings from the India Meteorological Department (IMD), Central Water Commission (CWC), or National Disaster Management Authority (NDMA).**

---

## 1. Project Overview

This project implements a complete, end-to-end Python pipeline and interactive geospatial dashboard for proactive flood risk prediction in **Maharashtra, India**, with support for:

* **6-Hour Forecast Horizon** (⚡ Flash flood / immediate response)
* **12-Hour Forecast Horizon** (🕛 Intermediate catchment runoff)
* **24-Hour Forecast Horizon** (📅 Daily cumulative inundation risk)

The geographical risk is rendered live on an **interactive Maharashtra map** using Leaflet.js with standard disaster color coding:
* 🟢 **LOW RISK** (0% – 30% flood probability)
* 🟡 **MEDIUM RISK** (30% – 60% flood probability)
* 🟠 **HIGH RISK** (60% – 80% flood probability)
* 🔴 **EXTREME RISK** (80% – 100% flood probability)

---

## 2. End-to-End Pipeline Architecture

```text
Historical Rainfall (IMD)
        +
Historical River Discharge (CWC)
        +
River Water Level & Weather Observations
        +
Maharashtra Geographic Boundaries (GeoJSON)
        +
Verified Historical Flood Events
        ↓
Data Cleaning & Standardized Ingestion (src/data/loaders.py)
        ↓
Data Integration & Geospatial Alignment (src/geospatial/district_mapper.py)
        ↓
Feature Engineering (src/features/engineering.py)
        ↓
Multi-Horizon ML Inference / Hydrological Proxy (src/prediction/predictor.py)
        ↓
Risk Classification: LOW / MEDIUM / HIGH / EXTREME (src/models/risk_classifier.py)
        ↓
FastAPI Backend (src/api/main.py)
        ↓
Interactive Leaflet Web Application (frontend/index.html & js/map.js)
        ↓
Common Alerting Protocol (CAP v1.2) Warnings (src/alerts/alert_manager.py)
```

---

## 3. Phase 1 Data Audit Report (Section 43)

### DATASETS FOUND

| Attribute | Dataset 1: Rainfall (Statewise) | Dataset 2: Rainfall (Districtwise) | Dataset 3: River Discharge (Stationwise) |
| :--- | :--- | :--- | :--- |
| **Filename** | `rainfall_statewise_daily_imd.csv` | `rainfall_districtwise_daily_imd.csv` | `river_discharge_manual_daily_cwc_mh_2026_2030.csv` |
| **Source Agency** | IMD | IMD | Central Water Commission (CWC) |
| **Total Rows** | 961 | 17,457 | 9,664 |
| **Total Columns** | 21 | 22 | 20 |
| **Temporal Resolution** | Daily | Daily | Daily (~09:00 observation) |
| **Date Range** | 2026-08-19 to 2026-09-11 | 2026-08-19 to 2026-09-11 | 2026-01-01 to 2026-09-04 |
| **Span** | **24 Days Only** | **24 Days Only** | **~247 Days (< 1 Year)** |
| **Maharashtra Records** | 24 rows | 864 rows | 9,664 rows (100% Maharashtra) |
| **Districts Covered** | State-level aggregate | 36 Districts | 19 Districts |
| **Stations** | N/A | N/A | 53 CWC Gauge Stations |
| **Coordinates** | None | None | Latitude & Longitude present for all 53 stations |
| **Missing Values** | 0 | 0 | 0 (50.4% seasonal zero discharge recorded) |
| **Training Suitability** | **INSUFFICIENT** | **INSUFFICIENT** | **INSUFFICIENT** |

### MISSING DATA

* **Verified Historical Flood Events**: Missing (Needs 2010–2025 records with dates, depths, affected talukas/villages).
* **Multi-Year Rainfall Records**: Missing (Current data is only 24 days; minimum 3–5 monsoon seasons needed for chronological train/val/test splits without leakage).
* **Historical River Water Level**: Missing (Required for stage-discharge rating curve validation).
* **Real-time Weather**: Missing (Relative humidity, atmospheric pressure, temperature).

### CURRENT PROJECT STATUS

* **Data Available**: IMD Daily Rainfall (Aug-Sep 2026), CWC Daily River Discharge (53 stations, Jan-Sep 2026), Maharashtra District GeoJSON boundaries (36 districts).
* **Data Missing**: Historical verified flood events (2010–2025), multi-year rainfall history.
* **Can ML Training Start?**: **NO**
* **Reason**: Supervised ML models require verified historical ground-truth flood labels and multi-year data to avoid extreme temporal leakage and overfitting.
* **Operating Mode**: The system operates in **Hydrological Data Proxy Mode** (calibrated against CWC river discharge percentiles, IMD rainfall departure, and Western Ghats / Konkan basin vulnerability) until historical event catalogs are integrated.

---

## 4. Quickstart: Running Locally

### Prerequisites
* Python 3.11+
* Modern Web Browser

### 1. Install Dependencies
```powershell
py -3.11 -m pip install -r requirements.txt
```

### 2. Run Test Suite
```powershell
py -3.11 -m pytest tests/ -v
```
All 12 unit tests will execute and pass.

### 3. Start the Application Server
```powershell
py -3.11 scripts/run_server.py
```
Or directly with uvicorn:
```powershell
py -3.11 -m uvicorn src.api.main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Access the Dashboard & API
* **Interactive Risk Map**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
* **Interactive API Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **API Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 5. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Serves the full-screen interactive Leaflet map dashboard |
| `GET` | `/health` | Health check and system version |
| `GET` | `/model/status` | Model status (trained ML vs. hydrological proxy mode) |
| `POST` | `/predict` | Single location 6h, 12h, 24h probability prediction |
| `POST` | `/predict/batch` | Batch multi-district probability predictions |
| `GET` | `/risk-map?horizon=24h` | GeoJSON FeatureCollection of 36 Maharashtra districts with risk colors |
| `GET` | `/stations` | 53 CWC river gauge stations with coordinates & discharge |
| `GET` | `/flood-events` | Verified reference historical flood events in Maharashtra |
| `GET` | `/alerts?horizon=24h` | CAP v1.2 compliant flood risk warnings for high/extreme zones |
| `GET` | `/model/metrics` | Evaluation metrics (ROC-AUC, Brier score, F1) |
| `POST` | `/model/train` | Trigger model training pipeline |

---

## 6. Multi-State Extensibility

The system is configured via `config/config.yaml` with state-isolated parameters:
```yaml
project:
  name: "maharashtra_flood_prediction"
  state: "Maharashtra"
  state_lgd_code: 27
  additional_states_supported: true
```
To onboard additional Indian states (e.g., Assam, Kerala, Gujarat):
1. Add the state's district GeoJSON to `data/raw/geographic/`.
2. Add river gauge stations and rainfall records for that state.
3. Update `config/config.yaml` with the state's LGD code and risk thresholds.


