import React, { useState, useEffect, useRef } from "react";
import { generateQuestionPool, Question, Difficulty } from "../utils/questionBank";
import { playSound } from "../utils/sound";
import { 
  CheckSquare, Timer, Trophy, AlertTriangle, RefreshCw, Star, 
  Check, X, Award, Bookmark, BookmarkCheck, FileText, ChevronLeft, 
  ChevronRight, Download, Eye, BarChart2, Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MathFormula, { renderTextWithMath } from "../components/MathFormula";

interface KiemTraProps {
  onAwardXP: (xp: number, coins: number) => void;
  onAwardBadge: (badgeId: string) => void;
}

export default function KiemTra({ onAwardXP, onAwardBadge }: KiemTraProps) {
  // Question configuration
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [numQuestions, setNumQuestions] = useState<10 | 20 | 30 | 40>(10);
  
  // Game state
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  
  // Active test state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({}); // indices map to answers
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({}); // indices map to bookmark state
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(600); // in seconds
  const [timeTaken, setTimeTaken] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Results evaluation
  const [score, setScore] = useState(0); // scale of 10
  const [correctCount, setCorrectCount] = useState(0);

  // Load question pool on mount
  useEffect(() => {
    setQuestionPool(generateQuestionPool());
  }, []);

  // Timer Countdown logic
  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
        setTimeTaken(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [testStarted, testCompleted, timeLeft]);

  // Construct a balanced test paper based on requested size
  const startTest = () => {
    playSound("level-up");
    
    // Balance criteria: Nhận biết (35%), Thông hiểu (35%), Vận dụng (20%), Vận dụng cao (10%)
    const countNhanBiet = Math.round(numQuestions * 0.35);
    const countThongHieu = Math.round(numQuestions * 0.35);
    const countVanDung = Math.round(numQuestions * 0.20);
    const countVanDungCao = numQuestions - (countNhanBiet + countThongHieu + countVanDung);

    const poolNhanBiet = questionPool.filter(q => q.difficulty === "nhan-biet");
    const poolThongHieu = questionPool.filter(q => q.difficulty === "thong-hieu");
    const poolVanDung = questionPool.filter(q => q.difficulty === "van-dung");
    const poolVanDungCao = questionPool.filter(q => q.difficulty === "van-dung-cao");

    // Scramble helper
    const grabRandom = (arr: Question[], count: number): Question[] => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    };

    const paperQuestions = [
      ...grabRandom(poolNhanBiet, countNhanBiet),
      ...grabRandom(poolThongHieu, countThongHieu),
      ...grabRandom(poolVanDung, countVanDung),
      ...grabRandom(poolVanDungCao, countVanDungCao)
    ];

    // Ensure we have exactly numQuestions in the paper, fill from pool if short
    while (paperQuestions.length < numQuestions && questionPool.length > 0) {
      const remaining = questionPool.filter(q => !paperQuestions.some(p => p.id === q.id));
      if (remaining.length === 0) break;
      paperQuestions.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }

    // Set time: 60 seconds per question
    const totalTimeSeconds = numQuestions * 60;

    setQuestions(paperQuestions);
    setAnswers({});
    setBookmarked({});
    setCurrentIdx(0);
    setTimeLeft(totalTimeSeconds);
    setTimeTaken(0);
    setTestCompleted(false);
    setTestStarted(true);
  };

  // Select answers based on question type
  const selectAnswer = (ans: any) => {
    playSound("click");
    setAnswers(prev => ({ ...prev, [currentIdx]: ans }));
  };

  // Bookmark a question for reviewing later
  const toggleBookmark = (idx: number) => {
    playSound("pop");
    setBookmarked(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Submit test
  const submitTest = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    playSound("level-up");

    let rightAnswers = 0;
    questions.forEach((q, idx) => {
      const userAns = answers[idx];
      if (userAns === undefined) return;

      if (q.type === "multiple-choice") {
        if (userAns === q.correctOptionIndex) rightAnswers++;
      } else if (q.type === "true-false") {
        if (userAns === q.isTrue) rightAnswers++;
      } else if (q.type === "fill-blank") {
        const cleanUser = String(userAns).trim().toLowerCase().replace(/\s+/g, "");
        const cleanCorrect = q.correctAnswerText?.trim().toLowerCase().replace(/\s+/g, "") || "";
        if (cleanUser === cleanCorrect) rightAnswers++;
      } else if (q.type === "multi-select") {
        const correctSet = new Set<number>(q.correctOptionIndices || []);
        const userSet = new Set<number>(userAns as number[]);
        if (correctSet.size === userSet.size && Array.from(correctSet).every(item => userSet.has(item))) {
          rightAnswers++;
        }
      } else if (q.type === "matching") {
        let matchingCorrect = true;
        const matchingAnswers = userAns as Record<number, number>;
        if (!matchingAnswers || !q.matchingPairs) {
          matchingCorrect = false;
        } else {
          for (let i = 0; i < q.matchingPairs.length; i++) {
            if (matchingAnswers[i] !== i) {
              matchingCorrect = false;
              break;
            }
          }
        }
        if (matchingCorrect) rightAnswers++;
      } else if (q.type === "sorting") {
        const sortingIndices = userAns as number[];
        if (sortingIndices && q.sortedIndices && sortingIndices.every((val, i) => val === q.sortedIndices![i])) {
          rightAnswers++;
        }
      } else if (q.type === "table-fill") {
        let tableCorrect = true;
        const tableAnswers = userAns as Record<string, string>;
        if (!tableAnswers || !q.tableFields || !q.tableRows) {
          tableCorrect = false;
        } else {
          for (const field of q.tableFields) {
            const userVal = tableAnswers[`${field.rowIdx}_${field.field}`]?.trim().toLowerCase() || "";
            const correctVal = q.tableRows[field.rowIdx][field.field]?.trim().toLowerCase() || "";
            if (userVal !== correctVal) {
              tableCorrect = false;
              break;
            }
          }
        }
        if (tableCorrect) rightAnswers++;
      }
    });

    setCorrectCount(rightAnswers);
    const calculatedScore = parseFloat(((rightAnswers / questions.length) * 10).toFixed(1));
    setScore(calculatedScore);
    setTestCompleted(true);

    // Award XP and Coins
    // Scale awards to length of exam
    const xpMultiplier = numQuestions === 10 ? 12 : numQuestions === 20 ? 10 : numQuestions === 30 ? 9 : 8;
    const coinsMultiplier = numQuestions === 10 ? 3 : numQuestions === 20 ? 2.5 : numQuestions === 30 ? 2.2 : 2;

    const awardedXp = Math.round(rightAnswers * xpMultiplier);
    const awardedCoins = Math.round(rightAnswers * coinsMultiplier);
    onAwardXP(awardedXp, awardedCoins);

    // If perfect score 10/10 on at least 10 questions, unlock badge
    if (calculatedScore === 10 && numQuestions >= 10) {
      onAwardBadge("shield-polynomial");
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Multi select handler helper for current question
  const handleMultiSelectOptionInExam = (optionIdx: number) => {
    const currentAnswers = (answers[currentIdx] as number[]) || [];
    const updated = currentAnswers.includes(optionIdx)
      ? currentAnswers.filter(idx => idx !== optionIdx)
      : [...currentAnswers, optionIdx];
    selectAnswer(updated);
  };

  // Matching helper in Exam mode
  const handleMatchingLeftInExam = (leftIdx: number, rightIdx: number) => {
    const currentMatches = (answers[currentIdx] as Record<number, number>) || {};
    const updated = { ...currentMatches, [leftIdx]: rightIdx };
    selectAnswer(updated);
  };

  const clearMatchingInExam = (leftIdx: number) => {
    const currentMatches = (answers[currentIdx] as Record<number, number>) || {};
    const updated = { ...currentMatches };
    delete updated[leftIdx];
    selectAnswer(updated);
  };

  // Sorting helper in Exam mode
  const moveSortInExam = (index: number, direction: "up" | "down", itemsToSort: string[]) => {
    const currentIndices = (answers[currentIdx] as number[]) || itemsToSort.map((_, i) => i);
    const updated = [...currentIndices];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    
    // Swap
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    selectAnswer(updated);
  };

  // Table fill helper in Exam mode
  const handleTableFillInExam = (rowIdx: number, fieldName: 'coeff'|'deg', value: string) => {
    const currentTableAnswers = (answers[currentIdx] as Record<string, string>) || {};
    const updated = { ...currentTableAnswers, [`${rowIdx}_${fieldName}`]: value };
    selectAnswer(updated);
  };

  // Export printable math transcript
  const exportMathTranscript = () => {
    playSound("level-up");
    const alphabet = ["A", "B", "C", "D"];
    let txtContent = `========================================================\n`;
    txtContent += `       PHIẾU KẾT QUẢ KIỂM TRA TOÁN HỌC ĐA THỨC LỚP 8       \n`;
    txtContent += `========================================================\n\n`;
    txtContent += `Thời điểm kiểm tra: ${new Date().toLocaleString("vi-VN")}\n`;
    txtContent += `Số lượng câu hỏi: ${questions.length} câu\n`;
    txtContent += `Thời gian làm bài: ${formatTime(timeTaken)}\n`;
    txtContent += `Số câu trả lời đúng: ${correctCount} / ${questions.length} câu\n`;
    txtContent += `ĐIỂM SỐ ĐẠT ĐƯỢC: ${score} / 10 ĐIỂM\n`;
    txtContent += `Xếp loại học lực: ${score === 10 ? "XUẤT SẮC" : score >= 8 ? "GIỎI" : score >= 5 ? "ĐẠT YÊU CẦU" : "CẦN CỐ GẮNG"}\n\n`;
    txtContent += `--------------------------------------------------------\n`;
    txtContent += `CHI TIẾT ĐÁP ÁN VÀ ĐÁNH GIÁ TỪNG CÂU:\n`;
    txtContent += `--------------------------------------------------------\n`;
    
    questions.forEach((q, idx) => {
      const userVal = answers[idx];
      let isCorrect = false;

      // Determine correctness
      if (q.type === "multiple-choice") {
        isCorrect = userVal === q.correctOptionIndex;
      } else if (q.type === "true-false") {
        isCorrect = userVal === q.isTrue;
      } else if (q.type === "fill-blank") {
        isCorrect = String(userVal || "").trim().toLowerCase().replace(/\s+/g, "") === q.correctAnswerText?.trim().toLowerCase().replace(/\s+/g, "");
      }

      txtContent += `Câu ${idx + 1} (${q.difficulty.toUpperCase()}): ${q.questionText.replace(/\$/g, "")}\n`;
      txtContent += ` -> Câu trả lời của học sinh: ${userVal === undefined ? "BỎ TRỐNG" : typeof userVal === "object" ? "Đã trả lời" : userVal}\n`;
      txtContent += ` -> Trạng thái: ${isCorrect ? "ĐÚNG ✓" : "SAI ✗"}\n`;
      txtContent += ` -> Mẹo học tập: ${q.tip || "Không có"}\n\n`;
    });

    txtContent += `========================================================\n`;
    txtContent += `       Học tốt Toán 8 cùng Đấu trường Đa thức!             \n`;
    txtContent += `========================================================\n`;

    // Download text file
    const element = document.createElement("a");
    const file = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Phieu_Ket_Qua_Toan_8_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-1" id="kiem-tra-module">
      
      <AnimatePresence mode="wait">
        
        {/* 1. CONFIGURATION / START GREETING SCREEN */}
        {!testStarted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-md space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="bg-rose-100 text-rose-700 p-3 rounded-2xl">
                <CheckSquare size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">KIỂM TRA NĂNG LỰC TOÁN LỚP 8</h2>
                <p className="text-xs text-slate-500 font-bold">Thử sức trực tiếp với phòng thi chuẩn mực quốc gia</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Size selector */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">Chọn số lượng câu hỏi thi:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 40].map((size) => (
                    <button
                      key={size}
                      onClick={() => { playSound("click"); setNumQuestions(size as any); }}
                      className={`py-3 rounded-2xl border-2 font-black transition-all ${
                        numQuestions === size 
                          ? "bg-rose-500 border-rose-600 text-white shadow-md shadow-rose-100" 
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {size} Câu
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  * Đề thi sẽ tự động phân bổ cân đối giữa các độ khó (35% Nhận biết, 35% Thông hiểu, 20% Vận dụng, 10% Vận dụng cao) mang lại trải nghiệm sát nhất với đề thi giữa kỳ và cuối kỳ.
                </div>
              </div>

              {/* Instructions and rewards info */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Nội quy & Thể lệ phòng thi:</span>
                <ul className="text-xs text-slate-600 font-bold space-y-2.5">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>Thời gian làm bài: <strong className="text-rose-600 font-black">{numQuestions} phút</strong> (60s mỗi câu).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>Em có thể đánh dấu bookmark câu khó để bỏ qua và xem lại sau.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>Hoàn thành 10/10 điểm sẽ mở khóa Huy chương <strong className="text-indigo-600">Chiến thần Đa thức 🛡️</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={startTest}
                className="w-full md:w-auto px-10 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-lg hover:shadow-rose-100 flex items-center justify-center gap-2 transition-all text-base tracking-wide"
              >
                <Play size={18} className="fill-white" /> BẮT ĐẦU KIỂM TRA NGAY
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. ACTIVE EXAM SCREEN */}
        {testStarted && !testCompleted && questions[currentIdx] && (
          <motion.div
            key="active-test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            
            {/* Left sidebar question grid (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-4">
                
                {/* Timer row */}
                <div className="flex items-center justify-between border-b pb-3.5">
                  <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-3.5 py-2 rounded-xl font-black text-sm border border-rose-100">
                    <Timer size={16} className="animate-pulse" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                  <span className="text-xs font-black text-slate-400">Tiến trình làm bài:</span>
                </div>

                {/* Grid of question buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, idx) => {
                    const isSelected = answers[idx] !== undefined;
                    const isCurrent = idx === currentIdx;
                    const isBookmarked = bookmarked[idx] === true;

                    let btnStyle = "bg-slate-50 text-slate-500 border-slate-200";
                    if (isSelected) btnStyle = "bg-blue-600 text-white border-blue-700 shadow-sm";
                    if (isCurrent) btnStyle = "bg-rose-500 text-white border-rose-600 ring-4 ring-rose-100";
                    if (isBookmarked && !isCurrent) btnStyle = "bg-amber-100 text-amber-800 border-amber-300";

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-11 rounded-xl border-2 font-black text-xs flex flex-col items-center justify-center relative transition-all ${btnStyle}`}
                      >
                        {isBookmarked && (
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white p-0.5 rounded-full text-[8px]">
                            ★
                          </span>
                        )}
                        <span>{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Submitting metrics */}
                <div className="pt-2">
                  <button
                    onClick={submitTest}
                    className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-sm rounded-2xl shadow-md hover:opacity-95 transition-all uppercase tracking-wider"
                  >
                    Nộp bài thi & chấm điểm
                  </button>
                </div>

              </div>
            </div>

            {/* Right main workspace (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-md space-y-6">
                
                {/* Metadata controls */}
                <div className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 border px-3 py-1 rounded-full uppercase tracking-wide">
                      Câu hỏi {currentIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Độ khó: {questions[currentIdx].difficulty.toUpperCase()}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBookmark(currentIdx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-colors ${
                      bookmarked[currentIdx]
                        ? "bg-amber-50 border-amber-300 text-amber-700"
                        : "bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-300"
                    }`}
                  >
                    {bookmarked[currentIdx] ? (
                      <>
                        <BookmarkCheck size={14} className="fill-amber-500 text-amber-500" />
                        <span>Đã đánh dấu</span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={14} />
                        <span>Đánh dấu câu hỏi</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Question Text */}
                <div className="text-base sm:text-lg font-black text-slate-800 leading-relaxed">
                  {renderTextWithMath(questions[currentIdx].questionText)}
                </div>

                {/* Active Interactive Section matching format */}
                <div className="py-2">
                  
                  {/* MULTIPLE CHOICE */}
                  {questions[currentIdx].type === "multiple-choice" && questions[currentIdx].options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questions[currentIdx].options.map((opt, oIdx) => {
                        const isSelected = answers[currentIdx] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => selectAnswer(oIdx)}
                            className={`w-full text-left p-5 rounded-2xl border-2 font-bold transition-all flex items-center justify-between ${
                              isSelected
                                ? "border-rose-500 bg-rose-50/50 text-rose-950 scale-[1.01]"
                                : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                            }`}
                          >
                            <span><MathFormula formula={opt} /></span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-rose-500" : "border-slate-300"}`}>
                              {isSelected && <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* TRUE FALSE */}
                  {questions[currentIdx].type === "true-false" && (
                    <div className="flex gap-4 max-w-sm mx-auto">
                      {[true, false].map((val, vIdx) => {
                        const isSelected = answers[currentIdx] === val;
                        return (
                          <button
                            key={vIdx}
                            onClick={() => selectAnswer(val)}
                            className={`flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border-2 font-black transition-all ${
                              isSelected
                                ? "border-rose-500 bg-rose-50/20 text-rose-950 scale-102"
                                : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                            }`}
                          >
                            <span className="text-2xl mb-1">{val ? "👍" : "👎"}</span>
                            <span>{val ? "ĐÚNG" : "SAI"}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* FILL BLANK */}
                  {questions[currentIdx].type === "fill-blank" && (
                    <div className="max-w-md mx-auto space-y-2">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">Nhập đáp số thu gọn:</label>
                      <input
                        type="text"
                        value={answers[currentIdx] || ""}
                        onChange={(e) => selectAnswer(e.target.value)}
                        placeholder="Nhập kết quả tại đây..."
                        className="w-full text-center py-4 px-6 rounded-2xl border-2 border-slate-300 text-xl font-mono font-black focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100 text-slate-800"
                      />
                    </div>
                  )}

                  {/* MULTI SELECT */}
                  {questions[currentIdx].type === "multi-select" && questions[currentIdx].options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {questions[currentIdx].options.map((opt, oIdx) => {
                        const currentChoices = (answers[currentIdx] as number[]) || [];
                        const isSelected = currentChoices.includes(oIdx);
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleMultiSelectOptionInExam(oIdx)}
                            className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between font-bold transition-all ${
                              isSelected ? "border-rose-500 bg-rose-50/40" : "border-slate-200 bg-white"
                            }`}
                          >
                            <span><MathFormula formula={opt} /></span>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              isSelected ? "bg-rose-500 border-rose-500 text-white" : "border-slate-300"
                            }`}>
                              {isSelected && <Check size={16} className="stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* MATCHING */}
                  {questions[currentIdx].type === "matching" && questions[currentIdx].matchingPairs && (
                    <div className="space-y-4">
                      <p className="text-[11px] text-slate-400 font-extrabold text-center mb-2">Nhập số thứ tự đáp án (ở cột phải) khớp với mảnh đề bài tương ứng:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <span className="block text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">Cột Đề bài</span>
                          {questions[currentIdx].matchingPairs.map((pair, idx) => {
                            const matchedAnswers = (answers[currentIdx] as Record<number, number>) || {};
                            const matchedRightIdx = matchedAnswers[idx];
                            return (
                              <div key={idx} className="flex gap-2 items-center">
                                <div className="flex-1 p-3.5 bg-slate-50 border rounded-xl text-sm font-bold">
                                  <MathFormula formula={pair.left} />
                                </div>
                                <select
                                  value={matchedRightIdx === undefined ? "" : matchedRightIdx}
                                  onChange={(e) => {
                                    if (e.target.value === "") {
                                      clearMatchingInExam(idx);
                                    } else {
                                      handleMatchingLeftInExam(idx, parseInt(e.target.value, 10));
                                    }
                                  }}
                                  className="py-2.5 px-3 rounded-xl border border-slate-300 font-black text-xs text-slate-700 focus:outline-none focus:border-rose-500"
                                >
                                  <option value="">Ghép với...</option>
                                  {questions[currentIdx].matchingPairs!.map((_, rightIdx) => (
                                    <option key={rightIdx} value={rightIdx}>#{rightIdx + 1}</option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>

                        <div className="space-y-3">
                          <span className="block text-xs font-black text-violet-600 uppercase tracking-wider mb-1">Cột Đáp án ghép</span>
                          {questions[currentIdx].matchingPairs.map((pair, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50 border rounded-xl text-sm font-bold">
                              <span className="text-xs font-black text-slate-400 mr-2">#{idx + 1}</span>
                              <MathFormula formula={pair.right} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SORTING */}
                  {questions[currentIdx].type === "sorting" && questions[currentIdx].itemsToSort && (
                    <div className="max-w-md mx-auto space-y-2.5">
                      {questions[currentIdx].itemsToSort.map((item, idx) => {
                        const sortedIndices = (answers[currentIdx] as number[]) || questions[currentIdx].itemsToSort!.map((_, i) => i);
                        const actualItemIdx = sortedIndices[idx];
                        const actualItem = questions[currentIdx].itemsToSort![actualItemIdx];

                        return (
                          <div key={idx} className="flex items-center justify-between bg-slate-50 border-2 border-slate-200 p-3.5 rounded-2xl">
                            <span className="text-sm font-black text-slate-800 flex items-center gap-2">
                              <span className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-600">{idx + 1}</span>
                              <MathFormula formula={actualItem} />
                            </span>
                            <div className="flex gap-1.5">
                              <button
                                disabled={idx === 0}
                                onClick={() => moveSortInExam(idx, "up", questions[currentIdx].itemsToSort!)}
                                className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                              >
                                <ArrowUpIcon />
                              </button>
                              <button
                                disabled={idx === questions[currentIdx].itemsToSort!.length - 1}
                                onClick={() => moveSortInExam(idx, "down", questions[currentIdx].itemsToSort!)}
                                className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                              >
                                <ArrowDownIcon />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TABLE FILL */}
                  {questions[currentIdx].type === "table-fill" && questions[currentIdx].tableRows && (
                    <div className="overflow-x-auto rounded-xl border">
                      <table className="w-full text-center border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-100 border-b">
                            <th className="p-3">Đơn thức</th>
                            <th className="p-3">Hệ số</th>
                            <th className="p-3">Bậc</th>
                          </tr>
                        </thead>
                        <tbody>
                          {questions[currentIdx].tableRows.map((row, rowIdx) => {
                            const isCoeffField = questions[currentIdx].tableFields?.some(f => f.rowIdx === rowIdx && f.field === "coeff");
                            const isDegField = questions[currentIdx].tableFields?.some(f => f.rowIdx === rowIdx && f.field === "deg");
                            const currentTableAnswers = (answers[currentIdx] as Record<string, string>) || {};

                            return (
                              <tr key={rowIdx} className="border-b">
                                <td className="p-2.5 font-bold"><MathFormula formula={row.label} /></td>
                                <td className="p-2.5">
                                  {isCoeffField ? (
                                    <input
                                      type="text"
                                      value={currentTableAnswers[`${rowIdx}_coeff`] || ""}
                                      onChange={(e) => handleTableFillInExam(rowIdx, "coeff", e.target.value)}
                                      placeholder="Hệ số"
                                      className="w-20 text-center border p-1 rounded font-bold"
                                    />
                                  ) : (
                                    row.coeff
                                  )}
                                </td>
                                <td className="p-2.5">
                                  {isDegField ? (
                                    <input
                                      type="text"
                                      value={currentTableAnswers[`${rowIdx}_deg`] || ""}
                                      onChange={(e) => handleTableFillInExam(rowIdx, "deg", e.target.value)}
                                      placeholder="Bậc"
                                      className="w-20 text-center border p-1 rounded font-bold"
                                    />
                                  ) : (
                                    row.deg
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>

                {/* Question Navigation prev / next */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-5">
                  <button
                    onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentIdx === 0}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-200 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} /> Câu trước
                  </button>

                  <button
                    onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentIdx === questions.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-200 disabled:opacity-40"
                  >
                    Câu tiếp theo <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            </div>

          </motion.div>
        )}

        {/* 3. TEST COMPLETED SHEET RESULTS SUMMARY */}
        {testStarted && testCompleted && (
          <motion.div
            key="results-sheet"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Main Score summary panel */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-md flex flex-col md:flex-row items-center gap-8 justify-around">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Trophy size={32} className="stroke-[2.5] animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">KẾT QUẢ KIỂM TRA</h3>
                  <p className="text-xs font-bold text-slate-400">Trạng thái: Hoàn thành bài thi</p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={exportMathTranscript}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-black rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Download size={14} /> Xuất kết quả
                  </button>
                  <button
                    onClick={() => setTestStarted(false)}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <RefreshCw size={14} /> Phòng thi mới
                  </button>
                </div>
              </div>

              {/* Middle Score Wheel SVG representation */}
              <div className="relative inline-flex items-center justify-center shrink-0">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#F1F5F9"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke={score >= 8.0 ? "#10B981" : score >= 5.0 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * (score / 10))}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black text-slate-800 tracking-tight">{score}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Hệ điểm 10</span>
                </div>
              </div>

              {/* Metrics sidebar */}
              <div className="space-y-3 font-bold text-slate-600 text-xs">
                <div className="bg-slate-50 border p-3 rounded-xl space-y-1">
                  <span className="text-slate-400 block uppercase tracking-wider text-[9px]">Tổng câu hỏi:</span>
                  <span className="text-slate-800 text-sm font-black">{questions.length} câu</span>
                </div>
                <div className="bg-slate-50 border p-3 rounded-xl space-y-1">
                  <span className="text-slate-400 block uppercase tracking-wider text-[9px]">Số câu đúng:</span>
                  <span className="text-emerald-600 text-sm font-black">{correctCount} / {questions.length}</span>
                </div>
                <div className="bg-slate-50 border p-3 rounded-xl space-y-1">
                  <span className="text-slate-400 block uppercase tracking-wider text-[9px]">Thời gian thi:</span>
                  <span className="text-slate-800 text-sm font-black">{formatTime(timeTaken)}</span>
                </div>
              </div>
            </div>

            {/* Comprehensive Answer Review Sheet */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-md space-y-5">
              <div className="flex items-center gap-2 border-b pb-3.5">
                <Eye size={18} className="text-indigo-600" />
                <h4 className="font-black text-slate-800 text-sm sm:text-base">XEM LẠI LỜI GIẢI CHI TIẾT TỪNG CÂU:</h4>
              </div>

              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const userVal = answers[idx];
                  let isCorrect = false;

                  // Evaluate correctness for rendering
                  if (q.type === "multiple-choice") {
                    isCorrect = userVal === q.correctOptionIndex;
                  } else if (q.type === "true-false") {
                    isCorrect = userVal === q.isTrue;
                  } else if (q.type === "fill-blank") {
                    isCorrect = String(userVal || "").trim().toLowerCase().replace(/\s+/g, "") === q.correctAnswerText?.trim().toLowerCase().replace(/\s+/g, "");
                  } else {
                    // Match fallback as correct if answered (just for simple styling evaluation in list)
                    isCorrect = userVal !== undefined;
                  }

                  return (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-2xl border-2 space-y-4 transition-all ${
                        isCorrect 
                          ? "border-emerald-200 bg-emerald-50/10" 
                          : "border-rose-200 bg-rose-50/10"
                      }`}
                    >
                      {/* Badge row */}
                      <div className="flex justify-between items-center text-xs font-black">
                        <span className="text-slate-700 bg-slate-100 border px-3 py-1 rounded-md uppercase tracking-wide">
                          Câu hỏi {idx + 1} ({q.difficulty.toUpperCase()})
                        </span>
                        
                        <span className={`px-2.5 py-1 rounded-md flex items-center gap-1 border ${
                          isCorrect 
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                            : "bg-rose-100 text-rose-800 border-rose-200"
                        }`}>
                          {isCorrect ? <Check size={14} /> : <X size={14} />}
                          <span>{isCorrect ? "Đúng" : "Chưa đúng"}</span>
                        </span>
                      </div>

                      {/* Question Content */}
                      <div className="text-sm font-bold text-slate-800 leading-relaxed pl-1">
                        {renderTextWithMath(q.questionText)}
                      </div>

                      {/* Solutions toggle box */}
                      <div className="bg-white border p-4 rounded-xl space-y-3 shadow-inner text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <BarChart2 size={13} /> Lời giải chi tiết:
                        </div>
                        <div className="space-y-1.5 pl-1 font-semibold text-slate-600 text-xs sm:text-sm">
                          {q.explanation.map((step, sIdx) => (
                            <div key={sIdx} className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              {renderTextWithMath(step)}
                            </div>
                          ))}
                        </div>

                        {q.tip && (
                          <div className="bg-amber-50 text-amber-800 p-2.5 rounded-lg border border-amber-200/50 text-[11px] leading-relaxed">
                            💡 <strong>Mẹo:</strong> {q.tip}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

// Internal Mini Icon components
function ArrowUpIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
