# Hosts the fastapi endpoints 
from fastapi import FastAPI, Request, status 
from fastapi.middleware.cors import CORSMiddleware 
from dotenv import load_dotenv 
import logging 

logging.basicConfig(
  level=logging.INFO
)
logger = logging.getLogger(__name__)

app = FastAPI(
  title="Wamly AI API",
  description="Provides direct-action endpoints", 
  version="1.0.0"
) 

app.add_middleware(
  CORSMiddleware, 
  allow_origins=["*"], 
  allow_credentials=True, 
  allow_methods=["*"], 
  allow_headers=["*"]
)

@app.on_event("startup") 
async def on_startup():
  logger.info("WarmlyAI running 🚀...")

@app.get("/", status_code=status.HTTP_200_OK, tags=["System"])
async def root():
  return {
    "Status": "Running 🚀",
    "Message": "Welcome to Warmly AI API. Go to /docs for all endpoints."
  }

@app.get("/health", status_code=status.HTTP_200_OK) 
async def health_check(): 
  return {
    "status": "healthy 🩺"
  }