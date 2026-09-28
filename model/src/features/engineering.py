"""
src/features/engineering.py

Feature engineering for flood prediction.

IMPORTANT RULES:
  - Never create hourly features when only daily data exists
  - Never use future information in prediction features (no data leakage)
  - Document every feature assumption clearly
  - Mark unavailable features explicitly rather than filling with zeros

Feature availability depends on input data resolution:
  - Daily data: rainfall_24h, rainfall_48h, rainfall_72h, rainfall_7d
  - Hourly data (unavailable until API connected): rainfall_1h, _3h, _6h, _12h
  - Flood history (unavailable until flood events acquired): historical_flood_count, etc.
"""

from __future__ import annotations

import logging
from typing import List, Optional

import runpy as np
import pandas as pd

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# RAINFALL FEATURES (from daily rainfall data)
# ─────────────────────────────────────────────────────────────────────────────

def compute_daily_rainfall_features(
    df: pd.DataFrame,
    rainfall_col: str = "daily_actual_mm",
    date_col: str = "date",
    group_col: Optional[str] = "district",
) -> pd.DataFrame:
    """
    Compute rolling rainfall features from daily district rainfall data.

    AVAILABLE features (daily resolution data):
        rainfall_24h   — today's daily rainfall (direct)
        rainfall_48h   — sum of last 2 days
        rainfall_72h   — sum of last 3 days
        rainfall_7d    — sum of last 7 days
        rainfall_mean_24h  — same as rainfall_24h at daily resolution
        rainfall_max_72h   — max daily rainfall in last 3 days
        rainfall_max_7d    — max daily rainfall in last 7 days
        rainfall_departure_from_normal — daily_actual / daily_normal - 1

    NOT AVAILABLE (would require hourly data):
        rainfall_1h, rainfall_3h, rainfall_6h, rainfall_12h

    Parameters
    ----------
    df : pd.DataFrame
        Must have date_col, rainfall_col, and optionally group_col
    rainfall_col : str
        Column name for daily rainfall in mm
    date_col : str
        Column name for dates
    group_col : str, optional
        Column to group by (district or station)

    Returns
    -------
    pd.DataFrame
        Original dataframe with new feature columns appended.

    Notes
    -----
    Rolling windows are applied within each group (district/station).
    min_periods=1 means partial windows are used — this is appropriate for
    the start of series but should be noted in model documentation.
    """
    df = df.copy()
    df = df.sort_values([group_col, date_col] if group_col else [date_col])

    # Helper: rolling sum within group
    def _rolling_sum(series: pd.Series, window: int) -> pd.Series:
        return series.rolling(window=window, min_periods=1).sum()

    def _rolling_max(series: pd.Series, window: int) -> pd.Series:
        return series.rolling(window=window, min_periods=1).max()

    def _rolling_mean(series: pd.Series, window: int) -> pd.Series:
        return series.rolling(window=window, min_periods=1).mean()

    if group_col and group_col in df.columns:
        grouped = df.groupby(group_col)[rainfall_col]
        df["rainfall_24h"] = grouped.transform(lambda x: _rolling_sum(x, 1))
        df["rainfall_48h"] = grouped.transform(lambda x: _rolling_sum(x, 2))
        df["rainfall_72h"] = grouped.transform(lambda x: _rolling_sum(x, 3))
        df["rainfall_7d"] = grouped.transform(lambda x: _rolling_sum(x, 7))
        df["rainfall_mean_72h"] = grouped.transform(lambda x: _rolling_mean(x, 3))
        df["rainfall_max_72h"] = grouped.transform(lambda x: _rolling_max(x, 3))
        df["rainfall_max_7d"] = grouped.transform(lambda x: _rolling_max(x, 7))
    else:
        df["rainfall_24h"] = _rolling_sum(df[rainfall_col], 1)
        df["rainfall_48h"] = _rolling_sum(df[rainfall_col], 2)
        df["rainfall_72h"] = _rolling_sum(df[rainfall_col], 3)
        df["rainfall_7d"] = _rolling_sum(df[rainfall_col], 7)
        df["rainfall_mean_72h"] = _rolling_mean(df[rainfall_col], 3)
        df["rainfall_max_72h"] = _rolling_max(df[rainfall_col], 3)
        df["rainfall_max_7d"] = _rolling_max(df[rainfall_col], 7)

    # Departure from normal
    if "daily_normal_mm" in df.columns:
        df["rainfall_departure_from_normal"] = (
            df[rainfall_col] - df["daily_normal_mm"]
        ) / df["daily_normal_mm"].replace(0, np.nan)
    else:
        df["rainfall_departure_from_normal"] = np.nan
        logger.warning("daily_normal_mm not found — rainfall_departure_from_normal set to NaN")

    # Explicitly mark hourly features as unavailable
    for col in ["rainfall_1h", "rainfall_3h", "rainfall_6h", "rainfall_12h"]:
        df[col] = np.nan  # NOT available at daily resolution

    logger.info(
        "Computed rainfall features: rainfall_24h/48h/72h/7d, "
        "departure_from_normal. Hourly features unavailable (daily data only)."
    )
    return df


