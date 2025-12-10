import os 
import logging 
from langchain_groq import ChatGroq 
from langchain_core.runnables import RunnablePassthrough 
from langchain_core.output_parsers import StrOutputParser 
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder 

from dotenv import load_dotenv 

from app.ai.utils.memory import get_memory 
from ..utils.config import llm as custom_llm
from ..prompts.prompts import CONVERSATION_SYSTEM_PROMPT 

load_dotenv() 

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise EnvironmentError("Missing or invalid Groq API key in environment variables.") 

class ChatbotSession:
    def __init__(self, session_id):
        self.session_id = session_id
        self.memory = get_memory(session_id)
        self.chain = self._build_chain()
        
    def _build_chain(self):
        prompt = ChatPromptTemplate.from_messages([
            ("system", CONVERSATION_SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{question}")
        ])
        
        return (
            RunnablePassthrough.assign(
                chat_history=lambda x: self.memory.load_memory_variables({})["chat_history"]
            )
            | prompt
            | custom_llm
            | StrOutputParser()
        ) 
    
    def invoke(self, inputs):
        response = self.chain.invoke(inputs)
        self.memory.save_context({"question": inputs["question"]}, {"answer": response})
        return response
    
    def stream(self, inputs):
        return self.chain.stream(inputs)
    
    def save_to_memory(self, question, answer):
        self.memory.save_context({"question": question}, {"answer": answer})

def build_chatbot_session(session_id): 
    logger.info(f"📦 Building chatbot session: {session_id}") 
    try: 
        return ChatbotSession(session_id) 
    except Exception as e: 
        logger.error(f"Error building chatbot session: {e}")
        raise RuntimeError("Failed to build chatbot session") 
