import React from "react";
import { UserStats } from "../types";
import { Award, Zap, Coins, User } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  stats: UserStats;
  activeAvatar?: string;
  onNavigateToProfile: () => void;
}

export default function Header({ stats, activeAvatar, onNavigateToProfile }: HeaderProps) {
  // Calculate percentage of XP to next level (each level requires level * 200 XP)
  const xpNeeded = stats.level * 200;
  const xpPercent = Math.min(100, Math.floor((stats.xp / xpNeeded) * 100));

  // Extract emoji from avatar string, e.g. "🎓 Gia sư tập sự" -> "🎓"
  const avatarEmoji = activeAvatar ? activeAvatar.split(" ")[0] : "🎓";

  return (
    <header id="app-header" className="sticky top-0 z-40 h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between shadow-xs">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Level badge & Chapter progress */}
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-sm border border-[#D97706]/10">
            L{stats.level}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Tiến độ cấp độ
            </span>
            <div className="flex items-center gap-2 mt-1">
              {/* Progress bar background */}
              <div className="w-24 sm:w-36 h-2 bg-[#E2E8F0] rounded-full relative overflow-hidden">
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-[#10B981] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-[10px] font-black text-[#10B981]">{xpPercent}%</span>
            </div>
          </div>
        </div>

        {/* Right: Stats pills & Avatar */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Streak Stat Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F1F5F9] rounded-full text-xs font-bold text-blue-600 border border-slate-100">
            <span>🔥</span>
            <span className="hidden xs:inline">{stats.streak} Ngày</span>
            <span className="xs:hidden">{stats.streak}N</span>
          </div>

          {/* Coins Stat Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F1F5F9] rounded-full text-xs font-bold text-orange-500 border border-slate-100">
            <span>🪙</span>
            <span>{stats.coins}</span>
          </div>

          {/* XP Stat Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F1F5F9] rounded-full text-xs font-bold text-purple-600 border border-slate-100">
            <span>⚡</span>
            <span>{stats.xp} XP</span>
          </div>

          {/* Avatar Profile Trigger */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateToProfile}
            className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center text-lg hover:border-blue-200 transition-colors cursor-pointer"
            title="Trang cá nhân"
          >
            <span className="text-xl">{avatarEmoji}</span>
          </motion.button>
        </div>

      </div>
    </header>
  );
}