# ─────────────────────────────────────────────────────────────────────────────
# RIVER DISCHARGE FEATURES
# ─────────────────────────────────────────────────────────────────────────────

def compute_discharge_features(
    df: pd.DataFrame,
    discharge_col: str = "discharge_m3s",
    date_col: str = "date",
    station_col: str = "station",
) -> pd.DataFrame:
    """
    Compute river discharge features from daily station discharge data.

    AVAILABLE features (daily resolution):
        river_discharge            — current day discharge
        river_discharge_change_24h — change from previous day
        river_discharge_rolling_mean_7d — 7-day rolling mean
        river_discharge_rolling_max_7d  — 7-day rolling max
        river_discharge_pct_change_24h  — % change from previous day

    NOT AVAILABLE (would require hourly data):
        river_discharge_change_1h, _3h, _6h, _12h

    Parameters
    ----------
    df : pd.DataFrame
        Station-level daily discharge data
    discharge_col : str
        Column with discharge values in m3/sec
    date_col : str
        Column for date
    station_col : str
        Column for station name (used for grouping)

    Returns
    -------
    pd.DataFrame
        Original dataframe with discharge feature columns appended.

    Notes
    -----
    Zero discharge values are kept as-is (legitimate for seasonal rivers).
    Change features at the start of each station's series will be NaN (correct).
    """
    df = df.copy()
    df = df.sort_values([station_col, date_col])

    grp = df.groupby(station_col)[discharge_col]

    # Current discharge (direct copy for clarity)
    df["river_discharge"] = df[discharge_col]

    # Change from previous day (no lookahead)
    df["river_discharge_change_24h"] = grp.transform(lambda x: x.diff(1))

    # Percentage change from previous day
    df["river_discharge_pct_change_24h"] = grp.transform(
        lambda x: x.pct_change(1) * 100
    )

    # Rolling statistics
    df["river_discharge_rolling_mean_7d"] = grp.transform(
        lambda x: x.rolling(7, min_periods=1).mean()
    )
    df["river_discharge_rolling_max_7d"] = grp.transform(
        lambda x: x.rolling(7, min_periods=1).max()
    )
    df["river_discharge_rolling_mean_3d"] = grp.transform(
        lambda x: x.rolling(3, min_periods=1).mean()
    )

    # Sub-daily change features — NOT available at daily resolution
    for col in [
        "river_discharge_change_1h",
        "river_discharge_change_3h",
        "river_discharge_change_6h",
        "river_discharge_change_12h",
    ]:
        df[col] = np.nan

    logger.info(
        "Computed discharge features: change_24h, pct_change_24h, "
        "rolling_mean/max_7d, rolling_mean_3d. Sub-daily features unavailable."
    )
    return df


# ─────────────────────────────────────────────────────────────────────────────
# HISTORICAL FLOOD FEATURES (requires verified flood events)
# ─────────────────────────────────────────────────────────────────────────────

