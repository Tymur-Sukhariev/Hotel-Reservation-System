from typing import List, Dict, Any
from groq import Groq

from app.core.config import GROQ_API_KEY
from app.rag.retriever import retriever

client = Groq(api_key=GROQ_API_KEY)



# ----------------------------------------------------------
# Build a safe, deterministic RAG prompt
# ----------------------------------------------------------
def build_prompt(question: str, chunks: List[Dict[str, Any]]) -> str:
    """
    chunks format:
    [
        {
            "chunk_id": int,
            "text": str,
            "source": str,
            "score": float
        }
    ]
    """

    context_blocks = []

    for ch in chunks:
        block = (
            f"[Chunk {ch['chunk_id']} | Source: {ch['source']}]\n"
            f"{ch['text']}"
        )
        context_blocks.append(block)

    context_text = "\n\n".join(context_blocks)

    prompt = f"""
You are a hotel information assistant.

Answer the user's question **using ONLY the information in the context**.
If the answer is not in the provided context, reply exactly:

"I could not find this in the hotel information."

---

QUESTION:
{question}

---

CONTEXT:
{context_text}

---

ANSWER:
"""

    return prompt.strip()


# ----------------------------------------------------------
# Main RAG generator function called from handle_intent()
# ----------------------------------------------------------
def generate_answer(question: str, intent: str) -> Dict[str, Any]:
    """
    Returns a dict:

    {
      "answer": str,
      "citations": [
          {"chunk_id": int, "source": str},
          {"chunk_id": int, "source": str},
          ...
      ]
    }
    """

    # 1. Retrieve chunks 
    retrieved = retriever.search_with_intent(question, intent)

    # Convert retrieval results to structured chunk objects
    structured_chunks = []
    
    for text, score, true_idx in retrieved:
        structured_chunks.append({
            "chunk_id": true_idx,    # the REAL chunk ID
            "text": text,
            "source": retriever.metadata[true_idx]["source"],
            "score": score,
        })


    # 2. Build prompt
    prompt = build_prompt(question, structured_chunks)

    # 3. Call the model 
    resp = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )   
    
    answer_text = resp.choices[0].message.content

    # 4. Build citation structure
    citations = [
        {"chunk_id": ch["chunk_id"], "source": ch["source"], "score": ch["score"]}
        for ch in structured_chunks
    ]

    return {
        "answer": answer_text,
        "citations": citations,
    }


print(generate_answer("Is parking free?", "parking_info"))
