# Hosts the fastapi endpoints 
import logging 
import os 
from fastapi import FastAPI, Request, status, Depends, HTTPException
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware 
from dotenv import load_dotenv 
from slowapi import Limiter, _rate_limit_exceeded_handler 
from slowapi.util import get_remote_address 
from slowapi.errors import RateLimitExceeded 

#AI Imports
from ai.main import transform
from ai.schemas.pydantic_models import TransformRequest


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
  "*"
]

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

@app.get("/", status_code=status.HTTP_200_OK, tags=["System"]) 
@limiter.limit(limit_value="60/minute") 
async def root(request: Request):
  return {
    "Status": "Running 🚀",
    "Message": "Welcome to Warmly AI API. Go to /docs for all endpoints."
  }

@app.get("/health", status_code=status.HTTP_200_OK, dependencies=api_dependencies) 
@limiter.limit(limit_value="60/minute")
async def health_check(request: Request): 
  return {
    "status": "healthy 🩺"
  }

@app.post("/transform")
def transformer(payload: TransformRequest):
  return transform(payload)