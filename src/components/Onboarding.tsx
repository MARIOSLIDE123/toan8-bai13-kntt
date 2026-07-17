import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, LearningRepository } from "../utils/repository";
import { Sparkles, GraduationCap, School, MapPin, Smile, ArrowRight, BookOpen, CheckCircle } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const AVATAR_OPTIONS = [
  { emoji: "🎓", label: "Gia sư tập sự", desc: "Hăng hái và tò mò học hỏi" },
  { emoji: "⚡", label: "Chiến thần Đa thức", desc: "Tinh thần dũng cảm vượt mọi biểu thức" },
  { emoji: "🧠", label: "Thần đồng Số học", desc: "Sử dụng trí thông minh vượt trội" },
  { emoji: "📐", label: "Hình học truyền kỳ", desc: "Chính xác trong từng đường nét" },
  { emoji: "🚀", label: "Nhà phát minh tương lai", desc: "Sáng tạo không biên giới" },
  { emoji: "💎", label: "Cao thủ tính nhẩm", desc: "Tính nhanh, nhạy bén và tự tin" },
];

const PROVINCE_OPTIONS = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "Nghệ An", "Thanh Hóa", "Đồng Nai", "Bình Dương", "Quảng Ninh", "Khác"
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<"welcome" | "form">("welcome");
  
  // Form State
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("8A1");
  const [school, setSchool] = useState("");
  const [province, setProvince] = useState("Hà Nội");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  // Validation States
  const [nameError, setNameError] = useState("");
  const [schoolError, setSchoolError] = useState("");

  const handleValidateForm = () => {
    let isValid = true;
    if (name.trim().length < 2) {
      setNameError("Họ và tên cần dài ít nhất 2 ký tự");
      isValid = false;
    } else {
      setNameError("");
    }

    if (school.trim().length < 3) {
      setSchoolError("Tên trường học cần dài ít nhất 3 ký tự");
      isValid = false;
    } else {
      setSchoolError("");
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidateForm()) return;

    const profile: UserProfile = {
      name: name.trim(),
      classLevel: classLevel.trim(),
      school: school.trim(),
      province,
      avatar: `${selectedAvatar.emoji} ${selectedAvatar.label}`,
      activeTitle: "Học viên tập sự 🎓",
    };

    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden relative">
        {/* Background gradient element */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500" />
        
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-8 sm:p-12 text-center space-y-8"
            >
              {/* Educational illustration */}
              <div className="relative inline-flex items-center justify-center p-8 bg-blue-50 text-blue-600 rounded-full mx-auto">
                <div className="absolute inset-0 bg-blue-100/50 rounded-full animate-ping pointer-events-none" />
                <GraduationCap size={72} className="relative z-10" />
                <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-2 rounded-2xl shadow-md">
                  <Sparkles size={16} />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                  Chào mừng đến với <span className="text-blue-600">TOÁN 8 AI</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                  Hãy nhập thông tin để bắt đầu hành trình học tập Đa thức cực kỳ trực quan, vui vẻ và thú vị của em cùng Thầy AI nhé!
                </p>
              </div>

              {/* Decorative mini cards */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-1">
                  <span className="text-xl">🤖</span>
                  <h3 className="font-extrabold text-xs text-slate-800">Gia sư AI 1:1</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Giải toán từng bước, hướng dẫn thông minh 24/7</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-1">
                  <span className="text-xl">🏆</span>
                  <h3 className="font-extrabold text-xs text-slate-800">Học mà Chơi</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Tích xu, nâng cấp bậc, mở khóa huy chương quý giá</p>
                </div>
              </div>

              <button
                onClick={() => setStep("form")}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-100 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Bắt đầu khám phá</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === "form" && (
            <motion.div
              key="form-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-8 sm:p-10 space-y-6"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-extrabold">BƯỚC 2/2</span>
                  <h2 className="text-lg font-black text-slate-800">Tạo hồ sơ học sinh</h2>
                </div>
                <p className="text-xs text-slate-400 font-semibold">Thông tin này giúp cá nhân hóa bài học và lưu giữ thành tích của em.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full name input */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                    <GraduationCap size={14} className="text-blue-500" /> Họ và tên của em <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim().length >= 2) setNameError("");
                    }}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className={`w-full bg-slate-50 border px-4 py-3 rounded-xl outline-none text-sm text-slate-700 font-bold transition-all focus:bg-white ${
                      nameError ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                    }`}
                  />
                  {nameError && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">⚠️ {nameError}</p>
                  )}
                </div>

                {/* Class and School grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      Lớp học <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-3 rounded-xl outline-none text-sm text-slate-700 font-bold transition-all focus:bg-white focus:border-blue-500 cursor-pointer"
                    >
                      <option value="8A1">Lớp 8A1</option>
                      <option value="8A2">Lớp 8A2</option>
                      <option value="8A3">Lớp 8A3</option>
                      <option value="8B">Lớp 8B</option>
                      <option value="8C">Lớp 8C</option>
                      <option value="Khác">Lớp khác</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                      <School size={14} className="text-purple-500" /> Trường THCS <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={school}
                      onChange={(e) => {
                        setSchool(e.target.value);
                        if (e.target.value.trim().length >= 3) setSchoolError("");
                      }}
                      placeholder="Ví dụ: THCS Chu Văn An"
                      className={`w-full bg-slate-50 border px-4 py-3 rounded-xl outline-none text-sm text-slate-700 font-bold transition-all focus:bg-white ${
                        schoolError ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                      }`}
                    />
                    {schoolError && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">⚠️ {schoolError}</p>
                    )}
                  </div>
                </div>

                {/* City/Province input */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                    <MapPin size={14} className="text-orange-500" /> Tỉnh / Thành phố
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none text-sm text-slate-700 font-bold transition-all focus:bg-white focus:border-blue-500 cursor-pointer"
                  >
                    {PROVINCE_OPTIONS.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                {/* Avatar Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                    <Smile size={14} className="text-pink-500" /> Chọn linh vật đại diện của em
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[170px] overflow-y-auto pr-1">
                    {AVATAR_OPTIONS.map((av) => {
                      const isSelected = selectedAvatar.label === av.label;
                      return (
                        <button
                          key={av.label}
                          type="button"
                          onClick={() => setSelectedAvatar(av)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-blue-50/80 border-blue-400 shadow-sm"
                              : "bg-slate-50/50 border-slate-150 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{av.emoji}</span>
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-[11px] text-slate-800 truncate">{av.label}</h4>
                              <p className="text-[8px] text-slate-400 font-bold leading-none truncate mt-0.5">{av.desc}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep("welcome")}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 font-extrabold text-xs rounded-xl transition-all"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-100 hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <BookOpen size={14} />
                    <span>Lưu hồ sơ & Bắt đầu học</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
