"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AUTH_EVENT } from "../lib/auth-events";

const botAvatar = "/chatbot.png";

const SUGGESTIONS = [
  "How do I get founder requests?",
  "How do I set a follow-up reminder?",
  "Making a new intro",
];

type Message = {
  from: "bot" | "user";
  text: string;
  isStreaming?: boolean;
};

const ChatBotBox = ({ onClose }: { onClose?: () => void }) => {
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedId = sessionStorage.getItem('chat_session_id');
      if (savedId) return savedId;
      const newId = "user-session-" + Date.now();
      sessionStorage.setItem('chat_session_id', newId);
      return newId;
    }
    return "user-session-default";
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('chat_history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [userData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentUserAvatar = userData?.name 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=4F6EF7&color=fff`
    : "https://ui-avatars.com/api/?name=User&background=1e293b&color=fff";

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chat_history', JSON.stringify(messages));
    }

    inputRef.current?.focus();
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  async function botReply(userText: string) {
    try {
      setMessages((prev) => [...prev, { from: "bot", text: "", isStreaming: true }]);
      
      const response = await fetch("https://warm-introduction-assistant.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": "dev-ops" },
        body: JSON.stringify({
          message: userText,
          session_id: sessionId
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

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
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const botIdx = newMessages.length - 1;
                    if (newMessages[botIdx]?.from === "bot") {
                      newMessages[botIdx].text = fullResponse + "▋";
                    }
                    return newMessages;
                  });
                }
              } catch (e) {}
            }
          }
        }
        setMessages((prev) => {
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
      setMessages((prev) => [...prev, { from: "bot", text: "Error connecting to server." }]);
    }
  }

  const handleSend = async () => {
    if (input.trim() === "") return;
    const userMsg = input.trim();
    setInput("");
    setMessages((list) => [...list, { from: "user", text: userMsg }]);
    await botReply(userMsg);
  };

  const handleSuggestion = async (s: string) => {
    setMessages((list) => [...list, { from: "user", text: s }]);
    await botReply(s);
  };

  return (
    <div className="fixed bottom-24 right-6 w-[340px] h-[520px] bg-[#010204]/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-3xl flex flex-col z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-600/10 blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="relative p-4 flex flex-col items-center border-b border-white/5 bg-white/2">
        <button onClick={onClose} className="absolute top-4 right-5 text-slate-500 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="w-10 h-10 rounded-full border border-blue-500/30 overflow-hidden shadow-lg shadow-blue-500/10">
            <img src={botAvatar} alt="Bot" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-5 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center pt-2 px-2">
            <p className="text-slate-400 text-[13px] mb-6 font-light italic">Ready to assist your introductions.</p>
            <div className="space-y-2">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(s)}
                  className="w-full text-center p-3 text-[12px] text-slate-300 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/8 hover:border-blue-500/30 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <img 
                src={msg.from === "user" ? currentUserAvatar : botAvatar} 
                className="w-7 h-7 rounded-full object-cover border border-white/10 shadow-sm" 
                alt="avatar" 
              />
              <div className={`max-w-[78%] p-3.5 text-[13px] leading-relaxed shadow-sm ${
                msg.from === "user" 
                ? "bg-[#4F6EF7] text-white rounded-2xl rounded-br-none" 
                : "bg-[#2A3441] text-slate-100 rounded-2xl rounded-bl-none border border-white/5"
              }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/2 border-t border-white/5">
        <div className="relative flex items-center bg-[#13161C]/50 border border-white/10 rounded-2xl px-3 py-1.5 focus-within:border-blue-500/40 transition-all">
          <input
            ref={inputRef}
            type="text"
            placeholder="Write a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent text-white text-[13px] outline-none py-2 placeholder-slate-600"
          />
          <button 
            onClick={handleSend}
            className="ml-2 w-9 h-9 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ChatbotFloat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dashboardRoutes = [
    '/dashboard', '/investors', '/startups', '/create-startup', 
    '/generate-intro', '/intro-wizard', '/intro-queue', 
    '/reminders', '/settings', '/profile', '/transform'
  ];

  const isDashboardPage = dashboardRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    syncAuth();
    window.addEventListener(AUTH_EVENT, syncAuth);
    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  if (!isDashboardPage || !isLoggedIn) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-600 shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center transition-all hover:scale-110 z-50 border border-blue-400/20"
      >
        {isOpen ? (
          <svg className="text-white w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <img src="/chatbot.png" alt="Chat" className="w-6 h-6" />
        )}
      </button>

      {isOpen && <ChatBotBox onClose={() => setIsOpen(false)} />}
    </>
  );
}