"use client";
import React, { useState, useRef, useEffect } from "react";

const avatarUrl = "/chatbot.png";

const SUGGESTIONS = [
  "How do I create an investor introduction?",
  "Show me my investor queue",
  "Set a follow-up reminder",
];

type Message = {
  from: "bot" | "user";
  text: string;
  isStreaming?: boolean;
};

const ChatBotBox = ({ onClose }: { onClose?: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest message whenever messages change
  useEffect(() => {
    inputRef.current?.focus();
    if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSuggestion = async (s: string) => {
    addUserMessage(s);
    await botReply(s);
  };

  function addUserMessage(text: string) {
    setMessages(list => [...list, { from: "user", text }]);
  }

  async function botReply(userText: string) {
    try {
      // Add a placeholder message for the bot response to start streaming into
      setMessages(prev => [...prev, { from: "bot", text: "", isStreaming: true }]);

      console.log("Sending message:", userText);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // --- API Call to your streaming endpoint ---
      const response = await fetch("https://warm-introduction-assistant.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "dev-ops"
        },
        body: JSON.stringify({
          message: userText,
          session_id: "user-session-" + Date.now() // Unique session ID for the request
        }),
        signal: controller.signal
      });
      // ------------------------------------------

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

                  // Update the last bot message with the new chunk
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const botIdx = newMessages.length - 1;
                    if (newMessages[botIdx]?.from === "bot") {
                      // Add a streaming cursor '▋'
                      newMessages[botIdx].text = fullResponse + "▋";
                      newMessages[botIdx].isStreaming = true;
                    }
                    return newMessages;
                  });

                  await new Promise(res => setTimeout(res, 35));
                }
              } catch (e) { /* ignore JSON parsing errors */ }
            }
          }
        }

        // Final update to remove the streaming cursor and mark as not streaming
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

      // Update the last bot message with the error
      setMessages(prev => {
        const newMessages = [...prev];
        // Check for placeholder, or add a new message if streaming didn't start.
        if (newMessages[newMessages.length - 1]?.from === 'bot') {
          newMessages[newMessages.length - 1].text = errorMessage;
          newMessages[newMessages.length - 1].isStreaming = false;
        } else {
            newMessages.push({ from: 'bot', text: errorMessage });
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
    <div className="
        // .chatbot-box conversion
        w-[350px] md:w-[450px] min-h-[520px] md:min-h-[600px] max-h-[94vh] bg-white shadow-[0_4px_32px_#23265922]
        rounded-[18px] flex flex-col fixed bottom-[34px] right-[34px] z-50
        font-['system-ui',sans-serif] overflow-hidden border-2 border-[#f2f7fe]
    ">
      <button 
        className="
            // .chatbot-close conversion
            absolute top-[13px] right-[19px] bg-none border-none text-[1.7rem]
            text-[#4d5b7a] cursor-pointer opacity-74 z-10
        " 
        aria-label="Close chatbot" 
        onClick={onClose}
      >
        ✕
      </button>
      <div className="
        // .chatbot-header conversion
        flex justify-center mt-[17px] mb-[7px]
      ">
        <img 
          src={avatarUrl} 
          alt="Bot Avatar" 
          className="
            // .chatbot-avatar conversion
            w-[65px] h-[65px] rounded-full bg-[#24d6fc] object-cover 
            shadow-[0_2px_7px_#1cd1e744]
        " 
        />
      </div>
      <div 
        ref={contentRef}
        className="
            // .chatbot-content conversion
            flex-1 px-[18px] overflow-y-auto
      ">
        {messages.length === 0 ? (
          <div className="
            // .chatbot-welcome conversion
            text-center mt-[22px]
          ">
            <h2>Hello!</h2>
            <div className="text-[18px] mb-6">
                What Can I Assist You Today?
            </div>
            <div className="
                // .chatbot-suggestions conversion
                flex flex-col gap-[11px]
            ">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  className="
                    // .chatbot-suggestion conversion
                    py-[13px] px-2 bg-white border-[1.5px] border-[#b3bcde]
                    rounded-lg text-[17px] text-[#232b46] text-left font-medium 
                    cursor-pointer transition duration-130 ease-in-out w-full
                    hover:bg-[#f4f8ff] hover:border-[#24d6fc] focus:bg-[#f4f8ff] 
                    focus:border-[#24d6fc]
                  "
                  key={idx}
                  onClick={() => handleSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="
            // .chatbot-messages conversion
            mt-[22px] flex flex-col gap-[19px]
          ">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`
                    // .chatbot-message conversion & variants
                    flex items-end max-w-[90%]
                    ${msg.from === "bot" ? 'flex-row' : 'flex-row-reverse ml-auto'}
                `}
              >
                {msg.from === "bot" && (
                  <img 
                    src={avatarUrl} 
                    className="
                        // .chatbot-message-avatar conversion
                        w-[38px] h-[38px] rounded-full bg-[#24d6fc] mr-[7px]
                    " 
                    alt="Bot" 
                  />
                )}
                <div className={`
                    // .chatbot-message-bubble conversion
                    bg-[#485a6d] text-white text-[16.1px] rounded-2xl 
                    py-[13px] px-3.5 max-w-[250px] min-w-[70px]
                    ${msg.from === "user" ? 'bg-[#3682f7] mr-[9px]' : ''}
                `}>
                    {msg.text}
                </div>
                {msg.from === "user" && (
                  <div className="
                    // .chatbot-message-user-icon conversion
                    w-[26px] h-[26px] bg-[#3682f7] rounded-full ml-[9px] relative
                  ">
                    {/* Replaced CSS ::after with a nested div for Tailwind */}
                    <div className="
                        absolute left-[7px] top-[7px] block bg-white w-2.5
                        h-3 rounded-full
                    " />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="
        // .chatbot-footer conversion
        flex items-center p-[9px_11px_11px_11px] border-t-[1.5px] border-t-[#e6ebf5] 
        bg-[#f9fcfd]
      ">
        <button className="
            // .chatbot-mic conversion
            bg-none border-none mr-[7px] cursor-pointer w-[38px] h-[38px] 
            flex items-center
        ">
          <svg width={25} height={25} fill="none" viewBox="0 0 25 25">
            <circle cx="12.5" cy="12.5" r="12" fill="#24d6fc" />
            <rect x="10" y="6" width="5" height="9" rx="2.5" fill="#fff" />
            <rect x="9" y="15.5" width="7" height="2" rx="1" fill="#fff" />
          </svg>
        </button>
        <input
          ref={inputRef}
          className="
            // .chatbot-input conversion
            flex-1 bg-[#f4f6fb] border-[1.3px] border-[#b7b7d3] rounded-[19px] 
            py-[11px] px-3.5 text-[15px] outline-none mr-[7px] font-inherit
          "
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="
            // .chatbot-send conversion
            bg-none border-none cursor-pointer w-[38px] h-[38px] flex items-center 
            ml-0.5
        " onClick={handleSend}>
          <svg width={29} height={29} fill="none" viewBox="0 0 29 29">
            <circle cx="14.5" cy="14.5" r="14" fill="#24d6fc" />
            <path d="M9 15.8l7.7 3.8c1.2.6 2.4-.6 1.8-1.8L15.8 9c-.6-1.2-2.2-1.2-2.8 0L9 15.8z" fill="#fff" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ChatbotFloat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
            // Inline style conversion to Tailwind
            fixed bottom-6 right-6 w-[60px] h-[60px] rounded-full border-none 
            bg-[#1746e0] shadow-lg shadow-black/15 cursor-pointer z-50 flex 
            items-center justify-center transition duration-200 ease-in-out
        "
        // Retaining the necessary JavaScript for hover effects
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <img src="/chatbot.png" alt="Chat" className="w-8 h-8" />
      </button>

      {isOpen && <ChatBotBox onClose={() => setIsOpen(false)} />}
    </>
  );
}