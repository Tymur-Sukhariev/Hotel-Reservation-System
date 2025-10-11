from fastapi import HTTPException
import joblib
import numpy as np

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.core.intent_responses import intent_info
from app.core.config import MODEL_PATH, CONF_THRESHOLD, MAX_MSG



def get_intent(text="Hi"):
    
    clean_msg = len(text.strip())
    if clean_msg == 0:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    if clean_msg > MAX_MSG:
        raise HTTPException(status_code=400, detail=f"Max characters: {MAX_MSG}")
    
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

    if conf < CONF_THRESHOLD:
        label = "fallback"
    
    return intent_info[label]
    