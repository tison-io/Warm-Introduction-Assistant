import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();
    
    const aiUrl = process.env.GENAI_CHAT_URL || 'https://warm-introduction-assistant.onrender.com/chat';
    const response = await fetch(aiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        session_id: sessionId || 'default-session'
      })
    });

    if (!response.ok) {
      throw new Error('Team API request failed');
    }

    // Return the streaming response directly from team's API
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
      }
    });
  } catch (error) {
    return new Response('Error: Unable to connect to chatbot', {
      status: 500
    });
  }
}