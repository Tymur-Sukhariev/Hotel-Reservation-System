from typing import Dict, Any, Tuple
import uuid

from app.state.sessions import SESSIONS
from scripts.booking_sequential import extract_from_text, compute_missing, pick_next, QUESTION, summarize_slots

def start_booking_session(text: str) -> tuple[str, dict, str | None]:
    found = extract_from_text(text)
    missing = compute_missing(found)
    pending = pick_next(missing)

    session_id = str(uuid.uuid4())

    SESSIONS[session_id] = {
        "intent": "booking",
        "slots": found,
        "missing": missing,
        "pending": pending,
    }

    return session_id, found, pending
