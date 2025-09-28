from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent #/Users/timur_sukhariev/Desktop/intent_classifier
DATA_DIR = BASE_DIR / "data_for_training"
MODEL_PATH = BASE_DIR / "best_model.joblib"


CONF_THRESHOLD = 0.6  

