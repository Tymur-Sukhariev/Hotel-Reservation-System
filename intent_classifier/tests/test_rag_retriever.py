from app.rag.retriever import retriever

query = "Is parking free?"
intent = "parking_info"

results = retriever.search_with_intent(query, intent)

for i, (chunk, dist, real_idx) in enumerate(results):
    # print(dist, "\n")
    # print(chunk, "\n")
    # print(real_idx)
    print("Retrieved chunk:\n", chunk[:120], "...")
    print("\nChunks[idx]:\n", retriever.chunks[real_idx][:120], "...")
