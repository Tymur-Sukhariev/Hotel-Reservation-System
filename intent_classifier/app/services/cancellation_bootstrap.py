import re

def extract_booking_number(text: str) -> int | None:
    m = re.search(r"\b(\d{8})\b", text)
    if m:
        return int(m.group(1))
    return None
