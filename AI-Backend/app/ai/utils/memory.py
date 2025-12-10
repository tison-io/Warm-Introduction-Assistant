from langchain_classic.memory import ConversationBufferMemory 
from langchain_classic.schema import messages_from_dict, messages_to_dict 

def get_memory(session_id):
    try: 
        return ConversationBufferMemory(
            memory_key="chat_history", 
            return_messages=True, 
            input_key="question"
        ) 
    except Exception as e: 
        print(f"Error setting up memory for session {session_id}: {e}")
        raise 