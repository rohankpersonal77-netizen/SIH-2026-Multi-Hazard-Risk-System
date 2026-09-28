"""
src/utils/config_loader.py

Loads and validates the project configuration from config/config.yaml.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Dict

import yaml


# Project root is two levels up from this file: src/utils/ -> src/ -> root/
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
_CONFIG_PATH = _PROJECT_ROOT / "config" / "config.yaml"


def load_config(config_path: str | Path | None = None) -> Dict[str, Any]:
    """
    Load the YAML configuration file.

    Parameters
    ----------
    config_path : str or Path, optional
        Override path to the config file. Defaults to config/config.yaml.

    Returns
    -------
    dict
        Parsed configuration dictionary.

    Raises
    ------
    FileNotFoundError
        If the config file does not exist.
    """
    path = Path(config_path) if config_path else _CONFIG_PATH

    if not path.exists():
        raise FileNotFoundError(
            f"Config file not found: {path}\n"
            f"Expected location: {_CONFIG_PATH}"
        )

    with open(path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    return config


def get_project_root() -> Path:
    """Return the absolute path to the project root directory."""
    return _PROJECT_ROOT


def get_data_path(key: str, config: Dict[str, Any] | None = None) -> Path:
    """
    Get an absolute path from the config data section.

    Parameters
    ----------
    key : str
        Dot-separated key, e.g. "rainfall.districtwise"
    config : dict, optional
        Config dict. Loaded from file if not provided.

    Returns
    -------
    Path
        Absolute path to the data file/directory.
    """
    if config is None:
        config = load_config()

    keys = key.split(".")
    value = config["data"]
    for k in keys:
        value = value[k]

    return _PROJECT_ROOT / value
