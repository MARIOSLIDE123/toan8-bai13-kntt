import React, { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, HelpCircle, Star, Sparkles, Check, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MathFormula, { renderTextWithMath } from "../components/MathFormula";

interface HocBaiProps {
  onAwardXP: (xp: number, coins: number) => void;
  onCompleteLesson: (lessonId: string) => void;
}

export default function HocBai({ onAwardXP, onCompleteLesson }: HocBaiProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [interactiveStep, setInteractiveStep] = useState(1); // 1: choose x^2, 2: choose y, 3: completed
  const [selectedX, setSelectedX] = useState<number | null>(null);
  const [selectedY, setSelectedY] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);

  // Slides data
  const slides = [
    {
      title: "1. Khởi động: Tại sao cần Cộng, Trừ Đa thức?",
      concept: "Gom nhóm hoa quả",
      desc: "Hãy tưởng tượng em có một rổ quả gồm 3 quả cam, 2 quả táo. Bạn em cho thêm 2 quả cam và bớt đi 1 quả táo. Em sẽ tính thế nào?\n\nEm gộp cam với cam: $3 + 2 = 5$ quả cam. Táo với táo: $2 - 1 = 1$ quả táo.\n\nTrong Toán học, Đa thức cũng hoạt động y hệt như vậy! Ta chỉ có thể cộng hoặc trừ các HẠNG TỬ ĐỒNG DẠNG (các đơn thức có cùng phần biến).",
      example: "Ví dụ: Hạng tử $3x^2y$ và $-2x^2y$ đồng dạng với nhau vì đều chứa biến $x^2y$. Chúng ta có thể cộng trực tiếp hệ số: $3 + (-2) = 1$ nên $3x^2y + (-2x^2y) = x^2y$."
    },
    {
      title: "2. Quy tắc Cộng hai Đa thức",
      concept: "3 Bước cộng chuẩn chỉnh",
      desc: "Để cộng hai đa thức $A$ và $B$, ta thực hiện các bước sau:\n\n1. Viết phép tính cộng: $A + B = (Đa thức A) + (Đa thức B)$\n2. Bỏ dấu ngoặc (giữ nguyên dấu của các hạng tử bên trong ngoặc).\n3. Nhóm các hạng tử đồng dạng với nhau và thu gọn.",
      example: "Hãy cộng: $A = 3x^2y - 2xy + 5$ và $B = -2x^2y + 4xy - 3$\n\n- Bước 1: $(3x^2y - 2xy + 5) + (-2x^2y + 4xy - 3)$\n- Bước 2: $3x^2y - 2xy + 5 - 2x^2y + 4xy - 3$ (phá ngoặc)\n- Bước 3: $(3x^2y - 2x^2y) + (-2xy + 4xy) + (5 - 3)$\n=> Kết quả: $x^2y + 2xy + 2$"
    },
    {
      title: "3. Quy tắc Trừ hai Đa thức (Cực kỳ chú ý dấu!)",
      concept: "Quy tắc đổi dấu khi phá ngoặc",
      desc: "Để trừ đa thức $B$ cho $A$, ta viết $A - B = (Đa thức A) - (Đa thức B)$.\n\n⚠️ CHÚ Ý: Khi bỏ ngoặc có dấu trừ '-' đằng trước, ta PHẢI ĐỔI DẤU của tất cả các hạng tử bên trong ngoặc: Cộng (+) đổi thành Trừ (-), Trừ (-) đổi thành Cộng (+).",
      example: "Hãy tính: $A - B$ với $A = 3x^2y - 2xy + 5$ và $B = -2x^2y + 4xy - 3$\n\n- Bước 1: $(3x^2y - 2xy + 5) - (-2x^2y + 4xy - 3)$\n- Bước 2: $3x^2y - 2xy + 5 + 2x^2y - 4xy + 3$ (Đã đổi dấu: $-2$ thành $+2$, $+4$ thành $-4$, $-3$ thành $+3$)\n- Bước 3: $(3x^2y + 2x^2y) + (-2xy - 4xy) + (5 + 3)$\n=> Kết quả: $5x^2y - 6xy + 8$"
    },
    {
      title: "4. Trực quan hóa hình học",
      concept: "Cộng diện tích",
      desc: "Phép cộng đa thức có ứng dụng vô cùng thực tế trong việc tính tổng diện tích các mảnh đất khác nhau.\n\nCho mảnh đất thứ nhất có diện tích $S_1 = x^2 + 3x$ ($\\text{m}^2$) và mảnh đất thứ hai kề bên có diện tích $S_2 = 2x^2 + x - 5$ ($\\text{m}^2$).\n\nTổng diện tích hai mảnh đất là:\n$S = S_1 + S_2 = (x^2 + 3x) + (2x^2 + x - 5) = 3x^2 + 4x - 5$ ($\\text{m}^2$).",
      example: "Trực quan: Gộp phần diện tích hình vuông $x^2$ với nhau, gộp phần hành lang $3x$, $x$ với nhau để thu gọn!"
    },
    {
      title: "5. Tương tác: Thử tài thu gọn Đa thức",
      concept: "Thực hành thu gọn",
      desc: "Hãy cùng thu gọn đa thức sau đây:\n$C = 4x^2 - 3y + 2x^2 + 5y$\n\nBằng cách trả lời 2 câu hỏi nhỏ tương tác bên dưới nhé!",
      example: ""
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Submit Interactive Step 1 (x^2 gộp)
  const submitStep1 = (idx: number) => {
    setSelectedX(idx);
    setShowFeedback(true);
    if (idx === 1) { // 6x^2 is correct
      setIsCorrect(true);
      onAwardXP(30, 10);
      setTimeout(() => {
        setInteractiveStep(2);
        setShowFeedback(false);
      }, 1500);
    } else {
      setIsCorrect(false);
    }
  };

  // Submit Interactive Step 2 (y gộp)
  const submitStep2 = (idx: number) => {
    setSelectedY(idx);
    setShowFeedback(true);
    if (idx === 0) { // 2y is correct
      setIsCorrect(true);
      onAwardXP(50, 15);
      setTimeout(() => {
        setInteractiveStep(3);
        setShowFeedback(false);
      }, 1500);
    } else {
      setIsCorrect(false);
    }
  };

  const claimLessonReward = () => {
    if (!hasClaimedReward) {
      onAwardXP(120, 50);
      onCompleteLesson("polynomial-arithmetic");
      setHasClaimedReward(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Back to Home & Slide Progress bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 text-purple-700 p-2 rounded-xl">
            <BookOpen size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-600 block uppercase tracking-wider">Bài học Đa thức</span>
            <h2 className="text-sm font-black text-slate-800">Cộng & Trừ Đa thức</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200/50">
          <span>Slide {currentSlide + 1} / {slides.length}</span>
        </div>
      </div>

      {/* Progress Track bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-purple-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slide Visual Card container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-md space-y-6"
        >
          {/* Slide badge & header */}
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-purple-100/50">
              {slides[currentSlide].concept}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-slate-400">Toán 8 - Bộ Kết nối tri thức</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-snug">
            {slides[currentSlide].title}
          </h3>

          {/* Main content split */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-slate-600 font-medium text-base leading-relaxed">
            <div>{renderTextWithMath(slides[currentSlide].desc)}</div>
          </div>

          {/* Examples Display Box */}
          {slides[currentSlide].example && (
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 flex gap-4">
              <div className="bg-amber-100 text-amber-700 p-2.5 rounded-xl self-start">
                <Sparkles size={18} className="fill-amber-500 stroke-amber-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-800">Minh họa thực tế:</h4>
                <div className="text-sm text-slate-600 leading-relaxed">
                  {renderTextWithMath(slides[currentSlide].example)}
                </div>
              </div>
            </div>
          )}

          {/* Special Interactive Step on the final slide */}
          {currentSlide === 4 && (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
              <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100/50 text-center">
                <h4 className="font-extrabold text-slate-800 text-base">Đa thức gốc:</h4>
                <div className="text-xl font-mono font-black text-purple-700 mt-2 bg-white px-4 py-2 rounded-xl inline-block border border-purple-100 shadow-sm">
                  <MathFormula formula="C = 4x^2 - 3y + 2x^2 + 5y" block={true} />
                </div>
              </div>

              {/* Step 1: Grouping x^2 terms */}
              {interactiveStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                    <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs">1</span>
                    Nhóm và thu gọn các hạng tử đồng dạng chứa $x^2$: <MathFormula formula="(4x^2 + 2x^2) = ?" />
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {["2x^2", "6x^2", "8x^2"].map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => submitStep1(idx)}
                        disabled={showFeedback}
                        className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all text-center flex items-center justify-center ${
                          selectedX === idx 
                            ? idx === 1 
                              ? "bg-emerald-500 border-emerald-600 text-white animate-pulse" 
                              : "bg-red-500 border-red-600 text-white" 
                            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <MathFormula formula={opt} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Grouping y terms */}
              {interactiveStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                    <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs">2</span>
                    Nhóm và thu gọn các hạng tử đồng dạng chứa $y$: <MathFormula formula="(-3y + 5y) = ?" />
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {["2y", "-8y", "8y"].map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => submitStep2(idx)}
                        disabled={showFeedback}
                        className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all text-center flex items-center justify-center ${
                          selectedY === idx 
                            ? idx === 0 
                              ? "bg-emerald-500 border-emerald-600 text-white animate-pulse" 
                              : "bg-red-500 border-red-600 text-white" 
                            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <MathFormula formula={opt} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Reward State */}
              {interactiveStep === 3 && (
                <div className="text-center p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle size={36} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-emerald-800">Hoàn thành bài tập lý thuyết!</h3>
                    <p className="text-sm text-emerald-600 font-bold flex items-center justify-center gap-1 flex-wrap">
                      Em đã gộp chính xác các hạng tử đồng dạng để ra: <MathFormula formula="C = 6x^2 + 2y" />
                    </p>
                  </div>
                  
                  {!hasClaimedReward ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={claimLessonReward}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-xl shadow-md flex items-center gap-2 mx-auto mt-4"
                    >
                      <Sparkles size={16} />
                      Nhận 120 XP & 50 Xu Thưởng!
                    </motion.button>
                  ) : (
                    <div className="text-slate-500 text-xs font-bold bg-slate-100 inline-block px-4 py-1.5 rounded-lg border border-slate-200">
                      🎁 Đã nhận phần thưởng lý thuyết!
                    </div>
                  )}
                </div>
              )}

              {/* Visual feedback notice */}
              {showFeedback && (
                <div className={`p-3 rounded-xl border text-center font-bold text-sm animate-bounce-slow ${
                  isCorrect 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                    : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {isCorrect ? "🎉 Chính xác rồi em ơi! Quá giỏi! (+30 XP)" : "❌ Sai rồi, em kiểm tra kỹ dấu âm và số mũ nhé!"}
                </div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Buttons */}
      <div className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-slate-200/50 shadow-sm">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className={`flex items-center gap-1.5 font-bold text-sm px-4 py-2.5 rounded-xl border transition-colors ${
            currentSlide === 0 
              ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400" 
              : "border-slate-300 hover:bg-slate-50 text-slate-700"
          }`}
        >
          <ChevronLeft size={16} /> Slide trước
        </button>

        <span className="text-xs font-bold text-slate-400">
          Trang {currentSlide + 1} / {slides.length}
        </span>

        {currentSlide < slides.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 font-bold text-sm px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md shadow-purple-200"
          >
            Slide sau <ChevronRight size={16} />
          </button>
        ) : (
          <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
            Hãy hoàn thành Thực hành ở trên!
          </div>
        )}
      </div>

    </div>
  );
}
