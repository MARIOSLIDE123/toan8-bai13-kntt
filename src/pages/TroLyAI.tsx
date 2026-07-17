import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, RefreshCw, Compass, AlertCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";
import { renderTextWithMath } from "../components/MathFormula";
import { LearningRepository } from "../utils/repository";

interface TroLyAIProps {
  onIncrementTask?: (type: "practice" | "chat" | "game" | "exam", increment: number) => void;
}

const DEFAULT_WELCOME: ChatMessage[] = [
  {
    id: "welcome",
    sender: "ai",
    text: "Chào em! Thầy là Gia sư Toán 8 AI đây. 🌟\n\nHôm nay chúng mình cùng học 'Bài 3: Phép cộng và phép trừ đa thức' nhé. Thầy có thể hướng dẫn em cách bỏ ngoặc đổi dấu, cách thu gọn đơn thức đồng dạng, hoặc chấm điểm bài tập tự luyện cho em đấy!\n\nEm cần Thầy trợ giúp phần nào nào?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export default function TroLyAI({ onIncrementTask }: TroLyAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => 
    LearningRepository.getChatHistory(DEFAULT_WELCOME)
  );
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested starting prompts
  const suggestions = [
    { title: "Cách đổi dấu", prompt: "Thầy ơi giải thích giúp em quy tắc đổi dấu khi phá ngoặc có dấu trừ đằng trước với ạ!" },
    { title: "Ví dụ phép cộng", prompt: "Thầy cho em xin một ví dụ giải từng bước về Phép cộng hai đa thức dễ hiểu nhé!" },
    { title: "Mẹo làm toán", prompt: "Làm thế nào để tránh bị nhầm dấu âm (-) khi thực hiện trừ hai đa thức hả Thầy?" },
    { title: "Đơn thức đồng dạng", prompt: "Thế nào là hai đơn thức đồng dạng? Cho em ví dụ cụ thể với." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    LearningRepository.saveChatHistory(updatedMessages);
    setInputText("");
    setIsLoading(true);

    if (onIncrementTask) {
      onIncrementTask("chat", 1);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Lỗi mạng phản hồi từ server");
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.text || "Thầy đang suy nghĩ chút, em hỏi lại nhé!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      LearningRepository.saveChatHistory(finalMessages);

    } catch (error) {
      console.error("Lỗi khi trò chuyện với AI:", error);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: "ai",
        text: "Hệ thống đang gặp trục trặc kỹ thuật nhỏ khi liên lạc với Thầy AI. Nhưng đừng lo, em hãy kiểm tra kết nối mạng hoặc thử lại sau nhé! Thầy luôn ủng hộ em học tập! 💪",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalMessages = [...updatedMessages, errorMsg];
      setMessages(finalMessages);
      LearningRepository.saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(DEFAULT_WELCOME);
    LearningRepository.saveChatHistory(DEFAULT_WELCOME);
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-160px)] sm:h-[calc(100vh-200px)] flex flex-col justify-between pb-20">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 text-indigo-700 p-2 rounded-xl">
            <MessageSquare size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-600 block uppercase tracking-wider">Hỏi đáp thông minh</span>
            <h2 className="text-sm font-black text-slate-800">Gia sư Toán 8 AI</h2>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-bold transition-all"
          title="Xóa lịch sử trò chuyện"
        >
          <RefreshCw size={12} /> Làm mới chat
        </button>
      </div>

      {/* Messages Scroll viewport */}
      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4 scroll-smooth pr-1">
        {messages.map((msg) => {
          const isAi = msg.sender === "ai";
          return (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${isAi ? "self-start mr-auto" : "self-end ml-auto flex-row-reverse"}`}
            >
              {/* Avatar circle */}
              <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                isAi 
                  ? "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white animate-float" 
                  : "bg-slate-200 text-slate-700"
              }`}>
                {isAi ? "🤖" : "👤"}
              </div>

              {/* Message text bubble */}
              <div className="space-y-1">
                <div className={`px-4 py-3 rounded-2xl border text-sm sm:text-base font-medium leading-relaxed ${
                  isAi 
                    ? "bg-white border-slate-200 text-slate-800 shadow-xs rounded-tl-none" 
                    : "bg-indigo-600 border-indigo-700 text-white rounded-tr-none"
                }`}>
                  {renderTextWithMath(msg.text)}
                </div>
                <div className={`text-[10px] font-bold text-slate-400 px-1 ${!isAi ? "text-right" : ""}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading/Thinking Bubble placeholder */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] self-start mr-auto">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm animate-pulse">
              🤖
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 shadow-xs rounded-tl-none flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-xs font-bold text-slate-400 ml-1">Thầy AI đang soạn câu trả lời...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion prompt chips - only show when keyboard focus is clear or chat starts */}
      {messages.length === 1 && !isLoading && (
        <div className="space-y-2 mb-4">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block px-1">
            💡 Câu hỏi gợi ý:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s.prompt)}
                className="p-3 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left text-xs font-bold text-slate-600 transition-all shadow-xs flex items-start gap-2"
              >
                <Compass size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message input controls */}
      <div className="bg-white border border-slate-200 p-2.5 rounded-2xl shadow-md flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(inputText);
          }}
          disabled={isLoading}
          placeholder="Hỏi Gia sư AI về cộng trừ Đa thức..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder-slate-400 font-medium"
        />
        <button
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            inputText.trim() && !isLoading 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          <Send size={16} className={inputText.trim() && !isLoading ? "fill-white" : ""} />
        </button>
      </div>

    </div>
  );
}
