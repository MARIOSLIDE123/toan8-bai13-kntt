import React from "react";
import { Home, BookOpen, Gamepad2, PenTool, CheckSquare, MessageSquare, User } from "lucide-react";
import { motion } from "motion/react";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: "trang-chu", label: "Trang chủ", icon: Home },
    { id: "hoc-bai", label: "Học bài", icon: BookOpen },
    { id: "game", label: "Game", icon: Gamepad2 },
    { id: "luyen-tap", label: "Luyện tập", icon: PenTool },
    { id: "kiem-tra", label: "Kiểm tra", icon: CheckSquare },
    { id: "tro-ly-ai", label: "Gia sư AI", icon: MessageSquare },
    { id: "ca-nhan", label: "Cá nhân", icon: User },
  ];

  return (
    <nav 
      id="bottom-navigation" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] h-20 px-3 shadow-[0_-4px_16px_rgba(15,23,42,0.02)] sm:relative sm:border-t-0 sm:shadow-none sm:h-auto sm:py-4 sm:bg-[#F8FAFC] sm:px-0 flex items-center justify-around"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-around sm:justify-center sm:gap-4 md:gap-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center gap-1 group flex-1 py-2 rounded-xl transition-all duration-200 select-none cursor-pointer"
            >
              {/* Icon */}
              <div className={`relative z-10 transition-colors duration-200 ${isActive ? "text-[#3B82F6]" : "text-[#94A3B8] group-hover:text-slate-600"}`}>
                <Icon size={22} className={isActive ? "stroke-[2.5]" : "stroke-[2]"} />
              </div>

              {/* Text label */}
              <span className={`relative z-10 text-[11px] font-medium transition-colors duration-200 ${isActive ? "text-[#3B82F6] font-bold" : "text-[#94A3B8] group-hover:text-slate-600"}`}>
                {tab.label}
              </span>

              {/* Minimal dot indicator below active tab */}
              {isActive && (
                <motion.div
                  layoutId="active-dot-indicator"
                  className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#3B82F6]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
