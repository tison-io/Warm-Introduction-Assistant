import asyncio 

class SessionManager: 
    def __init__(self): 
        self.sessions = {} 
        self.lock = asyncio.Lock() 

    async def get_session(self, session_id, builder): 
        async with self.lock: 
            if session_id not in self.sessions: 
                self.sessions[session_id] = builder(session_id) 
            return self.sessions[session_id] 
        
session_manager = SessionManager() 

