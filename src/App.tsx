import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import TrangChu from "./pages/TrangChu";
import HocBai from "./pages/HocBai";
import Game from "./pages/Game";
import LuyenTap from "./pages/LuyenTap";
import KiemTra from "./pages/KiemTra";
import TroLyAI from "./pages/TroLyAI";
import CaNhan from "./pages/CaNhan";
import Onboarding from "./components/Onboarding";
import { UserStats, Achievement } from "./types";
import { LearningRepository, UserProfile, DailyTask } from "./utils/repository";
import { Sparkles, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Load initial states from Repository Pattern layer
  const [stats, setStats] = useState<UserStats>(() => LearningRepository.getUserStats());
  const [profile, setProfile] = useState<UserProfile | null>(() => LearningRepository.getUserProfile());
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => LearningRepository.getDailyTasks());
  const [activeTab, setActiveTab] = useState<string>("trang-chu");
  
  // Custom rank title and avatar states synced with Profile
  const [activeTitle, setActiveTitle] = useState<string>(() => {
    const p = LearningRepository.getUserProfile();
    return p ? p.activeTitle : "Học viên tập sự 🎓";
  });
  const [activeAvatar, setActiveAvatar] = useState<string>(() => {
    const p = LearningRepository.getUserProfile();
    return p ? p.avatar : "🎓 Gia sư tập sự";
  });
  
  // Levels high score state for the game
  const [gameHighScore, setGameHighScore] = useState<number>(() => LearningRepository.getHighScore());

  // Level up alert state
  const [levelUpAlert, setLevelUpAlert] = useState<boolean>(false);
  const [achievementAlert, setAchievementAlert] = useState<string | null>(null);

  // Sync stats back to repository and update state
  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    LearningRepository.saveUserStats(newStats);
  };

  // State mutator: Award XP & Coins with Level-Up checking!
  const handleAwardXP = (xpGained: number, coinsGained: number) => {
    let newXp = stats.xp + xpGained;
    let newLevel = stats.level;
    let xpNeeded = newLevel * 200;
    let leveledUp = false;

    // Calculate level ups
    while (newXp >= xpNeeded) {
      newXp -= xpNeeded;
      newLevel += 1;
      xpNeeded = newLevel * 200;
      leveledUp = true;
    }

    if (leveledUp) {
      setLevelUpAlert(true);
      setTimeout(() => setLevelUpAlert(false), 3500);
    }

    const updated: UserStats = {
      ...stats,
      xp: newXp,
      level: newLevel,
      coins: stats.coins + coinsGained,
      lastActive: new Date().toISOString()
    };

    saveStats(updated);
  };

  // Increment Daily Task progress cleanly via Repository
  const handleIncrementTask = (type: "practice" | "chat" | "game" | "exam", increment: number) => {
    const nextTasks = LearningRepository.updateDailyTaskProgress(type, increment, (xp, coins) => {
      handleAwardXP(xp, coins);
      setAchievementAlert(`Hoàn thành nhiệm vụ! Nhận +${xp} XP & +${coins} Xu 🪙`);
      setTimeout(() => setAchievementAlert(null), 4000);
    });
    setDailyTasks(nextTasks);
  };

  // Unlock achievement helper
  const unlockAchievement = (id: string) => {
    const isAlreadyUnlocked = stats.achievements.find(a => a.id === id)?.unlocked;
    if (isAlreadyUnlocked) return;

    const updatedAchievements = stats.achievements.map(a => {
      if (a.id === id) {
        setAchievementAlert(a.title);
        setTimeout(() => setAchievementAlert(null), 4000);
        return { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
      }
      return a;
    });

    const updated: UserStats = {
      ...stats,
      achievements: updatedAchievements
    };
    saveStats(updated);
  };

  // State mutator: Complete lessons
  const handleCompleteLesson = (lessonId: string) => {
    if (stats.completedLessons.includes(lessonId)) return;
    
    const updated: UserStats = {
      ...stats,
      completedLessons: [...stats.completedLessons, lessonId]
    };
    saveStats(updated);
    unlockAchievement("first-step");
  };

  // State mutator: Claim Daily Streaks
  const handleClaimDailyStreak = () => {
    const updated: UserStats = {
      ...stats,
      streak: stats.streak + 1,
      coins: stats.coins + 50,
      lastActive: new Date().toISOString()
    };
    saveStats(updated);
    alert("🎉 Điểm danh thành công! Nhận ngay +50 Xu học tập & chúc em học tốt!");
  };

  // State mutator: Buy item from shop
  const handleBuyItem = (itemId: string, cost: number) => {
    const updated: UserStats = {
      ...stats,
      coins: stats.coins - cost,
      inventory: [...stats.inventory, itemId]
    };
    saveStats(updated);
    unlockAchievement("shop-collector");
  };

  // State mutator: Reset everything to starting point
  const handleResetStats = () => {
    const confirmReset = window.confirm("Em có chắc chắn muốn xóa hết thông tin cá nhân, điểm số, cấp độ và danh hiệu để học lại từ đầu không?");
    if (confirmReset) {
      LearningRepository.resetAll();
      setStats(LearningRepository.getUserStats());
      setProfile(null);
      setDailyTasks(LearningRepository.getDailyTasks());
      setActiveTitle("Học viên tập sự 🎓");
      setActiveAvatar("🎓 Gia sư tập sự");
      setGameHighScore(0);
      setActiveTab("trang-chu");
    }
  };

  const handleUpdateHighScore = (score: number) => {
    setGameHighScore(score);
    LearningRepository.saveHighScore(score);
    if (score >= 50) {
      unlockAchievement("game-high");
    }
    // Increment the game task progress
    if (score >= 20) {
      handleIncrementTask("game", score);
    }
  };

  // Handle Complete Onboarding
  const handleCompleteOnboarding = (p: UserProfile) => {
    LearningRepository.saveUserProfile(p);
    setProfile(p);
    setActiveAvatar(p.avatar);
    setActiveTitle(p.activeTitle);
    
    // Welcome gift of 50 coins
    const initialStats = LearningRepository.getUserStats();
    saveStats({
      ...initialStats,
      coins: initialStats.coins + 50,
      lastActive: new Date().toISOString()
    });

    // Sync daily tasks
    setDailyTasks(LearningRepository.getDailyTasks());
  };

  // Synchronize dynamic updates to profile state
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    LearningRepository.saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    setActiveAvatar(updatedProfile.avatar);
    setActiveTitle(updatedProfile.activeTitle);
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans relative">
      
      {/* Onboarding Welcome Setup modal */}
      <AnimatePresence>
        {profile === null && (
          <Onboarding onComplete={handleCompleteOnboarding} />
        )}
      </AnimatePresence>

      {/* Top statistics board */}
      <Header stats={stats} activeAvatar={activeAvatar} onNavigateToProfile={() => setActiveTab("ca-nhan")} />

      {/* Level Up Animated Overlay Dialog */}
      <AnimatePresence>
        {levelUpAlert && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-x-4 top-24 z-50 max-w-sm mx-auto bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-5 text-white shadow-2xl flex items-center gap-4 border border-amber-400"
          >
            <div className="bg-white/20 p-2.5 rounded-2xl">
              <Award size={28} className="text-yellow-300 animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight">LÊN CẤP ĐỘ MỚI! 🎉</h3>
              <p className="text-xs text-amber-50 font-bold">Em đã đạt cấp độ {stats.level}! Nhận ngay quà thăng tiến.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements unlocked Alert */}
      <AnimatePresence>
        {achievementAlert && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-4 bottom-24 z-50 max-w-sm mx-auto bg-slate-900 rounded-3xl p-5 text-white shadow-2xl flex items-center gap-4 border border-slate-800"
          >
            <div className="bg-yellow-500 text-slate-950 p-2.5 rounded-2xl text-xl animate-float">
              🏆
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">HỆ THỐNG THÀNH TÍCH!</h3>
              <p className="text-xs text-slate-400 font-bold">Thông báo: <span className="text-yellow-400">{achievementAlert}</span></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        <AnimatePresence mode="wait">
          {activeTab === "trang-chu" && (
            <TrangChu 
              stats={stats} 
              profile={profile}
              dailyTasks={dailyTasks}
              setActiveTab={setActiveTab} 
              onClaimDailyStreak={handleClaimDailyStreak} 
              onIncrementTask={handleIncrementTask}
            />
          )}

          {activeTab === "hoc-bai" && (
            <HocBai 
              onAwardXP={handleAwardXP} 
              onCompleteLesson={handleCompleteLesson} 
            />
          )}

          {activeTab === "game" && (
            <Game 
              onAwardXP={(xp, coins) => {
                handleAwardXP(xp, coins);
                handleIncrementTask("game", 1);
              }} 
              highScore={gameHighScore} 
              onUpdateHighScore={handleUpdateHighScore} 
            />
          )}

          {activeTab === "luyen-tap" && (
            <LuyenTap 
              onAwardXP={(xp, coins) => {
                handleAwardXP(xp, coins);
                handleIncrementTask("practice", 1);
              }} 
            />
          )}

          {activeTab === "kiem-tra" && (
            <KiemTra 
              onAwardXP={(xp, coins) => {
                handleAwardXP(xp, coins);
                handleIncrementTask("exam", 1);
              }} 
              onAwardBadge={() => unlockAchievement("shield-polynomial")} 
            />
          )}

          {activeTab === "tro-ly-ai" && (
            <TroLyAI onIncrementTask={handleIncrementTask} />
          )}

          {activeTab === "ca-nhan" && (
            <CaNhan 
              stats={stats} 
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onResetStats={handleResetStats} 
              onBuyItem={handleBuyItem} 
              activeAvatar={activeAvatar}
              setActiveAvatar={(av) => {
                setActiveAvatar(av);
                if (profile) handleUpdateProfile({ ...profile, avatar: av });
              }}
              activeTitle={activeTitle}
              setActiveTitle={(title) => {
                setActiveTitle(title);
                if (profile) handleUpdateProfile({ ...profile, activeTitle: title });
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Nav */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  );
}
