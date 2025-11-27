import argparse
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.metrics import classification_report, confusion_matrix, f1_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder

from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import FunctionTransformer

from scripts.save_estimator import save_estimator
from app.core.config import DATA_DIR 
from app.utils.preprocess import preprocess

import sys

def load_dataset(csv_path: str):
    df = pd.read_csv(csv_path, encoding="utf-8-sig").dropna().drop_duplicates()

    le = LabelEncoder()
    y = le.fit_transform(df["intent"])
    X = df["text"].astype(str).values
    labels = list(le.classes_)
    return X, y, le, labels


def split_data(X, y, test_size=0.2, seed=42):
    return train_test_split(X, y, test_size=test_size, random_state=seed, stratify=y)

# TF-IDF vectorizer: normalizes text, lowercases, and tokenizes words.
def make_vectorizer():
    return TfidfVectorizer(
        strip_accents="unicode",
        lowercase=True,
        token_pattern=r"(?u)\b[\w'-]+\b",
    )

def preprocessing_transformer():
    FunctionTransformer(np.vectorize(preprocess), validate=False)


def build_estimators():
    svc_base = LinearSVC(
        class_weight="balanced",
        dual="auto",           
        random_state=42,
        max_iter=5000            
    )
    svc = CalibratedClassifierCV(
        estimator=svc_base,      
        method="sigmoid",
        cv=3
    )
    nb = MultinomialNB()
    lr = LogisticRegression(
        solver="saga",
        class_weight="balanced",
        max_iter=5000,          
        random_state=42
    )
    return {"LinearSVC": svc, "MultinomialNB": nb, "LogReg": lr}


def build_pipelines(tfidf, estimators):
    prep = preprocessing_transformer()
    return {
            name: Pipeline([("prep", prep), ("tfidf", tfidf), ("clf", est)])
            for name, est in estimators.items()
    }


def build_param_grids():
    grid_common = {
        "tfidf__ngram_range": [(1, 1), (1, 2)],
        "tfidf__min_df": [1, 2, 3],
        "tfidf__max_df": [0.9, 1.0],
        "tfidf__sublinear_tf": [True, False],
    }
    grid_svc = {**grid_common, "clf__estimator__C": [0.5, 1.0, 2.0]}
    grid_nb = {**grid_common, "clf__alpha": [0.1, 0.3, 0.5, 1.0], "clf__fit_prior": [True, False]}
    grid_lr = {**grid_common, "clf__C": [0.5, 1.0, 2.0, 4.0], "clf__penalty": ["l1", "l2"]}
    return {"LinearSVC": grid_svc, "MultinomialNB": grid_nb, "LogReg": grid_lr}



def evaluate_on_holdout(name, estimator, X_test, y_test, labels):
    y_pred = estimator.predict(X_test)
    macro_f1 = f1_score(y_test, y_pred, average="macro")

    print(f"\n=== {name} (holdout) ===")
    print(f"Macro F1: {macro_f1:.4f}")
    print("Classification report:")
    print(classification_report(y_test, y_pred, target_names=labels, zero_division=0))
    cm = confusion_matrix(y_test, y_pred)
    print(cm)

    return macro_f1


def run_grid_search(name, pipe, param_grid, X_train, y_train, cv_folds=5, n_jobs=-1, verbose=1):
    cv = StratifiedKFold(n_splits=cv_folds, shuffle=True, random_state=42)
    gs = GridSearchCV(
        estimator=pipe,
        param_grid=param_grid,
        scoring="f1_macro",
        cv=cv,
        n_jobs=n_jobs,
        verbose=verbose,
        refit=True,
    )
    print(f"\n>>> Running GridSearch for {name} ...")
    gs.fit(X_train, y_train)
    print(f"Best CV macro F1 ({name}): {gs.best_score_:.4f}")
    print("Best params:")
    for k, v in gs.best_params_.items():
        print(f"  {k}: {v}")
    return gs



def main():
    DATA_PATH = DATA_DIR / 'intents.csv'

    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", default=DATA_PATH)
    ap.add_argument("--cv", type=int, default=5)
    ap.add_argument("--n_jobs", type=int, default=-1)
    ap.add_argument("--verbose", type=int, default=1)
    args = ap.parse_args()

    X, y, le, labels = load_dataset(args.csv)
    

    X_train, X_test, y_train, y_test = split_data(X, y, test_size=0.2, seed=42)

    tfidf = make_vectorizer()
    estimators = build_estimators()
    pipelines = build_pipelines(tfidf, estimators)

    grids = build_param_grids()
    
    # Train and evaluate all pipelines using grid search; select the best model based on cross-validation score.
    best_name, best_gs, best_cv_score, best_holdout = None, None, -1.0, -1.0

    for name, pipe in pipelines.items():
        gs = run_grid_search(
            name, pipe, grids[name],
            X_train, y_train,
            cv_folds=args.cv, n_jobs=args.n_jobs, verbose=args.verbose
        )

        holdout_f1 = evaluate_on_holdout(
            name, 
            gs.best_estimator_, 
            X_test, 
            y_test, 
            labels
        )

        if gs.best_score_ > best_cv_score:
            best_name = name
            best_gs = gs
            best_cv_score = gs.best_score_
            best_holdout = holdout_f1

    print(f"\n=== Overall best by CV macro F1: {best_name} (CV={best_cv_score:.4f}, Holdout={best_holdout:.4f}) ===")

    save_estimator(best_gs, le)


if __name__ == "__main__":
    main()
