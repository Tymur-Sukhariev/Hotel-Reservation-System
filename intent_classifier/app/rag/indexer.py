import os
import faiss
import pickle
from typing import List, Dict
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer
import sys

DOCS_DIR = "app/docs"
VECTOR_STORE_DIR = "vector_store"

CHUNK_SIZE = 350
CHUNK_OVERLAP = 50

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


# -------------------------
# Helpers
# -------------------------

def load_documents() -> Dict[str, str]:
    docs = {}
    for filename in os.listdir(DOCS_DIR):
        if filename.endswith(".txt"):
            path = os.path.join(DOCS_DIR, filename)
            with open(path, "r", encoding="utf-8") as f:
                docs[filename] = f.read()
    return docs

# print(load_documents())
# sys.exit()
def split_into_chunks(text: str, tokenizer, chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP) -> List[str]:
    """Token-based chunking for more accurate embedding."""
    tokens = tokenizer.tokenize(text)
    chunks = []

    start = 0
    while start < len(tokens):
        end = start + chunk_size #350
        token_chunk = tokens[start:end] #piece from tokens -> 350 words
        chunk_text = tokenizer.convert_tokens_to_string(token_chunk) #convert a piece into a string
        chunks.append(chunk_text) #insert a piece in the output
        start += chunk_size - chunk_overlap # 300, so next is 300 + 350 = 650-> 300:650

    return chunks


# -------------------------
# Index builder
# -------------------------

def build_faiss_index(embeddings):
    """Create a FAISS index (L2 distance)."""
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    return index


def save_vector_store(index, chunks, metadata):
    """Save index + chunks + metadata."""
    os.makedirs(VECTOR_STORE_DIR, exist_ok=True)

    faiss.write_index(index, os.path.join(VECTOR_STORE_DIR, "faiss.index"))

    with open(os.path.join(VECTOR_STORE_DIR, "chunks.pkl"), "wb") as f:
        pickle.dump(chunks, f)

    with open(os.path.join(VECTOR_STORE_DIR, "metadata.pkl"), "wb") as f:
        pickle.dump(metadata, f)


# -------------------------
# Entry function
# -------------------------

def build_index():
    print("Loading documents...")
    docs = load_documents()

    print(f"Loaded {len(docs)} documents.")

    tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
    embedder = SentenceTransformer(MODEL_NAME)

    all_chunks = []
    metadata = []

    print("Splitting into chunks...")
    for filename, text in docs.items():
        chunks = split_into_chunks(text, tokenizer)
        for chunk in chunks:
            metadata.append({"source": filename})
            all_chunks.append(chunk)
            print("CHUUNK",chunk)

    print(f"Created {len(all_chunks)} total chunks.")

    print("Embedding chunks...")
    embeddings = embedder.encode(all_chunks, show_progress_bar=True, normalize_embeddings=True)
    embeddings = embeddings.astype("float32")

    print("Building FAISS index...")
    index = build_faiss_index(embeddings)

    print("Saving vector store...")
    save_vector_store(index, all_chunks, metadata)

    print("Index building complete!")
    print(f"Embeddings saved in: {VECTOR_STORE_DIR}")


if __name__ == "__main__":
    build_index()
