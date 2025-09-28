import re

def clean_text(text: str) -> str:
    """Basic cleaning: lowercase, strip, remove punctuation/numbers."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)   
    text = re.sub(r"\s+", " ", text).strip()
    return text


def preprocess(text: str) -> str:
    """Main preprocessing pipeline: cleaning + (optional) steps later"""
    text = clean_text(text)
    return text
