
# from scripts.estimator import get_intent

# print(get_intent("Helo! Can I make a reservation?"))


import re

text = "check 2025-12-20"

mrange = re.search(r"(\d{4}-\d{2}-\d{2}).{0,10}(\d{4}-\d{2}-\d{2})", text)


