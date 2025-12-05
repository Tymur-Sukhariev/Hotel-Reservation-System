from pathlib import Path
import os
from dotenv import load_dotenv

# Project root - intent_classifier
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env from project root
load_dotenv(BASE_DIR / ".env")

# Settings (relative to BASE_DIR unless absolute given)
MODEL_PATH = BASE_DIR / os.getenv("MODEL_PATH", "best_model.joblib")
DATA_DIR = BASE_DIR / os.getenv("DATA_DIR", "data_for_training")
CONF_THRESHOLD = float(os.getenv("CONF_THRESHOLD", "0.6"))
MAX_MSG = 100

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
print(GROQ_API_KEY)
