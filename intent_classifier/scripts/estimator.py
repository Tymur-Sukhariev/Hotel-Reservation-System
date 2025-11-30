import joblib
import numpy as np
from app.core.config import MODEL_PATH

def classify_intent(text: str) -> tuple[str, float]:
    """
    Load the bundle and return (label, confidence) for the given text.
    """
    bundle = joblib.load(MODEL_PATH)
    pipe = bundle["pipeline"]
    le = bundle["label_encoder"]
    clf = pipe.named_steps["clf"]

    if hasattr(clf, "predict_proba"):
        probs = pipe.predict_proba([text])[0]
    else:
        scores = pipe.decision_function([text])[0]
        scores = np.atleast_1d(scores)
        exps = np.exp(scores - np.max(scores))
        probs = exps / exps.sum()

    top_idx = int(np.argmax(probs))
    label = le.inverse_transform([top_idx])[0]
    conf = float(probs[top_idx])
    return label, conf

# print(classify_intent("hey"))