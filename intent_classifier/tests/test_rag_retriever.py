from app.rag.retriever import retriever

query = "Is parking free?"
intent = "parking_info"

results = retriever.search_with_intent(query, intent)

for i, (chunk, dist) in enumerate(results):
    print(f"#{i}: dist={dist}")
    print(chunk)
    print()
