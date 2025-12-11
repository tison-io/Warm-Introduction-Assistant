# pydantic models to be used
from pydantic import BaseModel 
from typing import Literal, Optional 

class TransformRequest(BaseModel):
    blurb: str
    investor_preference: Literal["3-bullet-lines", "email"]

class AIResponse(BaseModel):
    response: str 

class ChatRequest(BaseModel): 
    session_id: str | None = None 
    message: str  


    