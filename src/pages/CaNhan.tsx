import React, { useState } from "react";
import { UserStats } from "../types";
import { UserProfile } from "../utils/repository";
import { User, Shield, Sparkles, Coins, ShoppingBag, Award, Zap, Trash2, RefreshCw, Edit3, Check, MapPin, School, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CaNhanProps {
  stats: UserStats;
  profile: UserProfile | null;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetStats: () => void;
  onBuyItem: (itemId: string, cost: number) => void;
  activeAvatar: string;
  setActiveAvatar: (avatar: string) => void;
  activeTitle: string;
  setActiveTitle: (title: string) => void;
}

export default function CaNhan({ 
  stats, 
  profile,
  onUpdateProfile,
  onResetStats, 
  onBuyItem, 
  activeAvatar, 
  setActiveAvatar, 
  activeTitle, 
  setActiveTitle 
}: CaNhanProps) {
  
  const shopItems = [
    {
      id: "title-master",
      type: "title",
      name: "Bậc thầy Đa thức",
      desc: "Danh hiệu danh giá hiển thị trên trang cá nhân",
      cost: 100,
      reward: "🎓 Bậc thầy Đa thức"
    },
    {
      id: "title-prodigy",
      type: "title",
      name: "Thần đồng Toán học",
      desc: "Danh hiệu đỉnh cao chỉ dành cho học sinh chăm chỉ",
      cost: 300,
      reward: "⚡ Thần đồng Toán học"
    },
    {
      id: "avatar-pythagoras",
      type: "avatar",
      name: "Nhà Toán học Pythagoras",
      desc: "Thay đổi hình đại diện của em thành triết gia cổ đại",
      cost: 150,
      reward: "📐 Pythagoras"
    },
    {
      id: "avatar-newton",
      type: "avatar",
      name: "Nhà Vật lý Newton",
      desc: "Thay đổi hình đại diện thành nhà bác học vĩ đại",
      cost: 250,
      reward: "🍎 Newton"
    }
  ];

  const [purchaseFeedback, setPurchaseFeedback] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState(profile?.name || "");
  const [editClass, setEditClass] = useState(profile?.classLevel || "");
  const [editSchool, setEditSchool] = useState(profile?.school || "");
  const [editProvince, setEditProvince] = useState(profile?.province || "");

  const handlePurchase = (item: typeof shopItems[0]) => {
    if (stats.inventory.includes(item.id)) {
      if (item.type === "title") {
        setActiveTitle(item.reward);
        setPurchaseFeedback(`Đã trang bị danh hiệu: ${item.reward}`);
      } else {
        setActiveAvatar(item.reward);
        setPurchaseFeedback(`Đã đổi ảnh đại diện thành: ${item.reward}`);
      }
      return;
    }

    if (stats.coins < item.cost) {
      setPurchaseFeedback("⚠️ Ôi không! Em chưa đủ số xu tích lũy để mua vật phẩm này.");
      return;
    }

    onBuyItem(item.id, item.cost);
    if (item.type === "title") {
      setActiveTitle(item.reward);
    } else {
      setActiveAvatar(item.reward);
    }
    setPurchaseFeedback(`🎉 Chúc mừng em đã sở hữu và trang bị thành công: ${item.name}!`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editClass.trim() || !editSchool.trim()) {
      alert("Hãy nhập đầy đủ các thông tin bắt buộc.");
      return;
    }

    if (profile) {
      const updated: UserProfile = {
        ...profile,
        name: editName.trim(),
        classLevel: editClass.trim(),
        school: editSchool.trim(),
        province: editProvince.trim(),
      };
      onUpdateProfile(updated);
      setIsEditing(false);
      setPurchaseFeedback("✨ Cập nhật hồ sơ học sinh thành công!");
      setTimeout(() => setPurchaseFeedback(null), 3500);
    }
  };

  const avatarEmoji = activeAvatar ? activeAvatar.split(" ")[0] : "🎓";

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-24">
      
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md text-center space-y-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-90" />
        
        {/* Avatar block */}
        <div className="relative pt-10">
          <div className="w-24 h-24 rounded-full bg-slate-100 border-[6px] border-white mx-auto flex items-center justify-center text-4xl shadow-md">
            {avatarEmoji}
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm mt-3 inline-block">
            {activeTitle}
          </div>
        </div>

        {/* Dynamic indicators */}
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            {profile ? profile.name : "Học sinh Chăm Học"}
          </h2>
          <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5">
            <School size={13} /> {profile ? `${profile.classLevel} • ${profile.school}` : "Trường học chưa đăng ký"}
          </p>
          {profile?.province && (
            <p className="text-[11px] font-semibold text-slate-400 flex items-center justify-center gap-1">
              <MapPin size={11} /> {profile.province}
            </p>
          )}
        </div>

        {/* Edit Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (!isEditing && profile) {
                setEditName(profile.name);
                setEditClass(profile.classLevel);
                setEditSchool(profile.school);
                setEditProvince(profile.province || "");
              }
              setIsEditing(!isEditing);
            }}
            className="px-4 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-black transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            {isEditing ? <Check size={12} /> : <Edit3 size={12} />}
            {isEditing ? "Hủy Chỉnh Sửa" : "Chỉnh Sửa Hồ Sơ"}
          </button>
        </div>

        {/* Inline Editing Form */}
        <AnimatePresence>
          {isEditing && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSaveProfile}
              className="text-left bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4 overflow-hidden"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Lớp *</label>
                  <input
                    type="text"
                    required
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    value={editProvince}
                    onChange={(e) => setEditProvince(e.target.value)}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Trường học *</label>
                <input
                  type="text"
                  required
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check size={14} /> Lưu Thay Đổi Hồ Sơ
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Dynamic metrics bento */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <Zap size={18} className="mx-auto text-orange-500 fill-orange-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mt-1">XP tích lũy</span>
            <span className="font-black text-slate-800 text-base">{stats.xp}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <Coins size={18} className="mx-auto text-yellow-500 fill-yellow-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mt-1">Xu hiện có</span>
            <span className="font-black text-slate-800 text-base">{stats.coins}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <Shield size={18} className="mx-auto text-blue-500 fill-blue-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mt-1">Cấp độ</span>
            <span className="font-black text-slate-800 text-base">{stats.level}</span>
          </div>
        </div>
      </div>

      {/* Cửa hàng tích lũy Coins Shop */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <div className="bg-pink-100 text-pink-700 p-2 rounded-xl">
            <ShoppingBag size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">Cửa hàng tích lũy</h3>
            <p className="text-[10px] text-slate-400 font-bold">Sử dụng Xu học tập đổi trang phục, danh hiệu</p>
          </div>
        </div>

        {/* Purchase notices */}
        {purchaseFeedback && (
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center font-bold text-xs text-slate-700 animate-bounce-slow">
            {purchaseFeedback}
          </div>
        )}

        <div className="space-y-4">
          {shopItems.map((item) => {
            const isOwned = stats.inventory.includes(item.id);
            return (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded-md font-bold text-[9px] uppercase">
                      {item.type === "title" ? "DANH HIỆU" : "ẢNH ĐẠI DIỆN"}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-800">{item.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                </div>

                <button
                  onClick={() => handlePurchase(item)}
                  className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all shrink-0 flex items-center gap-1.5 shadow-xs ${
                    isOwned
                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      : "bg-pink-600 hover:bg-pink-700 text-white"
                  }`}
                >
                  {isOwned ? (
                    "Trang bị"
                  ) : (
                    <>
                      <Coins size={12} className="fill-yellow-300 stroke-yellow-400" />
                      <span>{item.cost} Xu</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced danger resets */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md space-y-4 text-center">
        <h4 className="font-bold text-slate-800 text-sm">Hành động nâng cao</h4>
        <p className="text-xs text-slate-400 font-medium">Bấm vào nút bên dưới để khôi phục trạng thái ban đầu để kiểm thử chương trình học từ đầu.</p>
        <button
          onClick={onResetStats}
          className="mx-auto px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 size={13} /> Reset toàn bộ tiến độ
        </button>
      </div>

    </div>
  );
}
