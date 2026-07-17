import React, { useState, useEffect } from "react";
import { generateQuestionPool, Question, Difficulty, QuestionType } from "../utils/questionBank";
import { playSound } from "../utils/sound";
import { 
  PenTool, CheckCircle, AlertTriangle, Sparkles, ChevronRight, 
  Check, X, BookOpen, Lightbulb, Repeat, Award, Filter, ArrowUp, ArrowDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { renderTextWithMath } from "../components/MathFormula";

interface LuyenTapProps {
  onAwardXP: (xp: number, coins: number) => void;
}

export default function LuyenTap({ onAwardXP }: LuyenTapProps) {
  // Question pool and settings
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [historyIds, setHistoryIds] = useState<string[]>([]);
  
  // Filters
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "all">("all");
  const [filterType, setFilterType] = useState<QuestionType | "all">("all");
  
  // Interactive answer states
  const [selectedOption, setSelectedOption] = useState<number | null>(null); // multiple-choice
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]); // multi-select
  const [isTrueSelected, setIsTrueSelected] = useState<boolean | null>(null); // true-false
  const [blankAnswer, setBlankAnswer] = useState<string>(""); // fill-blank
  
  // Matching states
  const [matchingLeftSelected, setMatchingLeftSelected] = useState<number | null>(null);
  const [currentMatches, setCurrentMatches] = useState<Record<number, number>>({}); // maps left index to right index
  
  // Sorting states
  const [sortingItems, setSortingItems] = useState<string[]>([]);
  const [sortingIndices, setSortingIndices] = useState<number[]>([]); // original index tracker
  
  // Table completion states
  const [tableAnswers, setTableAnswers] = useState<Record<string, string>>({}); // keys like "rowIdx_field"

  // Common submission states
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);

  // Initialize pool
  useEffect(() => {
    const pool = generateQuestionPool();
    setQuestionPool(pool);
  }, []);

  // Set initial question when pool is ready
  useEffect(() => {
    if (questionPool.length > 0 && !currentQuestion) {
      loadNextQuestion(true);
    }
  }, [questionPool]);

  // Handle changing filters
  useEffect(() => {
    if (questionPool.length > 0) {
      loadNextQuestion(true);
    }
  }, [filterDifficulty, filterType]);

  const loadNextQuestion = (resetHistory = false) => {
    let filtered = questionPool;
    
    if (filterDifficulty !== "all") {
      filtered = filtered.filter(q => q.difficulty === filterDifficulty);
    }
    if (filterType !== "all") {
      filtered = filtered.filter(q => q.type === filterType);
    }

    if (filtered.length === 0) {
      setCurrentQuestion(null);
      return;
    }

    let nextQuestion: Question;
    let newHistory = resetHistory ? [] : [...historyIds];

    // Find a question not in history
    const unused = filtered.filter(q => !newHistory.includes(q.id));
    if (unused.length > 0) {
      nextQuestion = unused[Math.floor(Math.random() * unused.length)];
      newHistory.push(nextQuestion.id);
    } else {
      // Loop back if all are used
      nextQuestion = filtered[Math.floor(Math.random() * filtered.length)];
      newHistory = [nextQuestion.id];
    }

    setHistoryIds(newHistory);
    setCurrentQuestion(nextQuestion);
    
    // Reset answers
    setSelectedOption(null);
    setSelectedOptions([]);
    setIsTrueSelected(null);
    setBlankAnswer("");
    setMatchingLeftSelected(null);
    setCurrentMatches({});
    setHasSubmitted(false);
    setIsCorrect(false);

    // Set sorting state if sorting type
    if (nextQuestion.type === "sorting" && nextQuestion.itemsToSort) {
      // Shuffle sorting items
      const items = [...nextQuestion.itemsToSort];
      const indices = items.map((_, idx) => idx);
      
      // Keep shuffling until it's not in the correct order
      let shuffled = false;
      while (!shuffled) {
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        // check if match sortedIndices
        const isCorrectOrder = indices.every((val, idx) => val === (nextQuestion.sortedIndices?.[idx] ?? idx));
        if (!isCorrectOrder || indices.length <= 1) {
          shuffled = true;
        }
      }

      setSortingIndices(indices);
      setSortingItems(indices.map(idx => items[idx]));
    }

    // Set table fill inputs
    if (nextQuestion.type === "table-fill" && nextQuestion.tableFields) {
      const answers: Record<string, string> = {};
      nextQuestion.tableFields.forEach(field => {
        answers[`${field.rowIdx}_${field.field}`] = "";
      });
      setTableAnswers(answers);
    }
  };

  // Helper matching state
  const handleMatchingLeftClick = (leftIdx: number) => {
    if (hasSubmitted) return;
    playSound("click");
    setMatchingLeftSelected(leftIdx);
  };

  const handleMatchingRightClick = (rightIdx: number) => {
    if (hasSubmitted || matchingLeftSelected === null) return;
    playSound("pop");
    
    // Add match
    setCurrentMatches(prev => {
      const updated = { ...prev };
      // Remove any prior match with this right side
      Object.keys(updated).forEach(k => {
        if (updated[parseInt(k, 10)] === rightIdx) {
          delete updated[parseInt(k, 10)];
        }
      });
      updated[matchingLeftSelected] = rightIdx;
      return updated;
    });
    setMatchingLeftSelected(null);
  };

  const clearMatch = (leftIdx: number) => {
    if (hasSubmitted) return;
    playSound("click");
    setCurrentMatches(prev => {
      const updated = { ...prev };
      delete updated[leftIdx];
      return updated;
    });
  };

  // Move sorting item up/down
  const moveSortItem = (index: number, direction: "up" | "down") => {
    if (hasSubmitted) return;
    playSound("click");
    
    const newIndices = [...sortingIndices];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    
    if (targetIdx < 0 || targetIdx >= newIndices.length) return;
    
    // Swap
    const temp = newIndices[index];
    newIndices[index] = newIndices[targetIdx];
    newIndices[targetIdx] = temp;
    
    setSortingIndices(newIndices);
    if (currentQuestion?.itemsToSort) {
      setSortingItems(newIndices.map(idx => currentQuestion.itemsToSort![idx]));
    }
  };

  // Toggle multi select options
  const toggleMultiSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    playSound("click");
    setSelectedOptions(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const checkAnswer = () => {
    if (!currentQuestion || hasSubmitted) return;

    let isAnsCorrect = false;

    switch (currentQuestion.type) {
      case "multiple-choice":
        isAnsCorrect = selectedOption === currentQuestion.correctOptionIndex;
        break;

      case "true-false":
        isAnsCorrect = isTrueSelected === currentQuestion.isTrue;
        break;

      case "fill-blank": {
        const cleanAnswer = blankAnswer.trim().toLowerCase().replace(/\s+/g, "");
        const cleanCorrect = currentQuestion.correctAnswerText?.trim().toLowerCase().replace(/\s+/g, "") || "";
        isAnsCorrect = cleanAnswer === cleanCorrect;
        break;
      }

      case "multi-select": {
        const correctSet = new Set(currentQuestion.correctOptionIndices || []);
        const selectedSet = new Set(selectedOptions);
        
        if (correctSet.size !== selectedSet.size) {
          isAnsCorrect = false;
        } else {
          isAnsCorrect = [...correctSet].every(idx => selectedSet.has(idx));
        }
        break;
      }

      case "matching": {
        // Must match all correctly
        if (!currentQuestion.matchingPairs) {
          isAnsCorrect = false;
          break;
        }
        
        isAnsCorrect = true;
        // Verify left index matches the correct right index
        // Correct is sorted same in matchingPairs, left side matches right side at same index
        for (let i = 0; i < currentQuestion.matchingPairs.length; i++) {
          if (currentMatches[i] !== i) {
            isAnsCorrect = false;
            break;
          }
        }
        break;
      }

      case "sorting": {
        if (!currentQuestion.sortedIndices) {
          isAnsCorrect = false;
          break;
        }
        // Compare sortingIndices with sortedIndices
        isAnsCorrect = sortingIndices.every(
          (val, idx) => val === currentQuestion.sortedIndices![idx]
        );
        break;
      }

      case "table-fill": {
        if (!currentQuestion.tableRows || !currentQuestion.tableFields) {
          isAnsCorrect = false;
          break;
        }
        isAnsCorrect = true;
        for (const field of currentQuestion.tableFields) {
          const userVal = tableAnswers[`${field.rowIdx}_${field.field}`]?.trim().toLowerCase() || "";
          const row = currentQuestion.tableRows[field.rowIdx];
          const correctVal = row[field.field]?.trim().toLowerCase() || "";
          if (userVal !== correctVal) {
            isAnsCorrect = false;
            break;
          }
        }
        break;
      }
    }

    setIsCorrect(isAnsCorrect);
    setHasSubmitted(true);

    if (isAnsCorrect) {
      playSound("correct");
      
      // Determine XP & Coins award based on difficulty
      let baseXP = 15;
      let baseCoins = 5;
      if (currentQuestion.difficulty === "thong-hieu") { baseXP = 25; baseCoins = 10; }
      else if (currentQuestion.difficulty === "van-dung") { baseXP = 35; baseCoins = 15; }
      else if (currentQuestion.difficulty === "van-dung-cao") { baseXP = 50; baseCoins = 25; }

      const streakBonusXP = Math.min(20, correctStreak * 5); // +5 XP bonus per streak up to 20 XP
      onAwardXP(baseXP + streakBonusXP, baseCoins);
      setCorrectStreak(s => s + 1);
    } else {
      playSound("incorrect");
      setCorrectStreak(0);
    }
  };

  const getDifficultyLabel = (diff: Difficulty) => {
    switch (diff) {
      case "nhan-biet": return { text: "Nhận biết", color: "bg-blue-50 text-blue-700 border-blue-200" };
      case "thong-hieu": return { text: "Thông hiểu", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "van-dung": return { text: "Vận dụng", color: "bg-orange-50 text-orange-700 border-orange-200" };
      case "van-dung-cao": return { text: "Vận dụng cao", color: "bg-rose-50 text-rose-700 border-rose-200" };
    }
  };

  const getTypeLabel = (t: QuestionType) => {
    switch (t) {
      case "multiple-choice": return "Trắc nghiệm";
      case "true-false": return "Đúng/Sai";
      case "fill-blank": return "Điền khuyết";
      case "matching": return "Ghép cặp";
      case "sorting": return "Sắp xếp";
      case "table-fill": return "Điền bảng";
      case "multi-select": return "Nhiều đáp án";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-1" id="luyen-tap-module">
      
      {/* Header filter controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 text-indigo-700 p-3 rounded-2xl">
            <PenTool size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">LUYỆN TẬP TOÁN LỚP 8</h2>
            <p className="text-xs text-slate-500 font-bold">Rèn luyện tư duy với hàng trăm bài tập bám sát SGK</p>
          </div>
        </div>

        {/* Streak & filter button layout */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {correctStreak > 0 && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              className="flex items-center gap-1.5 bg-amber-500 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md"
            >
              <Sparkles size={14} className="fill-white" />
              <span>Chuỗi đúng: {correctStreak} 🔥</span>
            </motion.div>
          )}

          <div className="flex items-center gap-2 text-slate-400 text-xs font-black">
            <Filter size={14} />
            <span>Bộ lọc:</span>
          </div>
        </div>
      </div>

      {/* Filters selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-100 p-2.5 rounded-2xl border border-slate-200/40">
        <div className="col-span-1">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 px-1">Độ khó</label>
          <select 
            value={filterDifficulty} 
            onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | "all")}
            className="w-full text-xs font-extrabold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả độ khó</option>
            <option value="nhan-biet">Nhận biết</option>
            <option value="thong-hieu">Thông hiểu</option>
            <option value="van-dung">Vận dụng</option>
            <option value="van-dung-cao">Vận dụng cao</option>
          </select>
        </div>

        <div className="col-span-1">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1 px-1">Dạng câu hỏi</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as QuestionType | "all")}
            className="w-full text-xs font-extrabold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả dạng</option>
            <option value="multiple-choice">Trắc nghiệm</option>
            <option value="true-false">Đúng / Sai</option>
            <option value="fill-blank">Điền khuyết</option>
            <option value="matching">Ghép cặp</option>
            <option value="sorting">Sắp xếp</option>
            <option value="table-fill">Điền bảng</option>
            <option value="multi-select">Nhiều đáp án</option>
          </select>
        </div>

        <div className="col-span-2 flex items-end">
          <button 
            onClick={() => loadNextQuestion()}
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Repeat size={14} />
            Đổi câu hỏi ngẫu nhiên
          </button>
        </div>
      </div>

      {/* Main Question view */}
      <AnimatePresence mode="wait">
        {currentQuestion ? (
          <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-md space-y-6"
          >
            
            {/* Metadata bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex gap-2">
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${getDifficultyLabel(currentQuestion.difficulty).color}`}>
                  {getDifficultyLabel(currentQuestion.difficulty).text}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/40">
                  {getTypeLabel(currentQuestion.type)}
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                Kết nối tri thức SGK
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <div className="text-lg font-black text-slate-800 leading-relaxed leading-snug">
                {renderTextWithMath(currentQuestion.questionText)}
              </div>
            </div>

            {/* Interactive Answer Input Section depending on type */}
            <div className="py-2">
              
              {/* 1. MULTIPLE CHOICE */}
              {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectOption = idx === currentQuestion.correctOptionIndex;
                    
                    let cardBorder = "border-slate-200 hover:border-indigo-400";
                    let cardBg = "bg-white";
                    let textStyle = "text-slate-700";

                    if (isSelected) {
                      cardBorder = "border-indigo-600 scale-[1.01]";
                      cardBg = "bg-indigo-50/50";
                      textStyle = "text-indigo-900";
                    }

                    if (hasSubmitted) {
                      if (isCorrectOption) {
                        cardBorder = "border-emerald-500";
                        cardBg = "bg-emerald-50/40";
                        textStyle = "text-emerald-900";
                      } else if (isSelected) {
                        cardBorder = "border-rose-500";
                        cardBg = "bg-rose-50/40";
                        textStyle = "text-rose-900";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasSubmitted}
                        onClick={() => { playSound("click"); setSelectedOption(idx); }}
                        className={`w-full text-left p-5 rounded-2xl border-2 shadow-xs font-bold transition-all flex items-center justify-between ${cardBorder} ${cardBg}`}
                      >
                        <span className={`text-base ${textStyle}`}>
                          {renderTextWithMath(opt)}
                        </span>
                        
                        <div className="shrink-0 ml-3">
                          {hasSubmitted && isCorrectOption && <CheckCircle size={22} className="text-emerald-500 fill-emerald-100" />}
                          {hasSubmitted && isSelected && !isCorrectOption && <X size={22} className="text-rose-500" />}
                          {!hasSubmitted && (
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-indigo-600" : "border-slate-300"}`}>
                              {isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. TRUE-FALSE */}
              {currentQuestion.type === "true-false" && (
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  {[true, false].map((val, idx) => {
                    const isSelected = isTrueSelected === val;
                    const isCorrectChoice = val === currentQuestion.isTrue;
                    
                    let cardStyle = "border-slate-200 hover:border-slate-300 bg-white";
                    if (isSelected) {
                      cardStyle = val ? "border-emerald-600 bg-emerald-50/20 text-emerald-900" : "border-rose-600 bg-rose-50/20 text-rose-900";
                    }
                    if (hasSubmitted) {
                      if (isCorrectChoice) {
                        cardStyle = "border-emerald-500 bg-emerald-100/30 text-emerald-900";
                      } else if (isSelected) {
                        cardStyle = "border-rose-500 bg-rose-100/30 text-rose-900";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasSubmitted}
                        onClick={() => { playSound("click"); setIsTrueSelected(val); }}
                        className={`flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border-2 font-black text-lg shadow-sm transition-all ${cardStyle}`}
                      >
                        <span className="text-3xl mb-2">{val ? "👍" : "👎"}</span>
                        <span>{val ? "ĐÚNG" : "SAI"}</span>
                        {hasSubmitted && isCorrectChoice && <span className="text-[10px] uppercase font-black text-emerald-600 mt-2">✓ Đáp án đúng</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. FILL-IN-THE-BLANK */}
              {currentQuestion.type === "fill-blank" && (
                <div className="max-w-md mx-auto space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">Nhập kết quả hoặc số thích hợp:</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={hasSubmitted}
                      value={blankAnswer}
                      onChange={(e) => setBlankAnswer(e.target.value)}
                      placeholder="Ví dụ: 12, -3x, 5/2..."
                      className={`w-full text-center py-4 px-6 rounded-2xl border-2 text-xl font-mono font-black focus:outline-none focus:ring-4 transition-all ${
                        hasSubmitted 
                          ? isCorrect 
                            ? "border-emerald-500 bg-emerald-50/20 text-emerald-900" 
                            : "border-rose-500 bg-rose-50/20 text-rose-900"
                          : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 text-slate-800"
                      }`}
                    />
                    {hasSubmitted && (
                      <div className="absolute top-1/2 right-4 -translate-y-1/2">
                        {isCorrect ? <Check size={28} className="text-emerald-500 stroke-[3]" /> : <X size={28} className="text-rose-500 stroke-[3]" />}
                      </div>
                    )}
                  </div>
                  {hasSubmitted && !isCorrect && (
                    <div className="text-xs text-rose-600 font-extrabold text-center">
                      Đáp án đúng là: <span className="bg-rose-100 px-2 py-0.5 rounded-md font-mono text-sm">{currentQuestion.correctAnswerText}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 4. MULTI-SELECT */}
              {currentQuestion.type === "multi-select" && currentQuestion.options && (
                <div className="space-y-3">
                  <div className="text-xs font-extrabold text-slate-400 mb-2">Chọn một hoặc nhiều đáp án thỏa mãn:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOptions.includes(idx);
                      const isCorrectChoice = currentQuestion.correctOptionIndices?.includes(idx);
                      
                      let cardStyle = "border-slate-200 hover:border-slate-300 bg-white";
                      if (isSelected) cardStyle = "border-indigo-500 bg-indigo-50/40";
                      if (hasSubmitted) {
                        if (isCorrectChoice) {
                          cardStyle = "border-emerald-500 bg-emerald-50/30";
                        } else if (isSelected) {
                          cardStyle = "border-rose-500 bg-rose-50/30";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={hasSubmitted}
                          onClick={() => toggleMultiSelectOption(idx)}
                          className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between font-bold transition-all ${cardStyle}`}
                        >
                          <span>{renderTextWithMath(opt)}</span>
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                          }`}>
                            {isSelected && <Check size={16} className="stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. MATCHING */}
              {currentQuestion.type === "matching" && currentQuestion.matchingPairs && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-extrabold text-center mb-3">
                    Nhấp vào một mảnh ở bên trái, sau đó chọn mảnh tương ứng bên phải để ghép đôi!
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Items Column */}
                    <div className="space-y-3">
                      <span className="block text-xs font-black text-indigo-600 text-center uppercase tracking-wider mb-1">Mảnh câu hỏi (Trái)</span>
                      {currentQuestion.matchingPairs.map((pair, idx) => {
                        const isSelected = matchingLeftSelected === idx;
                        const isMatched = currentMatches[idx] !== undefined;
                        const rightMatchIdx = currentMatches[idx];
                        const isMatchCorrect = rightMatchIdx === idx; // in data, left[idx] matches right[idx]
                        
                        let style = "border-slate-200 hover:border-indigo-300 bg-white";
                        if (isSelected) style = "border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/50";
                        if (isMatched) style = "border-slate-300 bg-slate-50 text-slate-600";
                        if (hasSubmitted) {
                          style = isMatchCorrect ? "border-emerald-500 bg-emerald-50/20 text-emerald-800" : "border-rose-500 bg-rose-50/20 text-rose-800";
                        }

                        return (
                          <div key={idx} className="flex gap-2 items-center">
                            <button
                              disabled={hasSubmitted}
                              onClick={() => handleMatchingLeftClick(idx)}
                              className={`flex-1 text-left p-4 rounded-xl border-2 font-bold shadow-xs text-sm transition-all ${style}`}
                            >
                              {renderTextWithMath(pair.left)}
                            </button>
                            
                            {/* Connection Indicator badge */}
                            {isMatched && (
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-md font-bold">
                                  ➜ #{rightMatchIdx + 1}
                                </span>
                                {!hasSubmitted && (
                                  <button 
                                    onClick={() => clearMatch(idx)}
                                    className="p-1 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded-lg"
                                    title="Xóa ghép đôi"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Items Column */}
                    <div className="space-y-3">
                      <span className="block text-xs font-black text-violet-600 text-center uppercase tracking-wider mb-1">Mảnh đáp án (Phải)</span>
                      {/* Scrambled but we map statically based on index */}
                      {currentQuestion.matchingPairs.map((pair, idx) => {
                        // Let's check which left item has matched to this right item
                        let matchedLeftIdx: number | null = null;
                        Object.entries(currentMatches).forEach(([leftK, rightV]) => {
                          if (rightV === idx) {
                            matchedLeftIdx = parseInt(leftK, 10);
                          }
                        });

                        const isMatched = matchedLeftIdx !== null;
                        const isSelectedTarget = matchingLeftSelected !== null;
                        
                        let style = "border-slate-200 bg-white hover:border-violet-300";
                        if (isMatched) style = "border-violet-400 bg-violet-50/10 text-slate-600";
                        if (isSelectedTarget) style = "border-dashed border-violet-400 hover:border-violet-600 bg-violet-50/10 cursor-pointer animate-pulse";
                        if (hasSubmitted) {
                          const isCorrectMatch = matchedLeftIdx === idx;
                          style = isCorrectMatch ? "border-emerald-500 bg-emerald-50/10 text-emerald-800" : "border-rose-500 bg-rose-50/10 text-rose-800";
                        }

                        return (
                          <button
                            key={idx}
                            disabled={hasSubmitted || !isSelectedTarget}
                            onClick={() => handleMatchingRightClick(idx)}
                            className={`w-full text-left p-4 rounded-xl border-2 font-bold shadow-xs text-sm transition-all flex items-center justify-between ${style}`}
                          >
                            <span>
                              <span className="text-xs font-black text-slate-400 mr-2">#{idx + 1}</span>
                              {renderTextWithMath(pair.right)}
                            </span>
                            {isMatched && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black border">Đã chọn</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. SORTING */}
              {currentQuestion.type === "sorting" && (
                <div className="max-w-md mx-auto space-y-3">
                  <p className="text-xs text-slate-500 font-bold text-center mb-3">
                    Sử dụng các nút mũi tên để di chuyển các mảnh ghép theo thứ tự yêu cầu từ trên xuống dưới.
                  </p>
                  
                  <div className="space-y-2.5">
                    {sortingItems.map((item, idx) => {
                      return (
                        <div 
                          key={idx} 
                          className="flex items-center gap-3 bg-slate-50 border-2 border-slate-200/80 p-3.5 rounded-2xl shadow-xs justify-between"
                        >
                          <div className="flex items-center gap-3 font-extrabold text-slate-600">
                            <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-700">
                              {idx + 1}
                            </span>
                            <span className="text-base font-bold text-slate-800">{renderTextWithMath(item)}</span>
                          </div>

                          {/* Control arrows */}
                          <div className="flex items-center gap-1.5">
                            <button
                              disabled={idx === 0 || hasSubmitted}
                              onClick={() => moveSortItem(idx, "up")}
                              className={`p-2 rounded-xl border transition-colors ${
                                idx === 0 || hasSubmitted 
                                  ? "text-slate-300 border-slate-100 cursor-not-allowed" 
                                  : "text-slate-600 border-slate-300 hover:bg-slate-100"
                              }`}
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button
                              disabled={idx === sortingItems.length - 1 || hasSubmitted}
                              onClick={() => moveSortItem(idx, "down")}
                              className={`p-2 rounded-xl border transition-colors ${
                                idx === sortingItems.length - 1 || hasSubmitted 
                                  ? "text-slate-300 border-slate-100 cursor-not-allowed" 
                                  : "text-slate-600 border-slate-300 hover:bg-slate-100"
                              }`}
                            >
                              <ArrowDown size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {hasSubmitted && !isCorrect && (
                    <div className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 font-extrabold text-center mt-3">
                      ⚠️ Sắp xếp đúng: <span className="font-mono text-sm">{currentQuestion.itemsToSort?.map((_, idx) => {
                        const originalIdx = currentQuestion.sortedIndices?.[idx] ?? idx;
                        return currentQuestion.itemsToSort![originalIdx];
                      }).join(" ➜ ")}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 7. TABLE FILL */}
              {currentQuestion.type === "table-fill" && currentQuestion.tableRows && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-bold text-center">
                    Điền các giá trị chính xác vào các ô trống trong bảng dưới đây:
                  </p>
                  
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 text-xs font-black border-b border-slate-200">
                          <th className="p-3.5 border-r border-slate-200">Đơn thức</th>
                          <th className="p-3.5 border-r border-slate-200">Hệ số</th>
                          <th className="p-3.5">Bậc</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentQuestion.tableRows.map((row, rowIdx) => {
                          const isCoeffField = currentQuestion.tableFields?.some(
                            f => f.rowIdx === rowIdx && f.field === "coeff"
                          );
                          const isDegField = currentQuestion.tableFields?.some(
                            f => f.rowIdx === rowIdx && f.field === "deg"
                          );

                          return (
                            <tr key={rowIdx} className="border-b border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50">
                              <td className="p-3 border-r border-slate-200 bg-slate-50 text-slate-800 font-black">
                                {renderTextWithMath(row.label)}
                              </td>
                              
                              <td className="p-3 border-r border-slate-200">
                                {isCoeffField ? (
                                  <input
                                    type="text"
                                    disabled={hasSubmitted}
                                    value={tableAnswers[`${rowIdx}_coeff`] || ""}
                                    onChange={(e) => setTableAnswers(prev => ({
                                      ...prev,
                                      [`${rowIdx}_coeff`]: e.target.value
                                    }))}
                                    placeholder="Hệ số"
                                    className={`w-20 text-center py-1.5 px-2 font-mono text-sm font-extrabold border-2 rounded-lg focus:outline-none focus:border-indigo-500 transition-all ${
                                      hasSubmitted
                                        ? tableAnswers[`${rowIdx}_coeff`]?.trim().toLowerCase() === row.coeff.trim().toLowerCase()
                                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                          : "border-rose-500 bg-rose-50 text-rose-800"
                                        : "border-slate-300"
                                    }`}
                                  />
                                ) : (
                                  row.coeff
                                )}
                              </td>

                              <td className="p-3">
                                {isDegField ? (
                                  <input
                                    type="text"
                                    disabled={hasSubmitted}
                                    value={tableAnswers[`${rowIdx}_deg`] || ""}
                                    onChange={(e) => setTableAnswers(prev => ({
                                      ...prev,
                                      [`${rowIdx}_deg`]: e.target.value
                                    }))}
                                    placeholder="Bậc"
                                    className={`w-20 text-center py-1.5 px-2 font-mono text-sm font-extrabold border-2 rounded-lg focus:outline-none focus:border-indigo-500 transition-all ${
                                      hasSubmitted
                                        ? tableAnswers[`${rowIdx}_deg`]?.trim().toLowerCase() === row.deg.trim().toLowerCase()
                                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                          : "border-rose-500 bg-rose-50 text-rose-800"
                                        : "border-slate-300"
                                    }`}
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

                  {hasSubmitted && !isCorrect && (
                    <div className="text-xs text-rose-600 font-extrabold text-center bg-rose-50/50 p-2 rounded-lg border">
                      Kiểm tra kỹ hệ số (chú ý phân số hay dấu trừ) và bậc (tổng các số mũ)!
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Verification action button / Next button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-400">
                Thử sức ngay!
              </span>

              {!hasSubmitted ? (
                <button
                  onClick={checkAnswer}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-md flex items-center gap-2 tracking-wide"
                >
                  <CheckSquareIcon /> Kiểm tra đáp án
                </button>
              ) : (
                <button
                  onClick={() => loadNextQuestion()}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-md flex items-center gap-2 tracking-wide"
                >
                  Tiếp tục câu khác <ChevronRight size={18} />
                </button>
              )}
            </div>

            {/* Answer Feedback Notice */}
            <AnimatePresence>
              {hasSubmitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  {/* Correct/Incorrect Banner */}
                  <div className={`p-4 rounded-2xl border text-center font-black flex items-center justify-center gap-3 text-base ${
                    isCorrect 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}>
                    {isCorrect ? (
                      <>
                        <Sparkles size={20} className="fill-emerald-600 animate-bounce" />
                        <span>QUÁ TUYỆT VỜI! ĐÁP ÁN HOÀN TOÀN CHÍNH XÁC! 🎉</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={20} className="animate-pulse" />
                        <span>CHƯA ĐÚNG RỒI, EM CÙNG XEM GIẢI THÍCH NHÉ!</span>
                      </>
                    )}
                  </div>

                  {/* Core Educational Solutions */}
                  <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-4 shadow-inner">
                    
                    {/* 1. Step-by-step solution */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-slate-800">
                        <BookOpen size={16} className="text-indigo-600" />
                        <h4 className="font-extrabold text-sm sm:text-base">Lời giải chi tiết từng bước:</h4>
                      </div>
                      <div className="space-y-2 text-slate-600 text-xs sm:text-sm font-semibold pl-1 leading-relaxed">
                        {currentQuestion.explanation.map((step, sIdx) => (
                          <div key={sIdx} className="bg-white px-3.5 py-2 rounded-xl border border-slate-100 shadow-xs">
                            {renderTextWithMath(step)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Educational Tip if available */}
                    {currentQuestion.tip && (
                      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                        <div className="shrink-0 bg-amber-100 text-amber-700 p-2 rounded-xl h-fit">
                          <Lightbulb size={16} />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs text-amber-800 mb-0.5">Mẹo ghi nhớ học tập:</h5>
                          <p className="text-xs text-amber-700 font-semibold leading-relaxed">{currentQuestion.tip}</p>
                        </div>
                      </div>
                    )}

                    {/* 3. Similar example if available */}
                    {currentQuestion.similarExample && (
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                        <div className="shrink-0 bg-blue-100 text-blue-700 p-2 rounded-xl h-fit">
                          <Award size={16} />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs text-blue-800 mb-0.5">Ví dụ tương tự bồi dưỡng:</h5>
                          <div className="text-xs text-blue-700 font-bold leading-relaxed">
                            {renderTextWithMath(currentQuestion.similarExample)}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border text-center font-bold text-slate-500">
            ⚠️ Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại. Hãy thử chọn độ khó khác hoặc chọn "Tất cả dạng"!
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Minimal internal helper icons
function CheckSquareIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}
