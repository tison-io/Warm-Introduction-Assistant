"use client";
import React, { useState, useRef, useEffect } from "react";

const avatarUrl = "/chatbot.png";

const SUGGESTIONS = [
  "How do I create an investor introduction?",
  "Show me my investor queue",
  "Set a follow-up reminder"
];

type Message = {
  from: "bot" | "user";
  text: string;
  isStreaming?: boolean;
};

function ChatBotBox({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [messages.length]);

  const handleSuggestion = async (s: string) => {
    addUserMessage(s);
    await botReply(s);
  };

  function addUserMessage(text: string) {
    setMessages(list => [...list, { from: "user", text }]);
  }
  function addBotMessage(text: string) {
    setMessages(list => [...list, { from: "bot", text }]);
  }
  async function botReply(userText: string) {
    try {
      // Add empty bot message that will be filled with streaming content
      addBotMessage("");
      
      console.log('Sending message:', userText);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('https://warm-introduction-assistant.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'dev-ops'
        },
        body: JSON.stringify({ 
          message: userText,
          session_id: 'user-session-' + Date.now()
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullResponse = '';
        let isStreaming = true;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            isStreaming = false;
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'chunk' && data.content) {
                  fullResponse += data.content;
                  
                  // Update with streaming cursor
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const botMessageIdx = newMessages.length - 1;
                    if (newMessages[botMessageIdx]?.from === 'bot') {
                      newMessages[botMessageIdx].text = fullResponse + '▋';
                      newMessages[botMessageIdx].isStreaming = true;
                    }
                    return newMessages;
                  });
                  
                  // Add small delay for typing effect
                  await new Promise(resolve => setTimeout(resolve, 20));
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
        
        // Remove cursor when streaming is complete
        setMessages(prev => {
          const newMessages = [...prev];
          const botMessageIdx = newMessages.length - 1;
          if (newMessages[botMessageIdx]?.from === 'bot') {
            newMessages[botMessageIdx].text = fullResponse;
            newMessages[botMessageIdx].isStreaming = false;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      let errorMessage = "Sorry, I'm having trouble connecting. Please try again.";
      
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. The server might be slow.";
      }
      
      // Replace the empty message with error message
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1]?.from === 'bot') {
          newMessages[newMessages.length - 1].text = errorMessage;
        }
        return newMessages;
      });
    }
  }

  function handleStreamEvent(data: any) {
    switch(data.type) {
      case 'start':
        // Message container already initialized
        break;
      case 'chunk':
        // Append content to the bot message
        setMessages(prev => {
          const newMessages = [...prev];
          const botMessageIdx = newMessages.length - 1;
          if (newMessages[botMessageIdx]?.from === 'bot') {
            newMessages[botMessageIdx].text += data.content || '';
          }
          return newMessages;
        });
        break;
      case 'end':
        // Streaming complete
        break;
    }
  }

  async function handleSend() {
    if (input.trim() !== "") {
      const message = input.trim();
      addUserMessage(message);
      setInput("");
      await botReply(message);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className="chatbot-box">
      <button className="chatbot-close" aria-label="Close chatbot" onClick={onClose}>✕</button>
      <div className="chatbot-header">
        <img src={avatarUrl} alt="Bot Avatar" className="chatbot-avatar" />
      </div>
      <div className="chatbot-content">
        {messages.length === 0 ? (
          <div className="chatbot-welcome">
            <h2>Hello!</h2>
            <div style={{ fontSize: 18, marginBottom: 24 }}>What Can I Assist You Today?</div>
            <div className="chatbot-suggestions">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  className="chatbot-suggestion"
                  key={idx}
                  onClick={() => handleSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message chatbot-message--${msg.from}`}
              >
                {msg.from === "bot" && (
                  <img src={avatarUrl} className="chatbot-message-avatar" alt="Bot" />
                )}
                <div className="chatbot-message-bubble">{msg.text}</div>
                {msg.from === "user" && (
                  <div className="chatbot-message-user-icon" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="chatbot-footer">
        <button className="chatbot-mic">
          <svg width={25} height={25} fill="none" viewBox="0 0 25 25">
            <circle cx="12.5" cy="12.5" r="12" fill="#24d6fc" />
            <rect x="10" y="6" width="5" height="9" rx="2.5" fill="#fff" />
            <rect x="9" y="15.5" width="7" height="2" rx="1" fill="#fff" />
          </svg>
        </button>
        <input
          ref={inputRef}
          className="chatbot-input"
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chatbot-send" onClick={handleSend}>
          <svg width={29} height={29} fill="none" viewBox="0 0 29 29">
            <circle cx="14.5" cy="14.5" r="14" fill="#24d6fc" />
            <path d="M9 15.8l7.7 3.8c1.2.6 2.4-.6 1.8-1.8L15.8 9c-.6-1.2-2.2-1.2-2.8 0L9 15.8z" fill="#fff" />
          </svg>
        </button>
      </div>
      <style jsx>{`
        .chatbot-box {
          width: 350px;
          min-height: 520px;
          max-height: 94vh;
          background: #fff;
          box-shadow: 0 4px 32px #23265922;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          position: fixed;
          bottom: 34px;
          right: 34px;
          z-index: 1000;
          font-family: system-ui, sans-serif;
          overflow: hidden;
          border: 2px solid #f2f7fe;
        }
        .chatbot-close {
          position: absolute;
          top: 13px;
          right: 19px;
          background: none;
          border: none;
          font-size: 1.7rem;
          color: #4d5b7a;
          cursor: pointer;
          opacity: .74;
          z-index: 2;
        }
        .chatbot-header {
          display: flex;
          justify-content: center;
          margin-top: 17px;
          margin-bottom: 7px;
        }
        .chatbot-avatar {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: #24d6fc;
          object-fit: cover;
          box-shadow: 0 2px 7px #1cd1e744;
        }
        .chatbot-content {
          flex: 1;
          padding: 0 18px;
          overflow-y: auto;
        }
        .chatbot-welcome {
          text-align: center;
          margin-top: 22px;
        }
        .chatbot-suggestions {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .chatbot-suggestion {
          padding: 13px 8px;
          background: #fff;
          border: 1.5px solid #b3bcde;
          border-radius: 8px;
          font-size: 17px;
          color: #232b46;
          text-align: left;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.13s, border 0.13s;
          width: 100%;
        }
        .chatbot-suggestion:hover, .chatbot-suggestion:focus {
          background: #f4f8ff;
          border: 1.5px solid #24d6fc;
        }
        .chatbot-messages {
          margin-top: 22px;
          display: flex;
          flex-direction: column;
          gap: 19px;
        }
        .chatbot-message {
          display: flex;
          align-items: flex-end;
          max-width: 90%;
        }
        .chatbot-message--bot {
          flex-direction: row;
        }
        .chatbot-message--user {
          flex-direction: row-reverse;
          margin-left: auto;
        }
        .chatbot-message-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #24d6fc;
          margin-right: 7px;
        }
        .chatbot-message-user-icon {
          width: 26px;
          height: 26px;
          background: #3682f7;
          border-radius: 50%;
          margin-left: 9px;
          position: relative;
        }
        .chatbot-message-user-icon:after {
          content: "";
          display: block;
          background: #fff;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          position: absolute;
          left: 7px;
          top: 7px;
        }
        .chatbot-message-bubble {
          background: #485a6d;
          color: #fff;
          font-size: 16.1px;
          border-radius: 12px;
          padding: 13px 14px;
          max-width: 250px;
          min-width: 70px;
        }
        .chatbot-message--user .chatbot-message-bubble {
          background: #3682f7;
          color: #fff;
          margin-right: 9px;
        }
        .chatbot-footer {
          display: flex;
          align-items: center;
          padding: 9px 11px 11px 11px;
          border-top: 1.5px solid #e6ebf5;
          background: #f9fcfd;
        }
        .chatbot-mic {
          background: none;
          border: none;
          margin-right: 7px;
          cursor: pointer;
          width: 38px;
          height: 38px;
          align-items: center;
          display: flex;
        }
        .chatbot-input {
          flex: 1;
          background: #f4f6fb;
          border: 1.3px solid #b7b7d3;
          border-radius: 19px;
          padding: 11px 14px;
          font-size: 15px;
          outline: none;
          margin-right: 7px;
          font-family: inherit;
        }
        .chatbot-send {
          background: none;
          border: none;
          cursor: pointer;
          width: 38px;
          height: 38px;
          align-items: center;
          display: flex;
          margin-left: 2px;
        }
        .streaming-cursor {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function ChatbotFloat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "none",
          background: "#1746e0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <img src="/chatbot.png" alt="Chat" style={{ width: 32, height: 32 }} />
      </button>

      {isOpen && <ChatBotBox onClose={() => setIsOpen(false)} />}
    </>
  );
}
