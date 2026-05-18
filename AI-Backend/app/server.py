# Hosts the fastapi endpoints 
import logging 
import os 
import uuid 

from fastapi import FastAPI, Request, status, Depends, HTTPException 
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import StreamingResponse 
from dotenv import load_dotenv 
from slowapi import Limiter, _rate_limit_exceeded_handler 
from slowapi.util import get_remote_address 
from slowapi.errors import RateLimitExceeded 

#AI Imports
from .ai.main import transform
from .ai.schemas.pydantic_models import TransformRequest, ChatRequest 
from .ai.chains.chatbot import build_chatbot_session
from .ai.utils.session_manager import session_manager 


logging.basicConfig(
  level=logging.INFO
)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address) 

app = FastAPI(
  title="WamlyAI API",
  description="Provides direct-action endpoints", 
  version="1.0.0"
)  

allowed_origins = [
  "https://warmly-intro-assistant.vercel.app"
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

main_server_url = os.getenv("MAIN_SERVER_URL")
if main_server_url:
    allowed_origins.append(main_server_url)

app.add_middleware(
  CORSMiddleware, 
  allow_origins=allowed_origins, 
  allow_credentials=True, 
  allow_methods=["*"], 
  allow_headers=["*"]
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) 

API_KEY = os.getenv("BACKEND_SECRET_KEY") 
API_KEY_NAME = "X-API-Key" 
api_key_header_scheme = APIKeyHeader(name=API_KEY_NAME, auto_error=False)  

async def get_api_key(api_key_header: str = Depends(api_key_header_scheme)):
  if not api_key_header or api_key_header != API_KEY:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED, 
      detail="Could not validate credentials"
    )
  return api_key_header 

api_dependencies = [Depends(get_api_key)] 

@app.on_event("startup") 
async def on_startup():
  logger.info("WarmlyAI running 🚀...") 
  logger.info("✅ Session manager is ready")

@app.get("/", status_code=status.HTTP_200_OK, tags=["System"]) 
@limiter.limit(limit_value="60/minute") 
async def root(request: Request):
  return {
    "Status": "WarmlyAI Running 🚀",
    "Message": "Welcome to Warmly AI API. Go to /docs for all endpoints."
  }

@app.get("/health", status_code=status.HTTP_200_OK, dependencies=api_dependencies) 
@limiter.limit(limit_value="60/minute")
async def health_check(request: Request): 
  return {
    "status": "healthy 🩺"
  }

@app.post("/transform") 
@limiter.limit(limit_value="60/minute")
def transformer(payload: TransformRequest, request: Request):
  return transform(payload) 

@app.post("/chat", dependencies=api_dependencies) 
@limiter.limit(limit_value="60/minute")
async def chat(req: ChatRequest, request: Request): 
  try: 
    if not req.message.strip():
      raise HTTPException(status_code=400, detail="🚨 Message cannot be empty.") 
    
    session_id = req.session_id or str(uuid.uuid4()) 

    chatbot_session = await session_manager.get_session(session_id, build_chatbot_session)
    logger.info(f"🔗 Using chatbot session: {session_id}") 

    async def generate_stream():
      yield f"data: {{\"session_id\": \"{session_id}\", \"type\": \"start\"}}\n\n"
      
      full_response = ""
      for chunk in chatbot_session.stream({"question": req.message}):
        full_response += chunk
        yield f"data: {{\"session_id\": \"{session_id}\", \"type\": \"chunk\", \"content\": \"{chunk}\"}}\n\n"
      
      chatbot_session.save_to_memory(req.message, full_response)
      yield f"data: {{\"session_id\": \"{session_id}\", \"type\": \"end\"}}\n\n"

    return StreamingResponse(generate_stream(), media_type="text/plain") 
  
  except HTTPException:
    raise 
  except Exception as e: 
    logger.error(f"Chatbot error: {e}") 
    raise HTTPException(status_code=500, detail="Internal Server Error") 

