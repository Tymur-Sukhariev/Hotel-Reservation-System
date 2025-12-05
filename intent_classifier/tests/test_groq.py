from groq import Groq

from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

resp = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[
        {"role": "system", "content": "Answer using context only..."},
        {"role": "user", "content": "how many people are on the Earth?"}
    ],
    temperature=0
)

answer_text = resp.choices[0].message.content
# print(answer_text)

