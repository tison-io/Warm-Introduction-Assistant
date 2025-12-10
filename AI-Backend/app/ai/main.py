## Script containing transform function for easy importation.
from .schemas.pydantic_models import TransformRequest, AIResponse
from .utils.config import llm
from .prompts.prompts import SYSTEM_PROMPT



def transform(request: TransformRequest) -> AIResponse:
    messages= messages = [
    ("system",
     SYSTEM_PROMPT,),
     ("human", f"Startup blurb: {request.blurb}. Investor Preferences: {request.investor_preference}")

]
    ai_message=llm.invoke(messages)

    return ai_message.content


## Testing the function
# test_data_full = {
#     "startup_id": 101,
#     "user_id": 42,
#     "blurb": "We are building an AI-powered logistics platform that optimizes last-mile delivery for e-commerce in East Africa. Our algorithm reduces fuel costs by 30% and improves delivery times by predicting traffic patterns.",
#     "investor_preference": "Focus on unit economics and scalability. Keep it concise."
# }
# print(transform(test_data_full))
# NB: If testing using this function, change request.blurb to request['blurb] and likewise for investor_preference