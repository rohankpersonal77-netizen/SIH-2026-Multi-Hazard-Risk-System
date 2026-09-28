# MISSING DATA REPORT - Maharashtra Flood Prediction System

Generated: 2026-09-12
Phase: Phase 1 - Data Audit

This document lists all datasets required for ML training that are currently absent.
ML training CANNOT start until the CRITICAL items are acquired.

---

## MISSING DATASET 1 (CRITICAL): Historical Flood Events

Dataset:          Verified historical flood events for Maharashtra
Why Needed:       Cannot create flood labels (flood_next_6h/12h/24h) without this.
                  This is the target variable for supervised ML training.
                  Generating random labels is PROHIBITED.
Recommended Sources:
  1. Central Water Commission (CWC) - Flood Management Information System
     URL: http://fmis.cwc.gov.in
     Data: Annual Flood Report, station-wise flood events with dates and levels
  2. National Disaster Management Authority (NDMA)
     URL: https://ndma.gov.in
     Data: District-wise flood event records
  3. National Remote Sensing Centre (NRSC) - Bhuvan Flood Portal
     URL: https://bhuvan.nrsc.gov.in/disaster/disaster.php
     Data: Satellite-verified flood extents and dates
  4. India Water Resources Information System (WRIS)
     URL: https://indiawris.gov.in
     Data: Hydrological event data by basin/station
  5. Maharashtra Water Resources Department
     URL: https://mwrd.org or https://mahawrd.org
     Data: State-level flood event records
  6. NDMA Annual Reports (2010-2025) - available as PDF
     Must be digitized if no structured CSV available
Required Date Range: 2010-2025 (minimum), 2000-2025 (preferred)
Required Fields:
  EventID, Start Date, End Date, Peak Flood Level, Peak Flood Date,
  Peak Discharge, Peak Discharge Date, Flood Volume, Event Duration,
  Time to Peak, Recession Time, Flood Type, District, Station, River, Basin
Priority: CRITICAL - Without this, no ML training is possible

---

## MISSING DATASET 2 (CRITICAL): Multi-Year Historical Rainfall

Dataset:          Daily rainfall records for Maharashtra, 2010-2025
Why Needed:       Current data covers only 24 days (Aug-Sep 2026).
                  ML training requires at minimum 3-5 years of data.
                  Features like rainfall_7d, rainfall_48h require consecutive records.
Recommended Sources:
  1. IMD Open Data Portal
     URL: https://imdpune.gov.in or https://dsp.imdpune.gov.in
     Data: Daily station rainfall for Maharashtra stations
  2. India Meteorological Department - Climate Data Store
     Contact: climatescience@imd.gov.in
     Data: Historical daily rainfall by district/station
  3. data.gov.in
     URL: https://data.gov.in
     Search: "IMD rainfall Maharashtra"
  4. Open-Meteo Historical API (free, no registration)
     URL: https://open-meteo.com/en/docs/historical-weather-api
     Data: ERA5 reanalysis daily/hourly precipitation
     Resolution: ~9km grid, 1940-present
     NOTE: This is model-reanalysis data, not station observations
Required Date Range: 2010-01-01 to present
Required Temporal Resolution: Daily minimum (hourly preferred for 6h/12h features)
Required Geographic Coverage: All 36 Maharashtra districts or gauge stations
Priority: CRITICAL - Without multi-year data, chronological split impossible

---

## MISSING DATASET 3 (CRITICAL): Multi-Year River Discharge History

Dataset:          Historical river discharge for Maharashtra stations, 2010-2025
Why Needed:       Current data covers only Jan-Sep 2026 (<1 year).
                  Need multi-year data to compute features like:
                  historical_flood_count, days_since_last_flood,
                  seasonal discharge baselines for anomaly detection.
Recommended Sources:
  1. Central Water Commission - India-WRIS
     URL: https://indiawris.gov.in/wris/#/DataDownload
     Data: Historical daily discharge at all CWC gauge stations
  2. CWC Real-Time Flood Monitoring System
     URL: http://www.cwc.gov.in/rtdas
     Data: Real-time + historical discharge
  3. CWC Annual Report on Floods (digitized tables)
Priority: CRITICAL

---

## MISSING DATASET 4 (HIGH): River Water Level

