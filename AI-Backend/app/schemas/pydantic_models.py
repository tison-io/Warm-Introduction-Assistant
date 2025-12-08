# pydantic models to be used
from pydantic import Field, BaseModel 
from typing import Optional, List, Literal 

class TransformRequest(BaseModel):
    investor_id: str 
    startup_id: str  

class TransformResponse(BaseModel):
    formatted_intro: str 
    template_used: str 
    characters: str 

class InvestorFormatPreferences():
    preferred_intro_format: str 
    intro_preferences_text: str  



