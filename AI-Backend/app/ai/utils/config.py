# models switching config import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
import os

load_dotenv()

GROQ_API_KEY=os.getenv("GROQ_API_KEY")


llm = ChatGroq(
    model = "moonshotai/kimi-k2-instruct-0905",
    temperature = 0.75,
    max_tokens=None,
    # reasoning_format="parsed",
    timeout=None,
    max_retries=2
)

# messages = [
#     ("system",
#      SYSTEM_PROMPT,),
#      ("human", "I love programming")

# ]

# ai_msg=llm.invoke(messages)
# print(ai_msg.content)



# if GROQ_API_KEY:
#     print("Key found")
# else:
#     print("Key not found.")