def compute_historical_flood_features(
    df: pd.DataFrame,
    flood_events_df: pd.DataFrame,
    date_col: str = "date",
    district_col: str = "district",
) -> pd.DataFrame:
    """
    Compute historical flood frequency features.

    These features use ONLY past flood events (no future leakage).

    AVAILABLE features (when flood events data is provided):
        historical_flood_count      — total floods at this district (ever)
        days_since_last_flood       — days since last flood event at district
        flood_count_30d             — floods in past 30 days
        flood_count_90d             — floods in past 90 days
        flood_count_365d            — floods in past 365 days

    Parameters
    ----------
    df : pd.DataFrame
        Main dataset with date and district columns
    flood_events_df : pd.DataFrame
        Verified historical flood events.
        Must have: start_date, end_date, district
    date_col : str
    district_col : str

    Returns
    -------
    pd.DataFrame
        Original df with historical flood feature columns appended.

    Notes
    -----
    CRITICAL: Only events with end_date BEFORE the current row's date
    are used. This prevents future data leakage.

    If flood_events_df is empty or None, all features are set to NaN
    and a warning is logged.
    """
    df = df.copy()

    if flood_events_df is None or len(flood_events_df) == 0:
        logger.warning(
            "No verified flood events provided. "
            "Historical flood features will be NaN. "
            "See data/MISSING_DATA.md for required flood event data."
        )
        for col in [
            "historical_flood_count", "days_since_last_flood",
            "flood_count_30d", "flood_count_90d", "flood_count_365d",
        ]:
            df[col] = np.nan
        return df

    # Validate required columns
    required = ["start_date", "end_date", "district"]
    missing = [c for c in required if c not in flood_events_df.columns]
    if missing:
        raise ValueError(f"Flood events DataFrame missing columns: {missing}")

    # Compute features row by row
    # (For large datasets, this should be vectorized — acceptable for Phase 1)
    results = {
        "historical_flood_count": [],
        "days_since_last_flood": [],
        "flood_count_30d": [],
        "flood_count_90d": [],
        "flood_count_365d": [],
    }

    for _, row in df.iterrows():
        current_date = pd.Timestamp(row[date_col])
        district = row[district_col]

        # Only use flood events that ended BEFORE current_date
        past_events = flood_events_df[
            (flood_events_df["district"].str.upper() == str(district).upper())
            & (flood_events_df["end_date"] < current_date)
        ]

        results["historical_flood_count"].append(len(past_events))

        if len(past_events) > 0:
            last_end = past_events["end_date"].max()
            days_since = (current_date - last_end).days
            results["days_since_last_flood"].append(days_since)
        else:
            results["days_since_last_flood"].append(np.nan)

        # Counts within lookback windows
        for days, key in [(30, "flood_count_30d"), (90, "flood_count_90d"), (365, "flood_count_365d")]:
            cutoff = current_date - pd.Timedelta(days=days)
            count = len(past_events[past_events["end_date"] >= cutoff])
            results[key].append(count)

    for col, values in results.items():
        df[col] = values

    logger.info("Computed historical flood features from verified event data.")
    return df


# ─────────────────────────────────────────────────────────────────────────────
# TEMPORAL FEATURES
# ─────────────────────────────────────────────────────────────────────────────

def compute_temporal_features(
    df: pd.DataFrame,
    date_col: str = "date",
) -> pd.DataFrame:
    """
    Compute temporal/calendar features from date column.

    Features added:
        day_of_year     — 1-366
        month           — 1-12
        week_of_year    — 1-52
        is_monsoon      — 1 if June-September (South Asian monsoon season)
        monsoon_day     — day within monsoon season (0 if not monsoon)
    """
    df = df.copy()
    df[date_col] = pd.to_datetime(df[date_col])

    df["day_of_year"] = df[date_col].dt.day_of_year
    df["month"] = df[date_col].dt.month
    df["week_of_year"] = df[date_col].dt.isocalendar().week.astype(int)
    df["is_monsoon"] = df["month"].isin([6, 7, 8, 9]).astype(int)

    # Day within monsoon season (1 = June 1, up to ~122 = Sep 30)
    monsoon_start = df[date_col].apply(
        lambda d: pd.Timestamp(year=d.year, month=6, day=1)
    )
    df["monsoon_day"] = (df[date_col] - monsoon_start).dt.days.clip(lower=0)
    df.loc[df["is_monsoon"] == 0, "monsoon_day"] = 0

    return df
