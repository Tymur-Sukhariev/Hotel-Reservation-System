#!/usr/bin/env python3
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


MODEL_PATH = "best_model.joblib"
DATA_PATH = "data/intents.csv"


# ---------- helper: get probas ----------
def get_probabilities(model, texts):
    clf = model.named_steps["clf"]
    if hasattr(clf, "predict_proba"):
        return model.predict_proba(texts)
    else:
        scores = model.decision_function(texts)
        scores = np.atleast_2d(scores)
        exps = np.exp(scores - scores.max(axis=1, keepdims=True))
        return exps / exps.sum(axis=1, keepdims=True)


# ---------- single text test ----------
def predict_with_fallback(model, le, text, threshold=0.6):
    probas = get_probabilities(model, [text])[0]
    top_idx = int(np.argmax(probas))
    conf = float(probas[top_idx])
    label = le.inverse_transform([top_idx])[0]

    if conf < threshold:
        return {"text": text, "intent": "fallback", "confidence": conf, "candidate": label}
    return {"text": text, "intent": label, "confidence": conf}


# ---------- threshold evaluation ----------
def evaluate_thresholds(model, X_test, y_test, le, thresholds=[0.4, 0.5, 0.6, 0.7, 0.8]):
    probas = get_probabilities(model, X_test)

    top_idx = np.argmax(probas, axis=1)
    top_conf = probas[np.arange(len(probas)), top_idx]
    preds = le.inverse_transform(top_idx)
    true_labels = le.inverse_transform(y_test)

    print("\n=== Threshold impact ===")
    for t in thresholds:
        fallback_mask = top_conf < t
        fallback_rate = fallback_mask.mean()

        if (~fallback_mask).any():
            acc_wo_fallback = (
                preds[~fallback_mask] == true_labels[~fallback_mask]
            ).mean()
        else:
            acc_wo_fallback = 0.0

        print(f"\nThreshold {t:.2f}:")
        print(f"  Fallback rate: {fallback_rate:.2%}")
        print(f"  Accuracy (no fallback samples only): {acc_wo_fallback:.2%}")


# ---------- main ----------
if __name__ == "__main__":
    print(">>> Loading model...")
    bundle = joblib.load(MODEL_PATH)
    pipe = bundle["pipeline"]
    le = bundle["label_encoder"]

    # --- single test text ---
    TEXT = "can i live with a cat?"
    result = predict_with_fallback(pipe, le, TEXT, threshold=0.6)
    print("\n=== Single text test ===")
    print(result)

    # --- evaluate thresholds on dataset ---
    print("\n>>> Loading dataset for threshold evaluation...")
    df = pd.read_csv(DATA_PATH, encoding="utf-8-sig").dropna().drop_duplicates()
    le_full = LabelEncoder()
    y = le_full.fit_transform(df["intent"])
    X = df["text"].astype(str).values

    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    evaluate_thresholds(pipe, X_test, y_test, le_full, thresholds=[0.4, 0.5, 0.6, 0.7, 0.8])
