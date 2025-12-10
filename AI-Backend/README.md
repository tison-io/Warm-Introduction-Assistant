# Documentation for AI Backend.

## File structure.
We have a server.py within the app folder that is responsible for running the fastapi backend. It imports a transform function from the ai.main module. This function handles the core logic of transforming startup blurbs based on investor preferences.
The ai folder contains several submodules:
- prompts: Contains prompt templates used for guiding the AI model.
- chains: Contains configuration for the AI model, including setting up the language model (LLM) with specific parameters.
- schemas: Contains Pydantic models for request and response validation.
The main transformation logic is in ai.main, which uses the prompts and chains to process input data and generate the desired output.
THE LLM is configured in utils/config.py and imported into chains/ai_config.py for use in the transformation process.

## API Endpoints
- GET /health: A simple health check endpoint that returns a status message indicating the service is
    healthy.
- POST /transform: Accepts a JSON payload containing a startup blurb and investor preferences, processes this data using the transform function, and returns the rewritten pitch.
The backend uses FastAPI for handling HTTP requests and SlowAPI for rate limiting to prevent abuse. Logging is set up to track the application's behavior and any potential issues.
## AI Transformation Logic
The transform function in ai.main takes a TransformRequest object as input, which includes the startup blurb and investor preferences. It constructs a prompt using these inputs and the predefined system prompt from ai.prompts.prompts. The prompt is then sent to the LLM configured in chains.ai_config, which generates a rewritten pitch tailored to the investor's interests. The result is returned as an AIResponse object.
## Rate Limiting
The backend employs SlowAPI to implement rate limiting, ensuring that clients cannot overwhelm the service with too many requests in a short period. This is crucial for maintaining performance and availability.
