"""
src/alerts/alert_manager.py

Early Warning Alert Generation and Common Alerting Protocol (CAP) compliance.

Generates structured early flood warning notifications for disaster management
authorities (NDMA/SDMA), local district administrations, and public dashboards.
"""

from __future__ import annotations

import json
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional
import uuid

logger = logging.getLogger(__name__)

# Recommended response actions based on risk category
RECOMMENDED_ACTIONS = {
    "EXTREME": [
        "Immediate evacuation of low-lying floodplains and vulnerable riverbanks.",
        "Activate district Emergency Operation Centers (DEOCs) and NDRF/SDRF pre-positioning.",
        "Halt traffic across submersible bridges and causeways.",
        "Move livestock, machinery, and emergency essentials to designated shelters on high ground."
    ],
    "HIGH": [
        "Issue flood preparedness advisory to village panchayats and municipal wards.",
        "Inspect flood barriers, sluice gates, and reservoir discharge schedules.",
        "Alert fishermen and boat operators to stay away from surging rivers.",
        "Keep search and rescue boats and relief centers on standby."
    ],
    "MEDIUM": [
        "Monitor local river water levels and rainfall accumulation closely.",
        "Clear urban storm water drains to mitigate waterlogging.",
        "Advise citizens to avoid crossing overflowing streams or culverts."
    ],
    "LOW": [
        "Routine hydrological monitoring. No active intervention required."
    ]
}


class AlertManager:
    """
    Manages flood warning alert generation and notifications.
    """

    def __init__(self, sender_id: str = "IN-MH-FEWS-RESEARCH"):
        self.sender_id = sender_id

    def generate_cap_alert(
        self,
        district: str,
        risk_level: str,
        probability: float,
        horizon: str,
        rainfall_mm: Optional[float] = None,
        discharge_m3s: Optional[float] = None,
        stations: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Generate a Common Alerting Protocol (CAP v1.2) compliant alert structure.
        """
        alert_id = f"ALERT-{uuid.uuid4().hex[:8].upper()}"
        sent_time = datetime.utcnow().isoformat() + "Z"

        severity = {
            "EXTREME": "Extreme",
            "HIGH": "Severe",
            "MEDIUM": "Moderate",
            "LOW": "Minor"
        }.get(risk_level, "Unknown")

        urgency = "Immediate" if risk_level in ["EXTREME", "HIGH"] else "Expected"
        certainty = "Observed" if risk_level == "EXTREME" else "Likely"

        headline = f"Flood Risk Advisory: {risk_level} Risk for {district} ({horizon} Horizon)"
        
        description_parts = [
            f"Maharashtra Flood Early Warning System indicates a {risk_level} flood risk",
            f"for district {district} within the next {horizon}.",
            f"Estimated flood probability: {round(probability * 100, 1)}%."
        ]
        if rainfall_mm is not None:
            description_parts.append(f"Recorded/projected 24h rainfall: {rainfall_mm} mm.")
        if discharge_m3s is not None:
            description_parts.append(f"Observed river discharge: {discharge_m3s} m³/sec.")
        if stations:
            description_parts.append(f"Monitored gauge stations: {', '.join(stations)}.")

        description = " ".join(description_parts)
        actions = RECOMMENDED_ACTIONS.get(risk_level, RECOMMENDED_ACTIONS["LOW"])

        cap_payload = {
            "identifier": alert_id,
            "sender": self.sender_id,
            "sent": sent_time,
            "status": "Actual",
            "msgType": "Alert",
            "scope": "Public",
            "info": {
                "category": "Met",
                "event": "Riverine / Flash Flood Risk",
                "urgency": urgency,
                "severity": severity,
                "certainty": certainty,
                "eventCode": "FLW",
                "headline": headline,
                "description": description,
                "instruction": " ".join(actions),
                "area": {
                    "areaDesc": f"{district}, Maharashtra, India",
                    "polygon": None
                },
                "parameter": [
                    {"valueName": "RiskLevel", "value": risk_level},
                    {"valueName": "Probability", "value": str(probability)},
                    {"valueName": "ForecastHorizon", "value": horizon},
                    {"valueName": "Disclaimer", "value": "Research/decision support only. Not an official warning."}
                ]
            }
        }

        return cap_payload

    def process_risk_zones(
        self,
        risk_data: Dict[str, Dict[str, Any]],
        horizon: str = "24h",
        min_alert_level: str = "HIGH"
    ) -> List[Dict[str, Any]]:
        """
        Evaluate all district risk predictions and generate alerts for zones meeting
        or exceeding min_alert_level.
        """
        alert_levels = ["EXTREME"] if min_alert_level == "EXTREME" else ["HIGH", "EXTREME"]
        alerts = []

        for district, info in risk_data.items():
            level = info.get("risk", "LOW")
            if level in alert_levels:
                alert = self.generate_cap_alert(
                    district=district,
                    risk_level=level,
                    probability=info.get("probability", 0.0),
                    horizon=horizon,
                    rainfall_mm=info.get("rainfall"),
                    discharge_m3s=info.get("discharge"),
                    stations=info.get("stations")
                )
                alerts.append(alert)
                logger.info(f"Generated {level} alert for {district}: {alert['identifier']}")

        return alerts
