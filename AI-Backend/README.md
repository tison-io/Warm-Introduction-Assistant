# Warm Introduction Assistant - AI Backend 🤖

A FastAPI-based AI backend service that provides intelligent startup pitch transformation and conversational chatbot capabilities for the Warm Introduction Assistant platform.

## 🏗️ Architecture Overview

The AI Backend is built with a modular architecture using FastAPI, LangChain, and Groq API integration:

```
AI-Backend/
├── app/
│   ├── ai/                     # Core AI functionality
│   │   ├── chains/            # LangChain implementations
│   │   ├── prompts/           # AI prompt templates
│   │   ├── schemas/           # Pydantic data models
│   │   ├── utils/             # Utilities and configurations
│   │   └── main.py            # Transform function logic
│   └── server.py              # FastAPI application
├── tests/                     # Test files
├── Dockerfile                 # Container configuration
├── requirements.txt           # Python dependencies
└── .env.example              # Environment variables template
```

## 🚀 Features

### 1. **Startup Pitch Transformation**
- Converts raw startup blurbs into investor-ready pitches
- Supports multiple output formats (3-bullet points, email format)
- Maintains factual integrity without hallucinating metrics
- Tailored to specific investor preferences

### 2. **Conversational AI Chatbot**
- Session-based memory management
- Real-time streaming responses
- Business-focused conversation scope
- Investor conversation guidance and tips

### 3. **Session Management**
- Thread-safe session isolation
- Persistent conversation memory
- Automatic session creation and management

## 📡 API Endpoints

### System Endpoints

#### `GET /`
- **Description**: Root endpoint with service status
- **Response**: Service information and welcome message

#### `GET /health`
- **Description**: Health check endpoint
- **Headers**: `X-API-Key` required
- **Response**: Service health status

### AI Endpoints

#### `POST /transform`
- **Description**: Transform startup blurbs for investors
- **Request Body**:
  ```json
  {
    "blurb": "Your startup description...",
    "investor_preference": "3-bullet-lines" | "email"
  }
  ```
- **Response**: Transformed pitch content
- **Rate Limit**: 60 requests/minute

#### `POST /chat`
- **Description**: Streaming conversational AI chatbot
- **Headers**: `X-API-Key` required
- **Request Body**:
  ```json
  {
    "message": "Your question...",
    "session_id": "optional-session-id"
  }
  ```
- **Response**: Server-Sent Events stream
- **Rate Limit**: 60 requests/minute

## 🔄 Streaming Response Format

The `/chat` endpoint returns Server-Sent Events with the following format:

```
data: {"session_id": "uuid", "type": "start"}

data: {"session_id": "uuid", "type": "chunk", "content": "text chunk"}

data: {"session_id": "uuid", "type": "end"}
```

**Event Types:**
- `start`: Conversation initialization
- `chunk`: Incremental response content
- `end`: Response completion

## 🧠 AI Components

### Memory Management (`ai/utils/memory.py`)
- **Function**: `get_memory(session_id)`
- **Purpose**: Creates session-specific conversation memory
- **Technology**: LangChain ConversationBufferMemory

### Session Manager (`ai/utils/session_manager.py`)
- **Class**: `SessionManager`
- **Features**: Thread-safe session creation and retrieval
- **Implementation**: Async locks for concurrent access

### Chatbot Chain (`ai/chains/chatbot.py`)
- **Class**: `ChatbotSession`
- **Methods**:
  - `invoke(inputs)`: Synchronous response generation
  - `stream(inputs)`: Streaming response generation
  - `save_to_memory(question, answer)`: Memory persistence

### LLM Configuration (`ai/utils/config.py`)
- **Primary Model**: `moonshotai/kimi-k2-instruct-0905`
- **Fallback Model**: `meta-llama/llama-3.1-8b-instant`
- **Features**: Streaming enabled, automatic fallback

## 📋 Data Models

### TransformRequest
```python
{
    "blurb": str,
    "investor_preference": "3-bullet-lines" | "email"
}
```

### ChatRequest
```python
{
    "session_id": str | None,
    "message": str
}
```

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.11+
- Groq API Key

### Local Development

1. **Clone and navigate**:
   ```bash
   cd AI-Backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Required environment variables**:
   ```env
   GROQ_API_KEY=your_groq_api_key
   BACKEND_SECRET_KEY=your_secret_key
   ```

5. **Run the server**:
   ```bash
   uvicorn app.server:app --host 0.0.0.0 --port 8000 --reload
   ```

### Docker Deployment

1. **Build image**:
   ```bash
   docker build -t ai-backend .
   ```

2. **Run container**:
   ```bash
   docker run -p 8000:8000 --env-file .env ai-backend
   ```

## 🔒 Security Features

- **API Key Authentication**: All protected endpoints require `X-API-Key` header
- **Rate Limiting**: 60 requests per minute per IP address
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Input Validation**: Pydantic models ensure data integrity

## 🎯 AI Prompt Engineering

### Transform Prompts
- **System Role**: Venture Capital Analyst and Deal Flow Manager
- **Guidelines**: Factual integrity, tone adaptation, emphasis mapping
- **Output Formats**: 
  - 3-bullet format: Clean, precise business language
  - Email format: Professional, concise communication

### Conversation Prompts
- **System Role**: Friendly VC expert assistant
- **Scope**: Business and investor conversation guidance
- **Constraints**: No false information, business-focused topics only

## 📊 Monitoring & Logging

- **Logging Level**: INFO
- **Log Format**: Structured logging with timestamps
- **Key Events**: Session creation, API calls, errors
- **Health Monitoring**: `/health` endpoint for service status

## 🔧 Configuration

### LLM Settings
- **Temperature**: 0.75 (balanced creativity/consistency)
- **Max Retries**: 2
- **Streaming**: Enabled
- **Timeout**: None (no timeout limit)

### Rate Limiting
- **Default**: 60 requests/minute per IP
- **Implementation**: SlowAPI with Redis-like backend
- **Scope**: Per-endpoint configuration

## 🚨 Error Handling

- **HTTP 400**: Invalid request format or empty messages
- **HTTP 401**: Missing or invalid API key
- **HTTP 429**: Rate limit exceeded
- **HTTP 500**: Internal server errors with detailed logging

## 📈 Performance Considerations

- **Session Isolation**: Each session maintains separate memory
- **Streaming**: Reduces perceived latency for long responses
- **Async Operations**: Non-blocking session management
- **Memory Efficiency**: Conversation buffer with configurable limits

## 🧪 Testing

Run tests using:
```bash
pytest tests/
```

## 📚 Dependencies

**Core Framework:**
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `pydantic`: Data validation

**AI & ML:**
- `langchain`: LLM framework
- `langchain-groq`: Groq API integration
- `langchain_community`: Community extensions

**Utilities:**
- `python-dotenv`: Environment management
- `slowapi`: Rate limiting
- `requests`: HTTP client

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation for API changes
4. Ensure proper error handling and logging

## 📄 License

This project is part of the Warm Introduction Assistant platform.

---

**Built with ❤️ for connecting startups with investors**