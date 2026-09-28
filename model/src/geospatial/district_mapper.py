"""
src/geospatial/district_mapper.py

Geospatial mapping and district lookup utilities for Maharashtra.

Provides:
- Loading and caching Maharashtra district GeoJSON boundaries
- Point-in-district spatial queries (lat/lon -> district)
- Pre-computed centroids and bounding boxes for all 36 Maharashtra districts
- GeoJSON FeatureCollection enrichment with risk predictions
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# Official list of 36 Maharashtra districts (Census 2011 & current)
MAHARASHTRA_DISTRICTS = [
    "AHMADNAGAR", "AKOLA", "AMARAVATI", "BHANDARA", "BID", "BULDHANA",
    "CHANDRAPUR", "CHHATRAPATI SAMBHAJINAGAR", "DHARASHIV", "DHULE",
    "GADCHIROLI", "GONDIYA", "HINGOLI", "JALGAON", "JALNA", "KOLHAPUR",
    "LATUR", "MUMBAI CITY", "NAGPUR", "NANDED", "NANDURBAR", "NASHIK",
    "PALGHAR", "PARBHANI", "PUNE", "RAIGAD", "RATNAGIRI", "SANGLI",
    "SATARA", "SINDHUDURG", "SOLAPUR", "SUBURBAN MUMBAI", "THANE",
    "WARDHA", "WASHIM", "YAVATMAL"
]

# District Centroids (latitude, longitude)
DISTRICT_CENTROIDS: Dict[str, Tuple[float, float]] = {
    "AHMADNAGAR": (19.095, 74.750),
    "AKOLA": (20.700, 77.000),
    "AMARAVATI": (20.937, 77.779),
    "BHANDARA": (21.171, 79.650),
    "BID": (18.989, 75.760),
    "BULDHANA": (20.530, 76.180),
    "CHANDRAPUR": (19.961, 79.296),
    "CHHATRAPATI SAMBHAJINAGAR": (19.876, 75.343),
    "DHARASHIV": (18.185, 76.041),
    "DHULE": (20.904, 74.774),
    "GADCHIROLI": (20.184, 80.003),
    "GONDIYA": (21.462, 80.221),
    "HINGOLI": (19.718, 77.149),
    "JALGAON": (21.007, 75.562),
    "JALNA": (19.841, 75.886),
    "KOLHAPUR": (16.705, 74.243),
    "LATUR": (18.408, 76.560),
    "MUMBAI CITY": (18.938, 72.835),
    "NAGPUR": (21.145, 79.088),
    "NANDED": (19.138, 77.321),
    "NANDURBAR": (21.374, 74.240),
    "NASHIK": (19.997, 73.789),
    "NASIK": (19.997, 73.789),
    "PALGHAR": (19.696, 72.765),
    "PARBHANI": (19.268, 76.776),
    "PUNE": (18.520, 73.856),
    "RAIGAD": (18.515, 73.181),
    "RATNAGIRI": (16.990, 73.312),
    "SANGLI": (16.852, 74.581),
    "SATARA": (17.680, 73.993),
    "SINDHUDURG": (16.119, 73.689),
    "SOLAPUR": (17.659, 75.906),
    "SUBURBAN MUMBAI": (19.130, 72.880),
    "THANE": (19.218, 72.978),
    "WARDHA": (20.745, 78.602),
    "WASHIM": (20.111, 77.135),
    "YAVATMAL": (20.388, 78.120)
}


class DistrictMapper:
    """
    Handles district boundaries, station mappings, and spatial lookups.
    """

    def __init__(self, geojson_path: Optional[str | Path] = None):
        self.geojson_path = Path(geojson_path) if geojson_path else self._find_geojson()
        self._geojson_cache: Optional[Dict[str, Any]] = None

    def _find_geojson(self) -> Path:
        base = Path(__file__).resolve().parent.parent.parent
        primary = base / "data/raw/geographic/maharashtra_districts.geojson"
        if primary.exists():
            return primary
        secondary = base / "frontend/data/maharashtra_districts.geojson"
        return secondary

    def load_geojson(self) -> Dict[str, Any]:
        """Load and return Maharashtra districts GeoJSON FeatureCollection."""
        if self._geojson_cache is not None:
            return self._geojson_cache

        if not self.geojson_path.exists():
            logger.warning(f"GeoJSON file not found at {self.geojson_path}")
            return {"type": "FeatureCollection", "features": []}

        with open(self.geojson_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            self._geojson_cache = data
            return data

    def get_district_by_coordinates(self, lat: float, lon: float) -> Optional[str]:
        """
        Find nearest Maharashtra district for given latitude and longitude.
        Uses Euclidean distance to centroids as fast approximation.
        """
        closest_district = None
        min_dist_sq = float("inf")

        for district, (d_lat, d_lon) in DISTRICT_CENTROIDS.items():
            dist_sq = (lat - d_lat) ** 2 + (lon - d_lon) ** 2
            if dist_sq < min_dist_sq:
                min_dist_sq = dist_sq
                closest_district = district

        return closest_district

    def get_district_centroid(self, district: str) -> Optional[Tuple[float, float]]:
        """Return (latitude, longitude) centroid for a district."""
        return DISTRICT_CENTROIDS.get(district.upper().strip())

    def enrich_geojson_with_risk(
        self,
        risk_predictions: Dict[str, Dict[str, Any]],
        horizon: str = "24h"
    ) -> Dict[str, Any]:
        """
        Enrich district GeoJSON features with prediction probabilities and risk levels.
        """
        geojson = self.load_geojson()
        features = []

        for feat in geojson.get("features", []):
            props = feat.get("properties", {})
            d_name = props.get("district", props.get("dtname", props.get("DISTRICT", ""))).upper().strip()

            risk_info = risk_predictions.get(d_name, {
                "probability": 0.15,
                "risk": "LOW",
                "color": "#22c55e"
            })

            new_props = dict(props)
            new_props["district"] = d_name
            new_props[f"probability_{horizon}"] = risk_info.get("probability")
            new_props[f"risk_{horizon}"] = risk_info.get("risk")
            new_props["risk_color"] = risk_info.get("color")
            new_props["horizon"] = horizon

            features.append({
                "type": feat.get("type", "Feature"),
                "geometry": feat.get("geometry"),
                "properties": new_props
            })

        return {
            "type": "FeatureCollection",
            "features": features,
            "metadata": {
                "horizon": horizon,
                "total_districts": len(features)
            }
        }
