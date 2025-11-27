# booking_sequential.py
"""
Minimal, sequential slot-extraction helpers for the booking flow.
- Regex-only (fast, deterministic).
- ISO dates only (YYYY-MM-DD) to keep it simple.
- Designed for question-by-question collection with an initial pass
  that extracts anything obvious from free text.

Exports:
- REQUIRED, QUESTION
- extract_from_text(text) -> dict
- compute_missing(slots) -> list[str]
- pick_next(missing) -> Optional[str]
- parse_answer_for(slot, text) -> dict
- normalize(slots) -> dict
"""

import re
from typing import Dict, Any, List, Optional
import sys

# Required slots for your MVP flow (ask one-by-one).
REQUIRED: List[str] = ["checkIn", "checkOut", "adults", "children", "childrenAges"]

# Prompts for each slot (returned to FE as the next question).
QUESTION: Dict[str, str] = {
    "checkIn": "Enter your check in date YYYY-MM-DD",
    "checkOut": "Enter your check out date YYYY-MM-DD",
    "adults": "How many adults will stay? MAX: 4",
    "children": "How many children will stay?",
    "childrenAges": "What are the ages of the children in years? For example 5 8",
}

def extract_from_text(text: str) -> Dict[str, Any]:
    t = text.lower()
    out: Dict[str, Any] = {}

    # Date range (two ISO dates with up to 10 chars between them)
    mrange = re.search(r"(\d{4}-\d{2}-\d{2}).{0,10}(\d{4}-\d{2}-\d{2})", t)
    if mrange:
        out["checkIn"] = mrange.group(1)
        out["checkOut"] = mrange.group(2)
    else:
        # Labeled single dates
        ci = re.search(r"check\s*in\s*(\d{4}-\d{2}-\d{2})", t)
        co = re.search(r"check\s*out\s*(\d{4}-\d{2}-\d{2})", t)
        if ci:
            out["checkIn"] = ci.group(1)
        if co:
            out["checkOut"] = co.group(1)


    a = re.search(r"\badult(?:s)?\s*(\d+)", t)
    if a:
        num = a.group(1) or a.group(2)
        out["adults"] = int(num)

    c = re.search(r"\bchild(?:ren)?\s*(\d+)", t)
    if c:
        num = c.group(1) or c.group(2)
        out["children"] = int(num)

    ages = re.findall(r"\bage(?:s)?\s*([0-9 ,]+)", t)
    if ages:
        out["childrenAges"] = [int(x) for x in re.findall(r"\d+", ages[0])]

    return out


# print(extract_from_text('i would like to book one room and check in 2025-11-23 and check out 2025-11-25'))


def compute_missing(slots: Dict[str, Any]) -> List[str]:
    """
    Return required fields that are absent or empty.
    Special rule: childrenAges is required only when children > 0.
    """
    def is_empty(v: Any) -> bool:
        return v is None or v == "" or v == []

    missing = [k for k in REQUIRED if k not in slots or is_empty(slots[k])]

    # Don't require ages if there are no children
    if slots.get("children", 0) == 0 and "childrenAges" in missing:
        missing.remove("childrenAges")

    return missing

# print(compute_missing({'checkIn': '2025-11-23', 'checkOut': '2025-11-25'}))
def pick_next(missing: List[str]) -> Optional[str]:
    """
    Choose the next slot to ask. Simple policy: first missing.
    (Swap to a priority policy later if needed.)
    """
    return missing[0] if missing else None

# print(pick_next(['adults', 'children']))

def parse_answer_for(slot: Optional[str], text: str) -> Dict[str, Any]:
    """
    Interpret a short reply in the context of the last asked slot (pending).
    Examples:
      - pending='adults', text='2'            -> {'adults': 2}
      - pending='checkOut', text='2025-12-23' -> {'checkOut': '2025-12-23'}
      - pending='childrenAges', text='5 8'    -> {'childrenAges': [5, 8]}
    Returns {} if nothing was confidently parsed for that slot.
    """
    if not slot:
        return {}
    t = text.lower()

    if slot in ("checkIn", "checkOut"):
        m = re.search(r"\d{4}-\d{2}-\d{2}", t)
        return {slot: m.group(0)} if m else {}

    if slot in ("adults", "children"):
        m = re.search(r"\d+", t)
        return {slot: int(m.group(0))} if m else {}

    if slot == "childrenAges":
        nums = [int(x) for x in re.findall(r"\d+", t)]
        return {"childrenAges": nums} if nums else {}

    return {}

def normalize(slots: Dict[str, Any]) -> Dict[str, Any]:
    """
    Minimal normalization & guardrails:
      - cast counts to int
      - drop childrenAges if children == 0
      - (Optional) enforce adults + children <= 4 (commented below)
    """
    n = dict(slots)

    if "adults" in n and n["adults"] is not None:
        n["adults"] = int(n["adults"])
    if "children" in n and n["children"] is not None:
        n["children"] = int(n["children"])
    if "childrenAges" in n and isinstance(n["childrenAges"], list):
        n["childrenAges"] = [int(x) for x in n["childrenAges"]]

    if n.get("children", 0) == 0:
        n.pop("childrenAges", None)

    # Example hard cap (uncomment to enforce immediately):
    # if n.get("adults") is not None and n.get("children") is not None:
    #     if n["adults"] + n["children"] > 4:
    #         n["children"] = None  # force re-ask 'children'

    return n

def summarize_slots(slots: dict) -> str:
    summary = f"from {slots['checkIn']} to {slots['checkOut']}, "
    summary += f"{slots['adults']} adults"

    if slots["children"] > 0:
        summary += f", {slots['children']} children"
        ages = slots.get("childrenAges", [])
        if ages:
            summary += f" (ages {', '.join(map(str, ages))})"

    return summary

