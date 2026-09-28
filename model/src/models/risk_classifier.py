"""
src/models/risk_classifier.py

Converts flood probability to risk level categories.

Risk levels:
    LOW     — probability < 0.30
    MEDIUM  — 0.30 <= probability < 0.60
    HIGH    — 0.60 <= probability < 0.80
    EXTREME — probability >= 0.80

IMPORTANT: These thresholds are initial visualization defaults only.
They are NOT scientifically validated and must be recalibrated after
model training and evaluation against actual flood outcomes.

Thresholds are configurable via config/config.yaml.
"""

from __future__ import annotations

from typing import Dict, Any


# Default thresholds — override via config.yaml
DEFAULT_THRESHOLDS = {
    "low":     {"min": 0.00, "max": 0.30, "label": "LOW",     "color": "#22c55e", "emoji": "🟢"},
    "medium":  {"min": 0.30, "max": 0.60, "label": "MEDIUM",  "color": "#eab308", "emoji": "🟡"},
    "high":    {"min": 0.60, "max": 0.80, "label": "HIGH",    "color": "#f97316", "emoji": "🟠"},
    "extreme": {"min": 0.80, "max": 1.00, "label": "EXTREME", "color": "#ef4444", "emoji": "🔴"},
}


class RiskClassifier:
    """
    Converts flood probability (0-1) to risk level label.

    Parameters
    ----------
    thresholds : dict, optional
        Custom thresholds loaded from config. Falls back to DEFAULT_THRESHOLDS.

    Example
    -------
    >>> clf = RiskClassifier()
    >>> clf.classify(0.15)
    'LOW'
    >>> clf.classify(0.91)
    'EXTREME'
    """

    def __init__(self, thresholds: Dict[str, Any] | None = None):
        self.thresholds = thresholds or DEFAULT_THRESHOLDS

    def classify(self, probability: float) -> str:
        """
        Classify a flood probability into a risk level.

        Parameters
        ----------
        probability : float
            Flood probability, must be in [0, 1].

        Returns
        -------
        str
            One of: 'LOW', 'MEDIUM', 'HIGH', 'EXTREME'
        """
        if probability < 0 or probability > 1:
            raise ValueError(f"Probability must be in [0, 1], got {probability}")

        for level, cfg in sorted(
            self.thresholds.items(),
            key=lambda x: x[1]["min"]
        ):
            if cfg["min"] <= probability < cfg["max"]:
                return cfg["label"]

        # Handle probability == 1.0 exactly
        return "EXTREME"

    def get_color(self, probability: float) -> str:
        """Return hex color for the given probability."""
        label = self.classify(probability)
        for cfg in self.thresholds.values():
            if cfg["label"] == label:
                return cfg["color"]
        return "#888888"  # fallback gray

    def get_emoji(self, probability: float) -> str:
        """Return emoji for the given probability."""
        label = self.classify(probability)
        for cfg in self.thresholds.values():
            if cfg["label"] == label:
                return cfg["emoji"]
        return "⚪"

    def classify_batch(self, probabilities: list[float]) -> list[str]:
        """Classify a list of probabilities."""
        return [self.classify(p) for p in probabilities]

    @classmethod
    def from_config(cls, config: Dict[str, Any]) -> "RiskClassifier":
        """
        Create a RiskClassifier from a loaded config dict.

        Parameters
        ----------
        config : dict
            Full config dictionary (as loaded by load_config()).
        """
        thresholds = config.get("risk_thresholds", DEFAULT_THRESHOLDS)
        # Ensure labels are uppercase
        for level_name, cfg in thresholds.items():
            if "label" not in cfg:
                cfg["label"] = level_name.upper()
        return cls(thresholds=thresholds)
