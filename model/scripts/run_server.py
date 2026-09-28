"""
scripts/run_server.py

Convenience runner to start the Maharashtra Flood Prediction System server.
Serves both the FastAPI REST API and the interactive Leaflet Risk Map.

Usage:
    py -3.11 scripts/run_server.py
"""

import sys
import uvicorn
from pathlib import Path

# Ensure project root is in sys.path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

if __name__ == "__main__":
    print("=" * 65)
    print("  MAHARASHTRA PROACTIVE FLOOD PREDICTION & REAL-TIME RISK MAP")
    print("=" * 65)
    print("  Interactive Map URL : http://127.0.0.1:8000")
    print("  API Documentation   : http://127.0.0.1:8000/docs")
    print("  Health Endpoint     : http://127.0.0.1:8000/health")
    print("  Risk Map GeoJSON    : http://127.0.0.1:8000/risk-map?horizon=24h")
    print("=" * 65)
    print("  DISCLAIMER: Research and Decision-Support System Only.")
    print("  Does NOT replace official warnings from IMD / CWC / NDMA.")
    print("=" * 65)

    uvicorn.run("src.api.main:app", host="127.0.0.1", port=8000, reload=True)
