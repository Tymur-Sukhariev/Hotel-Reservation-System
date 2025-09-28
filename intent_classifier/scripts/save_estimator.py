import joblib

def save_estimator(best_gs, le):
    if best_gs is None:
        raise SystemExit("No best model found — did GridSearchCV run?")
    
    best_estimator = best_gs.best_estimator_
    joblib.dump(
        {
            "pipeline": best_estimator,  # tfidf + best tuned clf
            "label_encoder": le,         # keep label mapping
        },
        "best_model.joblib"   
    )
    print("Saved to best_model.joblib")