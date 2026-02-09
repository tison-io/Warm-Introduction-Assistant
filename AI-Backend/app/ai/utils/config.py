# models switching config import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
import os

load_dotenv()

GROQ_API_KEY=os.getenv("GROQ_API_KEY") 
if not GROQ_API_KEY:
    raise EnvironmentError("Missing or invalid Groq API key in environment variables.") 
else:
    print("✅ GROQ_API_KEY loaded!") 


LLM_MODEL = "moonshotai/kimi-k2-instruct-0905"

try: 
    print(f"✅ Using {LLM_MODEL}")
    llm = ChatGroq(
        model = LLM_MODEL,
        temperature = 0.75,
        max_tokens=None,
        # reasoning_format="parsed",
        timeout=None,
        max_retries=2, 
        streaming=True, 
        api_key=GROQ_API_KEY
    ) 
except Exception as e: 
    print(f"❌ Groq model {LLM_MODEL} failed, falling back to different model")
    llm = ChatGroq(
        model = "meta-llama/llama-3.1-8b-instant",
        temperature = 0.75,
        max_tokens=None,
        # reasoning_format="parsed",
        timeout=None,
        max_retries=2, 
        streaming=True, 
        api_key=GROQ_API_KEY
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