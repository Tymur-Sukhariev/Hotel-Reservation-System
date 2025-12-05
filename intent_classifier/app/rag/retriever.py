import os
import pickle
import faiss
from typing import List, Tuple, Dict, Any
import numpy as np
from sentence_transformers import SentenceTransformer

from app.core.intent_keywords import INTENT_KEYWORDS

VECTOR_DIR = "vector_store"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

TOP_K = 5


class RAGRetriever:
    def __init__(self):
        # Load FAISS index
        index_path = os.path.join(VECTOR_DIR, "faiss.index")
        self.index = faiss.read_index(index_path)

        # Load chunk text list
        with open(os.path.join(VECTOR_DIR, "chunks.pkl"), "rb") as f:
            self.chunks: List[str] = pickle.load(f)

        # Load metadata (one entry per chunk)
        with open(os.path.join(VECTOR_DIR, "metadata.pkl"), "rb") as f:
            self.metadata: List[Dict[str, Any]] = pickle.load(f)

        # Embedding model
        self.embedder = SentenceTransformer(MODEL_NAME)

    # ---------------------------------------------------------
    # Embedding generation
    # ---------------------------------------------------------
    def embed_query(self, text: str):
        vec = self.embedder.encode([text], normalize_embeddings=True)
        return vec.astype("float32")

    # ---------------------------------------------------------
    # Global search (no intent filtering)
    # ---------------------------------------------------------
    def search(self, text: str, k: int = TOP_K) -> List[Tuple[str, float]]:
        query_vec = self.embed_query(text)
        distances, indices = self.index.search(query_vec, k)

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            results.append((self.chunks[idx], float(dist)))

        return results

    # ---------------------------------------------------------
    # Intent-aware search (keyword filtering)
    # ---------------------------------------------------------
    def search_with_intent(self, text: str, intent: str):
        keywords = INTENT_KEYWORDS.get(intent)

        # If no keyword list defined → global search
        if not keywords:
            return self.search(text)

        filtered_indices = []

        # Step 1 — find chunks that contain any of the keywords
        for i, meta in enumerate(self.metadata):
            chunk_text = self.chunks[i].lower()
            source = meta["source"].lower()

            # TRUE if ANY keyword matches either the text or the source filename
            if any(kw in chunk_text or kw in source for kw in keywords):
                filtered_indices.append(i)

        # If nothing matched → fallback to global search
        if not filtered_indices:
            return self.search(text)

        # Step 2 — embed query
        query_vec = self.embed_query(text)

        # Step 3 — build FAISS subset index
        subset = faiss.IndexFlatL2(self.index.d)
        
        subset_vecs = np.array(
            [self.index.reconstruct(idx) for idx in filtered_indices],
            dtype="float32"
        )

        subset.add(subset_vecs)

        # Step 4 — search inside the filtered subset
        distances, subset_idx = subset.search(query_vec, TOP_K)

        # Step 5 — convert LOCAL subset results → GLOBAL chunk indices
        results = []
        for rank, local_idx in enumerate(subset_idx[0]):
            real_idx = filtered_indices[local_idx]
            results.append((self.chunks[real_idx], float(distances[0][rank]), real_idx))

        return results


# Singleton retriever instance
retriever = RAGRetriever()