Dataset:          River water level / gauge height for Maharashtra stations
Why Needed:       Flood prediction is more directly tied to water level than discharge.
                  Features: river_water_level, river_level_change_1h/6h/24h
                  Official "danger level" thresholds are set in terms of water level.
Recommended Sources:
  1. CWC Real-Time Flood Monitoring - Maharashtra
     URL: http://www.cwc.gov.in/rtdas
     Data: Stage (water level in meters) at all gauge stations
  2. India-WRIS Data Portal
     URL: https://indiawris.gov.in
  3. Maharashtra Flood Control Room (during monsoon season)
Required Units: Meters above sea level or datum
Priority: HIGH - Major flood predictor

---

## MISSING DATASET 5 (HIGH): Weather Data

Dataset:          Historical weather data for Maharashtra
Why Needed:       Temperature, humidity, pressure, and wind are important
                  co-predictors for rainfall intensity and flood risk.
Recommended Sources:
  1. Open-Meteo Historical API (FREE, no registration required)
     URL: https://open-meteo.com/en/docs/historical-weather-api
     Provides: temperature, humidity, pressure, wind, precipitation
     Resolution: Hourly, ~9km grid, 1940-present
     Status: Can be connected immediately via API
  2. IMD Agro-Meteorological Services
     Contact: agmet@imd.gov.in
  3. NASA POWER API (FREE)
     URL: https://power.larc.nasa.gov/api
     Provides: Temperature, humidity, wind at daily resolution
Required Variables: temperature_2m, relative_humidity_2m, surface_pressure,
                    wind_speed_10m, wind_direction_10m
Required Resolution: Daily minimum (hourly preferred)
Priority: HIGH - Required for full feature set

---

## MISSING DATASET 6 (MEDIUM): Geographic Data

Dataset:          Maharashtra geographic/topographic data
Why Needed:       Elevation, slope, soil type, land cover are important
                  for determining flood susceptibility of an area.
Recommended Sources:
  1. Shuttle Radar Topography Mission (SRTM) 30m DEM
     URL: https://earthexplorer.usgs.gov (free download)
     Data: Elevation and slope (derived) for Maharashtra
  2. BHUVAN - NRSC India
     URL: https://bhuvan.nrsc.gov.in
     Data: Maharashtra district boundaries (GeoJSON), land use/cover
  3. Survey of India Open Data
     URL: https://onlinemaps.surveyofindia.gov.in
  4. Administrative boundaries: Datameet India GIS
     URL: https://github.com/datameet/maps/tree/master/Districts
     Data: Maharashtra district polygons (GeoJSON) - FREE
Required Files:
  - maharashtra_districts.geojson (district polygon boundaries)
  - maharashtra_dem_30m.tif (digital elevation model)
  - maharashtra_soil_type.shp (soil classification)
  - maharashtra_land_cover.tif (land use/land cover)
Priority: MEDIUM - Required for spatial risk zones on map

---

## SUMMARY

| Priority | Dataset | Status | Blocker? |
|----------|---------|--------|----------|
| CRITICAL | Historical flood events (2010-2025) | MISSING | YES |
| CRITICAL | Multi-year rainfall (2010-2025) | MISSING | YES |
| CRITICAL | Multi-year river discharge (2010-2025) | MISSING | YES |
| HIGH | River water level data | MISSING | Partial |
| HIGH | Weather data (temp/humidity/pressure/wind) | MISSING | No (Open-Meteo available) |
| MEDIUM | Geographic/DEM data | MISSING | No (map works without it) |

---

## IMMEDIATE ACTIONS POSSIBLE

While acquiring missing data, the following can be done right now:

1. Connect Open-Meteo API for weather data (free, immediate)
2. Download Maharashtra district boundaries from Datameet GitHub (free, immediate)
3. Build the complete project infrastructure
4. Build the interactive map (can show current discharge/rainfall)
5. Build the FastAPI backend (endpoints ready for when data arrives)
6. Implement data loading pipeline for all 3 existing datasets

---

## DATA ACQUISITION TIMELINE ESTIMATE

| Dataset | Source | Time to Acquire |
|---------|--------|----------------|
| Maharashtra GeoJSON boundaries | Datameet GitHub | 5 minutes |
| Open-Meteo historical weather | Free API | 1-2 hours |
| CWC flood events (FMIS) | Registration required | 1-5 days |
| IMD historical rainfall | Request/download | 1-7 days |
| CWC historical discharge | Registration required | 1-7 days |
