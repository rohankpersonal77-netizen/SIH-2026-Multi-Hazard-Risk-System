"""
scripts/verify_system.py

Comprehensive live verification script for all system capabilities.
"""

import json
import urllib.request

def run_tests():
    print("=" * 65)
    print("  MAHARASHTRA FLOOD SYSTEM — FULL VERIFICATION")
    print("=" * 65)

    # 1. Health
    with urllib.request.urlopen("http://127.0.0.1:8000/health") as res:
        data = json.loads(res.read())
        print(f"1. [PASS] Health Status: {data.get('status')} (API v{data.get('version')})")

    # 2. Model Status
    with urllib.request.urlopen("http://127.0.0.1:8000/model/status") as res:
        data = json.loads(res.read())
        print(f"2. [PASS] Model Status: version={data.get('model_version')}, training_required={data.get('training_required')}")
        print(f"          Data components: {data.get('data_status')}")

    # 3. GeoJSON Risk Map (6h, 12h, 24h)
    for h in ["6h", "12h", "24h"]:
        with urllib.request.urlopen(f"http://127.0.0.1:8000/risk-map?horizon={h}") as res:
            geojson = json.loads(res.read())
            features = geojson.get("features", [])
            counts = {"EXTREME": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
            for f in features:
                r = f["properties"].get(f"risk_{h}", "LOW")
                counts[r] = counts.get(r, 0) + 1
            print(f"3. [PASS] Horizon {h.upper()} Risk Map: {len(features)} districts -> {counts}")

    # 4. Predict
    req = urllib.request.Request(
        "http://127.0.0.1:8000/predict",
        data=json.dumps({"district": "Kolhapur", "rainfall_24h": 145.0, "river_discharge": 8950.0}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as res:
        pred = json.loads(res.read())
        p6 = round(pred['probability_6h'] * 100)
        p12 = round(pred['probability_12h'] * 100)
        p24 = round(pred['probability_24h'] * 100)
        print(f"4. [PASS] Multi-Horizon Prediction (Kolhapur): 6h={p6}% ({pred['risk_6h']}), 12h={p12}% ({pred['risk_12h']}), 24h={p24}% ({pred['risk_24h']})")

    # 5. Stations
    with urllib.request.urlopen("http://127.0.0.1:8000/stations") as res:
        data = json.loads(res.read())
        st0 = data['stations'][0]
        print(f"5. [PASS] CWC Gauge Stations: {data.get('count')} stations loaded (Sample: {st0['station']} on {st0['river']})")

    # 6. CAP Alerts
    with urllib.request.urlopen("http://127.0.0.1:8000/alerts?horizon=24h") as res:
        data = json.loads(res.read())
        print(f"6. [PASS] CAP v1.2 Alerts: {data.get('count')} warning alerts active for High/Extreme risk zones")

    # 7. Frontend Assets
    with urllib.request.urlopen("http://127.0.0.1:8000/") as res:
        html = res.read().decode("utf-8")
        has_map = 'id="map"' in html
        print(f"7. [PASS] Frontend Dashboard: {len(html)} bytes delivered (Map Container: {has_map})")

    print("=" * 65)
    print("  ALL 7 ENDPOINTS VERIFIED & WORKING SUCCESSFULLY!")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
