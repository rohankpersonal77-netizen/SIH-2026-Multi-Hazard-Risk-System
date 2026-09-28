"""
src/data/loaders.py

Data loading functions for all raw datasets.

Design principles:
  - Always filter Maharashtra using the actual State field in the data
  - Never rely on filenames to determine state or date coverage
  - Never assume missing data equals zero
  - Document every data transformation assumption
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

import pandas as pd

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# MAHARASHTRA STATE NAME VARIANTS
# (Use these for filtering — the actual column values may vary)
# ─────────────────────────────────────────────────────────────────────────────
MAHARASHTRA_STATE_VARIANTS = ["Maharashtra", "MAHARASHTRA"]
MAHARASHTRA_LGD_CODE = 27  # Official State LGD Code for Maharashtra


# ─────────────────────────────────────────────────────────────────────────────
# STATEWISE RAINFALL
# ─────────────────────────────────────────────────────────────────────────────

def load_statewise_rainfall(
    filepath: str | Path,
    state_filter: Optional[str] = "MAHARASHTRA",
) -> pd.DataFrame:
    """
    Load the IMD statewise daily rainfall CSV.

    Parameters
    ----------
    filepath : str or Path
        Path to rainfall_statewise_daily_imd.csv
    state_filter : str, optional
        If provided, filter rows to this state only.
        Pass None to load all states.

    Returns
    -------
    pd.DataFrame
        Cleaned, parsed dataframe with standardized column names.

    Notes
    -----
    The raw CSV has multiline column headers (columns with embedded newlines).
    This loader handles that by using a manual column rename after reading.

    Actual data range: 2026-08-19 to 2026-09-11 (24 days as of Phase 1 audit)
    """
    filepath = Path(filepath)
    if not filepath.exists():
        raise FileNotFoundError(f"Statewise rainfall file not found: {filepath}")

    logger.info(f"Loading statewise rainfall: {filepath}")

    # Read raw CSV — suppress header parsing issues caused by embedded newlines
    # by reading all columns and renaming manually
    df = pd.read_csv(filepath, encoding="utf-8", on_bad_lines="skip")

    # ── Rename columns to standardized names ──────────────────────────────
    # The CSV has 21 columns (some names contain newlines in original)
    # We map positionally to clean names
    column_map = {
        df.columns[0]: "state",
        df.columns[1]: "date",
        df.columns[2]: "daily_actual_mm",
        df.columns[3]: "daily_normal_mm",
        df.columns[4]: "daily_departure_pct",
        df.columns[5]: "daily_category",
        df.columns[6]: "week_date",
        df.columns[7]: "weekly_actual_mm",
        df.columns[8]: "weekly_normal_mm",
        df.columns[9]: "weekly_departure_pct",
        df.columns[10]: "weekly_category",
        df.columns[11]: "cumulative_date",
        df.columns[12]: "cumulative_actual_mm",
        df.columns[13]: "cumulative_normal_mm",
        df.columns[14]: "cumulative_departure_pct",
        df.columns[15]: "cumulative_category",
        df.columns[16]: "monthly_date",
        df.columns[17]: "monthly_actual_mm",
        df.columns[18]: "monthly_normal_mm",
        df.columns[19]: "monthly_departure_pct",
        df.columns[20]: "monthly_category",
    }
    df = df.rename(columns=column_map)

    # ── Parse date ────────────────────────────────────────────────────────
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    invalid_dates = df["date"].isna().sum()
    if invalid_dates > 0:
        logger.warning(f"Dropped {invalid_dates} rows with unparseable dates")
    df = df.dropna(subset=["date"])

    # ── Convert numeric columns ──────────────────────────────────────────
    numeric_cols = [
        "daily_actual_mm", "daily_normal_mm",
        "weekly_actual_mm", "weekly_normal_mm",
        "cumulative_actual_mm", "cumulative_normal_mm",
        "monthly_actual_mm", "monthly_normal_mm",
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # ── Parse percentage columns (strip % sign) ──────────────────────────
    pct_cols = [
        "daily_departure_pct", "weekly_departure_pct",
        "cumulative_departure_pct", "monthly_departure_pct",
    ]
    for col in pct_cols:
        if col in df.columns:
            df[col] = (
                df[col].astype(str)
                .str.replace("%", "", regex=False)
                .str.strip()
            )
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # ── Strip whitespace from string columns ─────────────────────────────
    df["state"] = df["state"].astype(str).str.strip()

    # ── State filter ──────────────────────────────────────────────────────
    if state_filter is not None:
        df = df[df["state"].str.upper() == state_filter.upper()].copy()
        logger.info(
            f"Maharashtra filter: {len(df)} rows remaining "
            f"(date range: {df['date'].min()} to {df['date'].max()})"
        )

    df = df.sort_values("date").reset_index(drop=True)

    # ── Add source metadata ───────────────────────────────────────────────
    df["data_source"] = "IMD_statewise_daily"

    logger.info(
        f"Loaded statewise rainfall: {len(df)} rows, "
        f"{df['date'].min().date()} to {df['date'].max().date()}"
    )
    return df


# ─────────────────────────────────────────────────────────────────────────────
# DISTRICTWISE RAINFALL
# ─────────────────────────────────────────────────────────────────────────────

def load_districtwise_rainfall(
    filepath: str | Path,
    state_filter: Optional[str] = "MAHARASHTRA",
) -> pd.DataFrame:
    """
    Load the IMD districtwise daily rainfall CSV.

    Parameters
    ----------
    filepath : str or Path
        Path to rainfall_districtwise_daily_imd.csv
    state_filter : str, optional
        If provided, filter rows to this state only.

    Returns
    -------
    pd.DataFrame
        Cleaned dataframe with 36 Maharashtra districts.

    Notes
    -----
    Actual data range: 2026-08-19 to 2026-09-11 (24 days, 864 MH rows)
    Districts: 36 districts of Maharashtra
    """
    filepath = Path(filepath)
    if not filepath.exists():
        raise FileNotFoundError(f"Districtwise rainfall file not found: {filepath}")

    logger.info(f"Loading districtwise rainfall: {filepath}")

    df = pd.read_csv(filepath, encoding="utf-8", on_bad_lines="skip")

    # ── Rename columns ────────────────────────────────────────────────────
    column_map = {
        df.columns[0]: "state",
        df.columns[1]: "district",
        df.columns[2]: "date",
        df.columns[3]: "daily_actual_mm",
        df.columns[4]: "daily_normal_mm",
        df.columns[5]: "daily_departure_pct",
        df.columns[6]: "daily_category",
        df.columns[7]: "week_date",
        df.columns[8]: "weekly_actual_mm",
        df.columns[9]: "weekly_normal_mm",
        df.columns[10]: "weekly_departure_pct",
        df.columns[11]: "weekly_category",
        df.columns[12]: "cumulative_date",
        df.columns[13]: "cumulative_actual_mm",
        df.columns[14]: "cumulative_normal_mm",
        df.columns[15]: "cumulative_departure_pct",
        df.columns[16]: "cumulative_category",
        df.columns[17]: "monthly_date",
        df.columns[18]: "monthly_actual_mm",
        df.columns[19]: "monthly_normal_mm",
        df.columns[20]: "monthly_departure_pct",
        df.columns[21]: "monthly_category",
    }
    df = df.rename(columns=column_map)

    # ── Parse date ────────────────────────────────────────────────────────
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"])

    # ── Convert numeric ───────────────────────────────────────────────────
    numeric_cols = [
        "daily_actual_mm", "daily_normal_mm",
        "weekly_actual_mm", "weekly_normal_mm",
        "cumulative_actual_mm", "cumulative_normal_mm",
        "monthly_actual_mm", "monthly_normal_mm",
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # ── Parse percentage columns ──────────────────────────────────────────
    pct_cols = [
        "daily_departure_pct", "weekly_departure_pct",
        "cumulative_departure_pct", "monthly_departure_pct",
    ]
    for col in pct_cols:
        if col in df.columns:
            df[col] = (
                df[col].astype(str)
                .str.replace("%", "", regex=False)
                .str.strip()
            )
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # ── Standardize string columns ────────────────────────────────────────
    df["state"] = df["state"].astype(str).str.strip()
    df["district"] = df["district"].astype(str).str.strip()

    # ── State filter ──────────────────────────────────────────────────────
    if state_filter is not None:
        df = df[df["state"].str.upper() == state_filter.upper()].copy()

    df = df.sort_values(["district", "date"]).reset_index(drop=True)
    df["data_source"] = "IMD_districtwise_daily"

    logger.info(
        f"Loaded districtwise rainfall: {len(df)} rows, "
        f"{df['district'].nunique()} districts, "
        f"{df['date'].min().date()} to {df['date'].max().date()}"
    )
    return df


# ─────────────────────────────────────────────────────────────────────────────
# RIVER DISCHARGE (CWC)
# ─────────────────────────────────────────────────────────────────────────────

def load_river_discharge(
    filepath: str | Path,
    state_filter: Optional[str] = "Maharashtra",
) -> pd.DataFrame:
    """
    Load the CWC manual daily river discharge CSV.

    Parameters
    ----------
    filepath : str or Path
        Path to river_discharge_manual_daily_cwc_mh_2026_2030.csv
    state_filter : str, optional
        If provided, filter rows by State field.

    Returns
    -------
    pd.DataFrame
        Cleaned dataframe with 53 stations, 19 districts, discharge in m3/sec.

    Notes
    -----
    IMPORTANT: Despite the filename containing "2026_2030", the actual data
    only covers 2026-01-01 to 2026-09-04. Never trust filenames for date ranges.

    50.4% of discharge values are zero — these are legitimate for seasonal rivers.
    Do NOT treat zero discharge as missing data.

    All rows are Maharashtra-only (State LGD Code 27).
    """
    filepath = Path(filepath)
    if not filepath.exists():
        raise FileNotFoundError(f"River discharge file not found: {filepath}")

    logger.info(f"Loading river discharge: {filepath}")

    df = pd.read_csv(filepath, encoding="utf-8", on_bad_lines="skip")

    # ── Standardize column names ──────────────────────────────────────────
    col_rename = {
        "SlNo": "sl_no",
        "Station": "station",
        "Agency": "agency",
        "State LGD Code": "state_lgd_code",
        "State": "state",
        "District LGD Code": "district_lgd_code",
        "District": "district",
        "Tehsil": "tehsil",
        "Block": "block",
        "Village": "village",
        "River": "river",
        "Basin": "basin",
        "Tributary": "tributary",
        "Subtributary": "subtributary",
        "SubSubtributary": "sub_subtributary",
        "Local River": "local_river",
        "Latitude": "latitude",
        "Longitude": "longitude",
        "Data Acquisition Time": "timestamp",
        "Manual Daily River Water Discharge (m3/sec)": "discharge_m3s",
    }
    df = df.rename(columns=col_rename)

    # ── Parse timestamp ───────────────────────────────────────────────────
    # Raw format: "01-01-2026 09:00"
    df["timestamp"] = pd.to_datetime(df["timestamp"], dayfirst=True, errors="coerce")
    df["date"] = df["timestamp"].dt.date
    df["date"] = pd.to_datetime(df["date"])

    invalid_ts = df["timestamp"].isna().sum()
    if invalid_ts > 0:
        logger.warning(f"Dropped {invalid_ts} rows with unparseable timestamps")
    df = df.dropna(subset=["timestamp"])

    # ── Convert numeric columns ───────────────────────────────────────────
    df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
    df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")
    df["discharge_m3s"] = pd.to_numeric(df["discharge_m3s"], errors="coerce")

    # ── Standardize string columns ────────────────────────────────────────
    for col in ["station", "state", "district", "river", "basin"]:
        df[col] = df[col].astype(str).str.strip()

    # ── State filter ──────────────────────────────────────────────────────
    if state_filter is not None:
        df = df[df["state"].str.lower() == state_filter.lower()].copy()

    # ── Flag zero discharge (for transparency) ────────────────────────────
    df["discharge_is_zero"] = df["discharge_m3s"] == 0.0

    # ── Sort ──────────────────────────────────────────────────────────────
    df = df.sort_values(["station", "timestamp"]).reset_index(drop=True)
    df["data_source"] = "CWC_manual_daily"

    logger.info(
        f"Loaded river discharge: {len(df)} rows, "
        f"{df['station'].nunique()} stations, "
        f"{df['district'].nunique()} districts, "
        f"{df['timestamp'].min().date()} to {df['timestamp'].max().date()}"
    )
    return df


# ─────────────────────────────────────────────────────────────────────────────
# FLOOD EVENTS (stub — will be populated when data is acquired)
# ─────────────────────────────────────────────────────────────────────────────

def load_flood_events(filepath: str | Path) -> pd.DataFrame:
    """
    Load verified historical flood events.

    IMPORTANT: This function will raise DataNotAvailableError until
    actual verified flood event data is provided.

    DO NOT generate synthetic flood events.

    Parameters
    ----------
    filepath : str or Path
        Path to the flood events CSV/Excel file.

    Returns
    -------
    pd.DataFrame
        Flood events with standardized schema.

    Required columns in source file:
        event_id, start_date, end_date, peak_flood_level,
        peak_flood_date, peak_discharge, peak_discharge_date,
        flood_type, station, district, river, basin
    """
    filepath = Path(filepath)

    if not filepath.exists():
        raise FileNotFoundError(
            f"Historical flood events file not found: {filepath}\n"
            "See data/MISSING_DATA.md for instructions on acquiring flood event data.\n"
            "ML training cannot proceed without verified historical flood events."
        )

    logger.info(f"Loading flood events: {filepath}")
    df = pd.read_csv(filepath, encoding="utf-8")

    # Required columns
    required_cols = ["event_id", "start_date", "end_date", "district", "river"]
    missing_cols = [c for c in required_cols if c not in df.columns]
    if missing_cols:
        raise ValueError(
            f"Flood events file is missing required columns: {missing_cols}"
        )

    df["start_date"] = pd.to_datetime(df["start_date"], errors="coerce")
    df["end_date"] = pd.to_datetime(df["end_date"], errors="coerce")

    logger.info(
        f"Loaded {len(df)} flood events, "
        f"{df['start_date'].min().date()} to {df['end_date'].max().date()}"
    )
    return df


# ─────────────────────────────────────────────────────────────────────────────
# DATA SUMMARY UTILITIES
# ─────────────────────────────────────────────────────────────────────────────

def summarize_dataframe(df: pd.DataFrame, name: str = "DataFrame") -> None:
    """
    Print a quick summary of a loaded dataframe.

    Parameters
    ----------
    df : pd.DataFrame
    name : str
        Descriptive name for the dataset.
    """
    print(f"\n{'='*60}")
    print(f"  {name}")
    print(f"{'='*60}")
    print(f"  Rows:    {len(df):,}")
    print(f"  Columns: {len(df.columns)}")
    print(f"  Memory:  {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

    if "date" in df.columns:
        print(f"  Date range: {df['date'].min().date()} → {df['date'].max().date()}")
    if "timestamp" in df.columns:
        print(f"  Timestamp range: {df['timestamp'].min()} → {df['timestamp'].max()}")

    missing = df.isnull().sum()
    missing = missing[missing > 0]
    if len(missing) > 0:
        print(f"\n  Missing values:")
        for col, count in missing.items():
            pct = 100 * count / len(df)
            print(f"    {col}: {count:,} ({pct:.1f}%)")
    else:
        print(f"  Missing values: None")

    print(f"{'='*60}\n")
