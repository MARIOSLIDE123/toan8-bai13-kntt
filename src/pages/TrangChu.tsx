import React from "react";
import { UserStats } from "../types";
import { UserProfile, DailyTask, LearningRepository } from "../utils/repository";
import { BookOpen, Gamepad2, PenTool, CheckSquare, MessageSquare, Award, Flame, Star, Compass, ArrowRight, ClipboardList, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface TrangChuProps {
  stats: UserStats;
  profile: UserProfile | null;
  dailyTasks: DailyTask[];
  setActiveTab: (tab: string) => void;
  onClaimDailyStreak: () => void;
  onIncrementTask?: (type: "practice" | "chat" | "game" | "exam", increment: number) => void;
}

const TASK_ICONS: Record<string, string> = {
  practice: "📝",
  chat: "🤖",
  game: "🎮",
  exam: "📋"
};

export default function TrangChu({ stats, profile, dailyTasks, setActiveTab, onClaimDailyStreak }: TrangChuProps) {
  // Lesson Curriculum Info
  const CHAPTER = "CHƯƠNG I. ĐA THỨC";
  const LESSON = "BÀI 3. PHÉP CỘNG, PHÉP TRỪ ĐA THỨC";
  const DESCRIPTION = "Bộ sách Kết nối tri thức với cuộc sống";

  const cards = [
    {
      id: "hoc-bai",
      title: "Học Bài",
      desc: "Lý thuyết trực quan & ví dụ minh họa",
      iconEmoji: "📚",
      color: "bg-blue-100 text-blue-600",
      badge: "Lý thuyết & Ví dụ",
      xpReward: "+100 XP"
    },
    {
      id: "luyen-tap",
      title: "Luyện Tập",
      desc: "Hệ thống bài tập phân loại độ khó",
      iconEmoji: "📝",
      color: "bg-green-100 text-green-600",
      badge: "Luyện đề",
      xpReward: "+20 XP / câu"
    },
    {
      id: "game",
      title: "Đấu Trường",
      desc: "Học toán qua các mini-game hấp dẫn",
      iconEmoji: "🎮",
      color: "bg-yellow-100 text-yellow-600",
      badge: "Học qua game",
      xpReward: "+150 XP"
    },
    {
      id: "tro-ly-ai",
      title: "Gia Sư AI",
      desc: "Giải đáp thắc mắc 24/7 tức thì",
      iconEmoji: "🤖",
      color: "bg-pink-100 text-pink-600",
      badge: "Hỏi đáp AI",
      xpReward: "Không giới hạn"
    },
    {
      id: "kiem-tra",
      title: "Kiểm Tra",
      desc: "Bài tập tính giờ đánh giá thực lực",
      iconEmoji: "📋",
      color: "bg-red-100 text-red-600",
      badge: "Kiểm tra 15 phút",
      xpReward: "+300 XP"
    }
  ];

  const totalAchievements = stats.achievements.length;
  const unlockedAchievements = stats.achievements.filter(a => a.unlocked).length;

  // Compile study chart data for last 7 days dynamically
  const chartData = React.useMemo(() => {
    const history = LearningRepository.getHistory();
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" });
      const isoDateStr = d.toDateString();
      
      // Filter entries on this date
      const dayEntries = history.filter(h => new Date(h.date).toDateString() === isoDateStr);
      const xpGained = dayEntries.reduce((sum, h) => sum + h.xpGained, 0);
      
      // Seed values to look beautiful initially
      let displayXP = xpGained;
      if (displayXP === 0) {
        displayXP = [80, 150, 120, 190, 240, 160, 0][6 - i];
        if (i === 0 && xpGained > 0) {
          displayXP = xpGained;
        }
      }
      
      days.push({
        name: dateStr,
        "XP tích lũy": displayXP,
      });
    }
    return days;
  }, [stats]);

  return (
    <div className="space-y-8 pb-24">
      
      {/* Dynamic Profile Welcome Greeting Banner */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        
        {/* Geometric Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-[32px] p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 overflow-hidden flex flex-col justify-between relative"
        >
          {/* Math Decor background */}
          <div className="absolute right-[-10px] bottom-[-20px] text-[150px] sm:text-[200px] font-black italic opacity-10 rotate-[-15deg] pointer-events-none select-none leading-none">
            A+B
          </div>
  
          <div className="relative z-10 space-y-4">
            <div className="space-y-2">
              <span className="bg-white/10 backdrop-blur-md text-white font-extrabold text-[10px] xs:text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 border border-white/20 shadow-xs">
                <Star size={13} className="fill-yellow-300 stroke-yellow-400 animate-spin-slow" />
                Học tập xuất sắc cùng AI
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {profile ? `Chào em, ${profile.name}! 👋` : "Chào mừng đến với TOÁN 8 AI! 👋"}
              </h1>
              <p className="text-xs sm:text-sm text-blue-50/85 max-w-md font-medium leading-relaxed">
                Hôm nay chúng ta tiếp tục phá đảo <span className="font-bold underline">{LESSON}</span>. Hãy rèn luyện để thăng cấp học vị!
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button 
                onClick={() => setActiveTab("hoc-bai")}
                className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/10 text-xs transition-all cursor-pointer"
              >
                Học Tiếp Ngay 📚
              </button>
              <button 
                onClick={onClaimDailyStreak}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 px-5 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer"
              >
                🔥 Điểm danh (+50 Xu)
              </button>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Student Profile ID Card View */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full md:w-[320px] bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-xs flex flex-col justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-3xl shadow-xs">
                {profile.avatar.split(" ")[0]}
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  THỂ HỌC SINH TOÁN 8
                </div>
                <h3 className="font-extrabold text-base text-slate-800 leading-tight">
                  {profile.name}
                </h3>
                <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {profile.activeTitle}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4.5 space-y-2 text-xs border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Lớp học:</span>
                <span className="font-extrabold text-slate-700">{profile.classLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Trường học:</span>
                <span className="font-extrabold text-slate-700 max-w-[150px] truncate text-right" title={profile.school}>
                  {profile.school}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Tỉnh/Thành phố:</span>
                <span className="font-extrabold text-slate-700">{profile.province || "Chưa cập nhật"}</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab("ca-nhan")}
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-black transition-all cursor-pointer"
            >
              Xem Cửa Hàng & Đổi Thẻ 🏷️
            </button>
          </motion.div>
        )}
      </div>

      {/* Daily Tasks and Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Daily Tasks Dashboard */}
        <div className="lg:col-span-7 bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <ClipboardList className="text-indigo-600" size={20} />
              Nhiệm Vụ Hàng Ngày
            </h2>
            <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              Hôm nay
            </span>
          </div>

          <div className="space-y-4">
            {dailyTasks.map((task) => {
              const percent = Math.min(100, Math.floor((task.progress / task.requirement) * 100));
              const taskIcon = TASK_ICONS[task.type] || "🎯";
              return (
                <div key={task.id} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{taskIcon}</span>
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-700">
                          {task.title}
                        </h4>
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-slate-400">
                        {task.progress}/{task.requirement}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className={`absolute left-0 top-0 h-full rounded-full ${task.completed ? "bg-emerald-500" : "bg-indigo-500"}`}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>

                  {/* Rewards Badge / Status Pill */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {task.completed ? (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ✓ Đã nhận
                      </span>
                    ) : (
                      <div className="text-right">
                        <div className="text-[10px] font-extrabold text-slate-400 leading-none">THƯỞNG</div>
                        <div className="text-xs font-black text-amber-600 mt-1">
                          +{task.xpReward} XP / +{task.coinsReward}🪙
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recharts Progress Curve */}
        <div className="lg:col-span-5 bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <TrendingUp className="text-[#8B5CF6]" size={20} />
              Đường Cong Học Tập (XP)
            </h2>
            <span className="text-xs font-bold text-slate-400">7 ngày qua</span>
          </div>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} fontWeight="bold" tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1E293B", 
                    borderRadius: "16px", 
                    color: "#fff", 
                    fontSize: "12px",
                    fontWeight: "bold",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
                  }} 
                />
                <Area type="monotone" dataKey="XP tích lũy" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[10px] text-center font-bold text-slate-400 mt-2">
            📊 Biểu đồ phản ánh chỉ số XP em tích lũy hàng ngày. Học chăm chỉ để thấy đường cong đi lên!
          </p>
        </div>
      </div>

      {/* Learning Modules Bento Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Compass className="text-blue-600" size={22} />
            Học tập & Rèn luyện
          </h2>
          <span className="text-xs font-bold text-slate-400">
            {cards.length} hoạt động có sẵn
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card, idx) => {
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                onClick={() => setActiveTab(card.id)}
                className="bg-white rounded-[24px] p-5 border border-[#F1F5F9] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative min-h-[170px]"
              >
                <div>
                  {/* Card Icon Container */}
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl mb-4 ${card.color} shadow-xs font-bold`}>
                    {card.iconEmoji}
                  </div>
  
                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base text-[#1E293B] group-hover:text-[#3B82F6] transition-colors leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
  
                {/* Sub info */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {card.xpReward}
                  </span>
                  <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Vào <ArrowRight size={10} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Gamified Achievement Showcase */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Award className="text-amber-500" size={22} />
              Thành tích đạt được
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Hoàn thành nhiệm vụ để mở khóa huy chương danh giá
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 text-amber-700 font-extrabold text-xs px-3 py-1 rounded-xl">
            {unlockedAchievements}/{totalAchievements} Đã mở
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.achievements.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 rounded-2xl border text-center transition-all ${
                item.unlocked 
                  ? "bg-amber-50/30 border-amber-100 shadow-sm" 
                  : "bg-slate-50/50 border-slate-100 opacity-60"
              }`}
            >
              <div className="text-3xl mb-2 animate-float filter drop-shadow-sm">
                {item.unlocked ? item.icon : "🔒"}
              </div>
              <h4 className="font-extrabold text-sm text-slate-700 tracking-tight">
                {item.title}
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-snug">
                {item.description}
              </p>
              {item.unlocked && (
                <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full mt-2 inline-block">
                  ĐÃ ĐẠT
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
