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
      addBotMessage("");

      console.log("Sending message:", userText);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("https://warm-introduction-assistant.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "dev-ops"
        },
        body: JSON.stringify({
          message: userText,
          session_id: "user-session-" + Date.now()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "chunk" && data.content) {
                  fullResponse += data.content;

                  setMessages(prev => {
                    const newMessages = [...prev];
                    const botIdx = newMessages.length - 1;
                    if (newMessages[botIdx]?.from === "bot") {
                      newMessages[botIdx].text = fullResponse + "▋";
                      newMessages[botIdx].isStreaming = true;
                    }
                    return newMessages;
                  });

                  await new Promise(res => setTimeout(res, 20));
                }
              } catch {}
            }
          }
        }

        setMessages(prev => {
          const newMessages = [...prev];
          const botIdx = newMessages.length - 1;
          if (newMessages[botIdx]?.from === "bot") {
            newMessages[botIdx].text = fullResponse;
            newMessages[botIdx].isStreaming = false;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      let errorMessage = "Sorry, I'm having trouble connecting. Please try again.";

      if (error instanceof Error && error.name === 'AbortError') {
        errorMessage = "Request timed out. The server might be slow.";
      }

      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1]?.from === 'bot') {
          newMessages[newMessages.length - 1].text = errorMessage;
        }
        return newMessages;
      });
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
      <button className="chatbot-close" aria-label="Close chatbot" onClick={onClose}>
        ✕
      </button>
      <div className="chatbot-header">
        <img src={avatarUrl} alt="Bot Avatar" className="chatbot-avatar" />
      </div>
      <div className="chatbot-content">
        {messages.length === 0 ? (
          <div className="chatbot-welcome">
            <h2>Hello!</h2>
            <div style={{ fontSize: 18, marginBottom: 24 }}>
              What Can I Assist You Today?
            </div>
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
            <path
              d="M9 15.8l7.7 3.8c1.2.6 2.4-.6 1.8-1.8L15.8 9c-.6-1.2-2.2-1.2-2.8 0L9 15.8z"
              fill="#fff"
            />
          </svg>
        </button>
      </div>

      {/* Styles unchanged */}
      <style jsx>{`
        /* ...same CSS... */
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
          transition: "transform 0.2s"
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <img src="/chatbot.png" alt="Chat" style={{ width: 32, height: 32 }} />
      </button>

      {isOpen && <ChatBotBox onClose={() => setIsOpen(false)} />}
    </>
  );
}