# DATA QUALITY REPORT - Maharashtra Proactive Flood Prediction System

Generated: 2026-09-12
Phase: Phase 1 - Data Audit
Status: ML training NOT yet possible - see MISSING_DATA.md

IMPORTANT DISCLAIMER: This is a research/decision-support system.
It does not replace official government flood warnings from IMD, CWC, or NDMA.

---

## DATASETS FOUND

### Dataset 1: Rainfall - Statewise Daily (IMD)

Filename:              rainfall_statewise_daily_imd.csv
Location:              data/raw/rainfall/
File Size:             0.16 MB
Total Rows:            961
Total Columns:         21
Temporal Resolution:   Daily
Min Date:              2026-08-19
Max Date:              2026-09-11
Date Range Span:       24 DAYS ONLY
States Covered:        41 states/UTs
Maharashtra Records:   24 rows (1 per day)
Districts:             N/A - state-level only
Stations:              N/A - state-level aggregates
Latitude/Longitude:    NOT PRESENT
Missing Values:        0
Duplicate Rows:        0

Columns:
  State, Date, Daily Actual (mm), Daily Normal (mm), Daily Departure Per (%),
  Daily Category, Week Date, Weekly Actual, Weekly Normal, Weekly Departure Per,
  Weekly Category, Cumulative Date, Cumulative Actual, Cumulative Normal,
  Cumulative Departure Per, Cumulative Category, Monthly Date, Monthly Actual,
  Monthly Normal, Monthly Departure Per, Monthly Category

Data Quality Issues:
  - Column names contain embedded newlines (multiline CSV headers)
  - No latitude/longitude - cannot use for spatial features
  - Daily Actual values are state-wide averages

Training Suitability: INSUFFICIENT
  - Date range: Only 24 days (need minimum 3 years)
  - No geographic granularity below state level
  - No flood labels can be generated from this alone

---

### Dataset 2: Rainfall - Districtwise Daily (IMD)

Filename:              rainfall_districtwise_daily_imd.csv
Location:              data/raw/rainfall/
File Size:             2.77 MB
Total Rows:            17,457
Total Columns:         22
Temporal Resolution:   Daily
Min Date:              2026-08-19
Max Date:              2026-09-11
Date Range Span:       24 DAYS ONLY
States Covered:        39 states/UTs
Maharashtra Records:   864 rows
Distinct Dates (MH):  24
Maharashtra Districts: 36
Stations:              N/A - district-level aggregates
Latitude/Longitude:    NOT PRESENT
Missing Values:        0
Duplicate Rows:        0

Maharashtra Districts (36):
  AHMADNAGAR, AKOLA, AMARAVATI, BHANDARA, BID, BULDHANA, CHANDRAPUR,
  CHHATRAPATI SAMBHAJINAGAR, DHARASHIV, DHULE, GADCHIROLI, GONDIYA,
  HINGOLI, JALGAON, JALNA, KOLHAPUR, LATUR, MUMBAI CITY, NAGPUR,
  NANDED, NANDURBAR, NASIK, PALGHAR, PARBHANI, PUNE, RAIGAD,
  RATNAGIRI, SANGLI, SATARA, SINDHUDURG, SOLAPUR, SUBURBAN MUMBAI,
  THANE, WARDHA, WASHIM, YAVATMAL

Rainfall Range (Maharashtra): 0 mm to 48.2 mm daily

Training Suitability: INSUFFICIENT
  - Date range: Only 24 days (need minimum 3 years)
  - No hourly resolution available
  - No flood labels can be generated

---

### Dataset 3: River Discharge - Manual Daily (CWC Maharashtra)

Filename:              river_discharge_manual_daily_cwc_mh_2026_2030.csv
Location:              data/raw/river_discharge/
File Size:             1.34 MB
Total Rows:            9,664
Total Columns:         20
Temporal Resolution:   Daily (~09:00 manual observation)
Min Date:              2026-01-01
Max Date:              2026-09-04
Date Range Span:       ~247 days (LESS THAN 1 YEAR)
State:                 Maharashtra ONLY
Agency:                Central Water Commission (CWC)
Unique Stations:       53
Districts Covered:     19
Rivers:                7
Basins:                3
Missing Discharge:     0
Zero Discharge:        4,875 (50.4%)
Non-zero Readings:     4,789 (49.6%)
Min Non-zero:          0.057 m3/sec
Max Discharge:         39,507 m3/sec
Latitude Present:      YES - all stations
Longitude Present:     YES - all stations

FILENAME WARNING: The filename states "2026_2030" but actual data only covers
Jan 2026 to Sep 2026. The "2030" in the filename is MISLEADING.

53 Gauge Stations:
  Aheri (Gudem Bridge), Anjanari, Arjunwad (Seasonal), Ashti, Badlapur,
  Bamni (Ballarsha), Belne Bridge, Betmogra, Degloor, Dhalegaon,
  Dhanora (Wardha), Dhond, G.R.BRIDGE, Jogisakhra, Karad, Kopergaon,
  KURUNDWAD, Mahagaon (Pus), Mahalgaon, Mangaon, Mouda, Mungoli (Township),
  Muradpur, Nagari, Nanded, Nandgaon, NANDRE, Narsingpur, P.G. Bridge,
  Pachegaon, Paragaon, Patala, Patansaongi, Phulgaon, Pratappur, Purad,
  Purna, Rahu, Rajoli, Sakhra (Wadsa), Sakmur, Salebardi, Samdoli (Seasonal),
  Sarati, Satrapur, Takli, Targaon, Terwad (Seasonal), Wadakbal,
  Wairagarh, Warunji, Yelli, Zari

19 Districts with Station Coverage:
  Ahmadnagar, Bhandara, Chandrapur, Gadchiroli, Gondia, Kolhapur,
  Nagpur, Nanded, Parbhani, Pune, Raigad, Ratnagiri, Sangli, Satara,
  Sindudurg, Solapur, Thane, Wardha, Yavatmal

Rivers: Gad, Godavari, Kajvi, Krishna, Savitri, Ulhas, Vashisti

Basins: Godavari, Krishna, West flowing rivers from Tapi to Tadri

Columns:
  SlNo, Station, Agency, State LGD Code, State, District LGD Code,
  District, Tehsil, Block, Village, River, Basin, Tributary, Subtributary,
  SubSubtributary, Local River, Latitude, Longitude, Data Acquisition Time,
  Manual Daily River Water Discharge (m3/sec)

Training Suitability: INSUFFICIENT
  - Date range: Less than 1 year (Jan-Sep 2026)
  - Cannot perform chronological train/val/test split with <1 year
  - Zero flood labels available
  - 50% zero discharge readings require validation (seasonal rivers expected)

---

## CURRENT PROJECT STATUS

Data Available:
  - Rainfall (statewise): 24 days, Aug-Sep 2026
  - Rainfall (districtwise): 24 days, Aug-Sep 2026, 36 MH districts
  - River discharge (station): ~8 months, Jan-Sep 2026, 53 stations

Data Missing (CRITICAL):
  - Historical flood events: NONE
  - River water level: NONE
  - Weather data: NONE
  - Multi-year rainfall history: NONE

Can ML Training Start? NO

Reason:
  1. All rainfall data covers only 24 days. Minimum 3 years needed.
  2. River discharge covers less than 1 year. No chronological split possible.
  3. ZERO verified historical flood events. Flood labels cannot be created.
  4. No weather data (temperature, humidity, pressure, wind).

Next Exact Step:
  Acquire datasets listed in MISSING_DATA.md.
  Priority: Historical flood events from CWC/NDMA/NRSC (2010-2025).
  Without flood labels, ML training cannot begin.
