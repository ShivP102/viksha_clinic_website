"""Add local vendor path for beautifulsoup4/pypdf when installed via --target."""
from __future__ import annotations

import sys
from pathlib import Path

_vendor = Path(__file__).resolve().parents[1] / ".vendor"
if _vendor.is_dir():
    sys.path.insert(0, str(_vendor))
