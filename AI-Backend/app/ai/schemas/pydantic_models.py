# pydantic models to be used
from pydantic import BaseModel

class TransformRequest(BaseModel):
    startup_id: int | None
    user_id: int | None
    blurb: str
    investor_preference: str

class AIResponse(BaseModel):
    response: str 

class ChatRequest(BaseModel): 
    session_id: str | None = None 
    message: str 
    