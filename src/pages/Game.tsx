import React, { useState, useEffect, useRef } from "react";
import { 
  Gamepad2, Timer, Zap, Trophy, Play, RotateCcw, Award, Star, 
  AlertCircle, Check, X, Compass, Flag, Flame, ArrowUpCircle, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateQuestionPool, Question, getRandomQuestions } from "../utils/questionBank";
import { playSound } from "../utils/sound";
import MathFormula, { renderTextWithMath } from "../components/MathFormula";

interface GameProps {
  onAwardXP: (xp: number, coins: number) => void;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
}

type ActiveGameMode = "menu" | "pop" | "bee" | "memory" | "millionaire" | "climbing";

export default function Game({ onAwardXP, highScore, onUpdateHighScore }: GameProps) {
  const [activeGame, setActiveGame] = useState<ActiveGameMode>("menu");
  const [questionPool, setQuestionPool] = useState<Question[]>([]);

  // Sound play helper wrapper
  const triggerSound = (type: "correct" | "incorrect" | "click" | "level-up" | "pop") => {
    playSound(type);
  };

  useEffect(() => {
    setQuestionPool(generateQuestionPool());
  }, []);

  // Return to menu
  const exitToMenu = () => {
    triggerSound("click");
    setActiveGame("menu");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-1" id="game-module">
      <AnimatePresence mode="wait">
        
        {/* GAME MENU DASHBOARD */}
        {activeGame === "menu" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header branding */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 scale-150">
                <Gamepad2 size={200} />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="bg-white/20 p-2.5 rounded-2xl">
                  <Gamepad2 size={24} className="text-yellow-300 animate-float" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">Khu vui chơi học tập</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">ĐẤU TRƯỜNG ĐA THỨC</h1>
              <p className="text-xs md:text-sm text-purple-100 font-bold max-w-xl">
                Nâng cấp tư duy đại số thông qua những trò chơi kịch tính, vui nhộn và nhận hàng trăm Xu thưởng!
              </p>
            </div>

            {/* Grid of Games */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Game 1: Đấu trường Bong Bóng */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => { triggerSound("click"); setActiveGame("pop"); }}
                className="bg-white border-2 border-slate-200 hover:border-emerald-400 p-5 rounded-3xl text-left flex gap-4 transition-all shadow-xs"
              >
                <div className="bg-emerald-100 text-emerald-700 p-4 rounded-2xl h-fit">
                  <Zap size={28} className="animate-pulse" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Bấm bong bóng nhanh tay</span>
                  <h3 className="text-lg font-black text-slate-800">Đấu trường Bong Bóng 🎈</h3>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    Tìm kiếm và phá hủy các đơn thức đồng dạng với đơn thức mục tiêu trong thời gian giới hạn!
                  </p>
                </div>
              </motion.button>

              {/* Game 2: Ong Tìm Mật */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => { triggerSound("click"); setActiveGame("bee"); }}
                className="bg-white border-2 border-slate-200 hover:border-amber-400 p-5 rounded-3xl text-left flex gap-4 transition-all shadow-xs"
              >
                <div className="bg-amber-100 text-amber-700 p-4 rounded-2xl h-fit">
                  <Star size={28} className="fill-amber-400" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Hành trình tìm mật ngọt</span>
                  <h3 className="text-lg font-black text-slate-800">Ong Tìm Mật 🐝</h3>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    Giúp chú ong chăm chỉ trả lời đúng 5 câu hỏi toán để bay qua các bông hoa ngọt ngào và thu thập hũ mật vàng!
                  </p>
                </div>
              </motion.button>

              {/* Game 3: Thẻ Bài Trí Nhớ */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => { triggerSound("click"); setActiveGame("memory"); }}
                className="bg-white border-2 border-slate-200 hover:border-indigo-400 p-5 rounded-3xl text-left flex gap-4 transition-all shadow-xs"
              >
                <div className="bg-indigo-100 text-indigo-700 p-4 rounded-2xl h-fit">
                  <Trophy size={28} />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Rèn luyện trí tuệ & ghi nhớ</span>
                  <h3 className="text-lg font-black text-slate-800">Thẻ Bài Trí Nhớ 🎴</h3>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    Lật thẻ và ghép đôi các biểu thức toán chưa thu gọn với dạng thu gọn chính xác của chúng. Thử thách trí óc cực đỉnh!
                  </p>
                </div>
              </motion.button>

              {/* Game 4: Ai là Triệu Phú */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => { triggerSound("click"); setActiveGame("millionaire"); }}
                className="bg-white border-2 border-slate-200 hover:border-blue-400 p-5 rounded-3xl text-left flex gap-4 transition-all shadow-xs"
              >
                <div className="bg-blue-100 text-blue-700 p-4 rounded-2xl h-fit">
                  <CrownIcon />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Vượt mốc thử thách lớn</span>
                  <h3 className="text-lg font-black text-slate-800">Ai là Triệu Phú Đa Thức 👑</h3>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    Trải nghiệm sân chơi kịch tính với 10 nấc thang giải thưởng, 3 sự trợ giúp đắc lực từ trí tuệ để chinh phục đỉnh cao!
                  </p>
                </div>
              </motion.button>

              {/* Game 5: Leo Núi Tri Thức */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => { triggerSound("click"); setActiveGame("climbing"); }}
                className="bg-white border-2 border-slate-200 hover:border-rose-400 p-5 rounded-3xl text-left flex gap-4 transition-all shadow-xs"
              >
                <div className="bg-rose-100 text-rose-700 p-4 rounded-2xl h-fit">
                  <ArrowUpCircle size={28} />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">Chinh phục đỉnh cao</span>
                  <h3 className="text-lg font-black text-slate-800">Leo Núi Tri Thức ⛰️</h3>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    Chinh phục con dốc đá hiểm trở với độ khó tăng dần (Nhận biết ➜ Thông hiểu ➜ Vận dụng ➜ Vận dụng cao) để cắm cờ đỏ sao vàng!
                  </p>
                </div>
              </motion.button>

            </div>
          </motion.div>
        )}

        {/* GAME 1: ĐẤU TRƯỜNG BONG BÓNG */}
        {activeGame === "pop" && (
          <BubblePopGame 
            exitToMenu={exitToMenu} 
            triggerSound={triggerSound} 
            onAwardXP={onAwardXP} 
            highScore={highScore} 
            onUpdateHighScore={onUpdateHighScore} 
          />
        )}

        {/* GAME 2: ONG TÌM MẬT */}
        {activeGame === "bee" && (
          <BeeGame 
            exitToMenu={exitToMenu} 
            triggerSound={triggerSound} 
            onAwardXP={onAwardXP} 
            questionPool={questionPool}
          />
        )}

        {/* GAME 3: MEMORY CARD */}
        {activeGame === "memory" && (
          <MemoryGame 
            exitToMenu={exitToMenu} 
            triggerSound={triggerSound} 
            onAwardXP={onAwardXP} 
          />
        )}

        {/* GAME 4: AI LÀ TRIỆU PHÚ */}
        {activeGame === "millionaire" && (
          <MillionaireGame 
            exitToMenu={exitToMenu} 
            triggerSound={triggerSound} 
            onAwardXP={onAwardXP}
            questionPool={questionPool}
          />
        )}

        {/* GAME 5: LEO NÚI TRI THỨC */}
        {activeGame === "climbing" && (
          <ClimbingGame 
            exitToMenu={exitToMenu} 
            triggerSound={triggerSound} 
            onAwardXP={onAwardXP}
            questionPool={questionPool}
          />
        )}

      </AnimatePresence>
    </div>
  );
}

// ==========================================
// GAME 1 SUBCOMPONENT: BUBBLE POP GAME
// ==========================================
interface BubblePopProps {
  exitToMenu: () => void;
  triggerSound: (type: "correct" | "incorrect" | "click" | "level-up" | "pop") => void;
  onAwardXP: (xp: number, coins: number) => void;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
}

interface BubbleOption {
  id: number;
  term: string;
  isSimilar: boolean;
  popped: boolean;
}

function BubblePopGame({ exitToMenu, triggerSound, onAwardXP, highScore, onUpdateHighScore }: BubblePopProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [targetTerm, setTargetTerm] = useState("");
  const [targetVars, setTargetVars] = useState("");
  const [bubbles, setBubbles] = useState<BubbleOption[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startNewRound = () => {
    // Determine random target variables
    const options = [
      { term: "3x^2y", vars: "x^2y" },
      { term: "-5xy^2", vars: "xy^2" },
      { term: "\\frac{1}{2}x^3y^2", vars: "x^3y^2" },
      { term: "10xyz", vars: "xyz" },
      { term: "-a^2b^3", vars: "a^2b^3" },
    ];
    const target = options[Math.floor(Math.random() * options.length)];
    setTargetTerm(target.term);
    setTargetVars(target.vars);

    // Generate 6 bubble choices
    const currentBubbles: BubbleOption[] = [];
    const coefficients = [1, -2, 5, -10, 3, -1, 7, 12, -4];
    
    // Create 3 correct similar terms
    for (let i = 0; i < 3; i++) {
      const coeff = coefficients[Math.floor(Math.random() * coefficients.length)];
      currentBubbles.push({
        id: i,
        term: `${coeff === 1 ? "" : coeff === -1 ? "-" : coeff}${target.vars}`,
        isSimilar: true,
        popped: false
      });
    }

    // Create 3 incorrect dissimilar terms
    const wrongVars = [
      "x^2y^2", "xy", "x^3y", "x^2", "y^2", "x^2y^3", "ab^2", "a^2b"
    ].filter(v => v !== target.vars);

    for (let i = 0; i < 3; i++) {
      const coeff = coefficients[Math.floor(Math.random() * coefficients.length)];
      const randomVars = wrongVars[Math.floor(Math.random() * wrongVars.length)];
      currentBubbles.push({
        id: i + 3,
        term: `${coeff === 1 ? "" : coeff === -1 ? "-" : coeff}${randomVars}`,
        isSimilar: false,
        popped: false
      });
    }

    // Shuffle bubbles
    setBubbles(currentBubbles.sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    triggerSound("level-up");
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    startNewRound();
  };

  // Timer loop
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      // Game ended
      setIsPlaying(false);
      triggerSound("level-up");
      // Award XP based on bubble pop score
      if (score > 0) {
        onAwardXP(score * 3, Math.floor(score * 1.5));
      }
      if (score > highScore) {
        onUpdateHighScore(score);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isPlaying]);

  const handleBubbleClick = (bubble: BubbleOption) => {
    if (!isPlaying || bubble.popped) return;

    // Pop bubble
    setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, popped: true } : b));

    if (bubble.isSimilar) {
      triggerSound("pop");
      setScore(s => s + 5);
      
      // If all correct ones are popped, start next round
      const anyCorrectLeft = bubbles.some(b => b.isSimilar && !b.popped && b.id !== bubble.id);
      if (!anyCorrectLeft) {
        setTimeout(() => {
          startNewRound();
        }, 300);
      }
    } else {
      triggerSound("incorrect");
      setScore(s => Math.max(0, s - 3));
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <button onClick={exitToMenu} className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100">
          ➜ Trở về khu trò chơi
        </button>
        <span className="text-sm font-black text-slate-800">🎈 ĐẤU TRƯỜNG BONG BÓNG</span>
      </div>

      {!isPlaying ? (
        <div className="text-center py-12 space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <Zap size={40} className="stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Sẵn sàng phản xạ đại số?</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
              Phát hiện và chạm thật nhanh vào các quả bóng chứa đơn thức ĐỒNG DẠNG với đơn thức mục tiêu để tích lũy điểm số!
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl max-w-xs mx-auto border space-y-1">
            <div className="text-xs text-slate-400 font-bold">Kỷ lục của em:</div>
            <div className="text-xl font-black text-indigo-600">{highScore} điểm</div>
          </div>
          <button onClick={startGame} className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-emerald-200">
            BẮT ĐẦU CHƠI NGAY 🚀
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-sm font-black px-1">
            <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl border">
              <Timer size={16} /> Thời gian: <span className="text-red-600 font-black">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 bg-indigo-50 text-indigo-800 px-3.5 py-2 rounded-xl border border-indigo-200">
              <Trophy size={16} className="text-yellow-500 fill-yellow-300" /> Điểm số: <span className="text-indigo-600 font-black">{score}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Đơn thức mục tiêu:</span>
            <div className="text-3xl font-mono font-black text-emerald-600 mt-1 flex justify-center items-center gap-2">
              <MathFormula formula={targetTerm} />
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-1 flex items-center justify-center gap-1.5">
              Tìm các đơn thức đồng dạng có phần biến là <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md inline-block"><MathFormula formula={targetVars} /></span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {bubbles.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: option.popped ? 1 : 1.05 }}
                whileTap={{ scale: option.popped ? 1 : 0.95 }}
                onClick={() => handleBubbleClick(option)}
                disabled={option.popped}
                className={`h-24 rounded-2xl flex flex-col items-center justify-center font-black text-lg border-2 transition-all relative ${
                  option.popped
                    ? option.isSimilar
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 opacity-60"
                      : "bg-rose-50 border-rose-500 text-rose-700 opacity-60"
                    : "bg-white border-slate-200 hover:border-emerald-400 text-slate-800 cursor-pointer shadow-sm hover:shadow-md"
                }`}
              >
                {option.popped && (
                  <span className="absolute top-2 right-2 text-xs font-black">
                    {option.isSimilar ? <span className="text-emerald-600">✓ Đúng</span> : <span className="text-rose-600">✗ Sai</span>}
                  </span>
                )}
                <MathFormula formula={option.term} />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// GAME 2 SUBCOMPONENT: ONG TÌM MẬT (BEE GAME)
// ==========================================
interface BeeProps {
  exitToMenu: () => void;
  triggerSound: (type: "correct" | "incorrect" | "click" | "level-up" | "pop") => void;
  onAwardXP: (xp: number, coins: number) => void;
  questionPool: Question[];
}

function BeeGame({ exitToMenu, triggerSound, onAwardXP, questionPool }: BeeProps) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "won" | "lost">("ready");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currIdx, setCurrIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasSub, setHasSub] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);

  const startNewGame = () => {
    // Pick 5 random multiple-choice or true-false questions
    const q = questionPool.filter(item => item.type === "multiple-choice" || item.type === "true-false");
    const selected = getRandomQuestions(q, 5);
    setQuestions(selected);
    setCurrIdx(0);
    setSelectedOpt(null);
    setHasSub(false);
    setWrongCount(0);
    setGameState("playing");
    triggerSound("level-up");
  };

  const handleSelect = (idx: number) => {
    if (hasSub) return;
    triggerSound("click");
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || hasSub) return;

    const currentQ = questions[currIdx];
    const isCorrect = selectedOpt === currentQ.correctOptionIndex || 
      (currentQ.type === "true-false" && ((selectedOpt === 1 && currentQ.isTrue) || (selectedOpt === 0 && !currentQ.isTrue)));

    setHasSub(true);

    if (isCorrect) {
      triggerSound("correct");
    } else {
      triggerSound("incorrect");
      setWrongCount(w => w + 1);
    }
  };

  const handleNext = () => {
    const nextIdx = currIdx + 1;
    if (nextIdx >= questions.length) {
      // Game ended
      if (wrongCount <= 1) {
        setGameState("won");
        triggerSound("level-up");
        onAwardXP(40, 20); // Award nice honey bonus!
      } else {
        setGameState("lost");
      }
    } else {
      setCurrIdx(nextIdx);
      setSelectedOpt(null);
      setHasSub(false);
    }
  };

  const getOptions = (q: Question) => {
    if (q.type === "true-false") {
      return ["$\text{Sai}$", "$\text{Đúng}$"];
    }
    return q.options || [];
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <button onClick={exitToMenu} className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100">
          ➜ Trở về khu trò chơi
        </button>
        <span className="text-sm font-black text-slate-800">🐝 ONG TÌM MẬT</span>
      </div>

      {gameState === "ready" && (
        <div className="text-center py-10 space-y-6">
          <div className="text-6xl animate-float">🐝</div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-800">Cùng Chú Ong Đi Tìm Mật Ngọt!</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
              Trải qua con đường 5 khóm hoa rực rỡ. Tại mỗi bông hoa, hãy giúp chú ong chăm chỉ giải đáp án toán chính xác để tiếp thêm sức mạnh bay về tổ!
            </p>
          </div>
          <button onClick={startNewGame} className="px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-md">
            BAY ĐI TÌM MẬT 🍯
          </button>
        </div>
      )}

      {gameState === "playing" && questions[currIdx] && (
        <div className="space-y-6">
          {/* Progress row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400">Khóm hoa {currIdx + 1}/5</span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < currIdx 
                      ? "bg-amber-500 text-white" 
                      : i === currIdx 
                        ? "bg-indigo-600 text-white animate-pulse" 
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {i < currIdx ? "🌸" : i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Question text */}
          <div className="bg-amber-50/50 border border-amber-200/40 rounded-2xl p-5">
            <div className="text-base font-black text-slate-800 leading-relaxed">
              {renderTextWithMath(questions[currIdx].questionText)}
            </div>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getOptions(questions[currIdx]).map((opt, oIdx) => {
              const isSelected = selectedOpt === oIdx;
              const isCorrectOpt = questions[currIdx].type === "true-false" 
                ? (questions[currIdx].isTrue ? oIdx === 1 : oIdx === 0)
                : oIdx === questions[currIdx].correctOptionIndex;

              let style = "border-slate-200 bg-white hover:border-amber-400";
              if (isSelected) style = "border-amber-500 bg-amber-50/40 text-amber-900";
              if (hasSub) {
                if (isCorrectOpt) style = "border-emerald-500 bg-emerald-50/30 text-emerald-900";
                else if (isSelected) style = "border-rose-500 bg-rose-50/30 text-rose-900";
              }

              return (
                <button
                  key={oIdx}
                  disabled={hasSub}
                  onClick={() => handleSelect(oIdx)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-bold transition-all text-sm sm:text-base flex items-center justify-between ${style}`}
                >
                  <MathFormula formula={opt} />
                  {hasSub && isCorrectOpt && <Check size={18} className="text-emerald-600" />}
                  {hasSub && isSelected && !isCorrectOpt && <X size={18} className="text-rose-600" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2 border-t">
            {!hasSub ? (
              <button
                disabled={selectedOpt === null}
                onClick={handleSubmit}
                className="px-6 py-3 bg-amber-500 text-white font-black text-sm rounded-xl disabled:opacity-50"
              >
                Hút mật & kiểm tra 🌸
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-indigo-600 text-white font-black text-sm rounded-xl"
              >
                Bay tiếp thôi 🐝
              </button>
            )}
          </div>
        </div>
      )}

      {gameState === "won" && (
        <div className="text-center py-10 space-y-6">
          <div className="text-7xl animate-bounce">🍯🍯🐝</div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-amber-600">Hành trình thành công!</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto">
              Chú ong đã thu hoạch đầy hũ mật vàng óng ngọt ngào. Em được thưởng ngay 40 XP & 20 Xu học tập!
            </p>
          </div>
          <button onClick={startNewGame} className="px-8 py-3 bg-amber-500 text-white font-black rounded-xl">
            CHƠI LẠI TRẬN MỚI 🌸
          </button>
        </div>
      )}

      {gameState === "lost" && (
        <div className="text-center py-10 space-y-6">
          <div className="text-6xl text-slate-300">🌧️🐝</div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-700">Chưa tìm được hũ mật!</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto">
              Chú ong bị mệt mỏi rồi. Em hãy hỗ trợ ong ôn luyện lý thuyết thật chắc chắn và thử sức lại nhé!
            </p>
          </div>
          <button onClick={startNewGame} className="px-8 py-3 bg-slate-700 text-white font-black rounded-xl">
            THỬ SỨC LẠI ☘️
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// GAME 3 SUBCOMPONENT: MEMORY GAME
// ==========================================
interface MemoryProps {
  exitToMenu: () => void;
  triggerSound: (type: "correct" | "incorrect" | "click" | "level-up" | "pop") => void;
  onAwardXP: (xp: number, coins: number) => void;
}

interface Card {
  id: number;
  content: string;
  matchId: number; // Cards with same matchId form a mathematical simplified pair
  isFlipped: boolean;
  isMatched: boolean;
}

function MemoryGame({ exitToMenu, triggerSound, onAwardXP }: MemoryProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    // Generate 4 mathematical pairs (8 cards total)
    const pairs = [
      { left: "$2x + 3x$", right: "$5x$" },
      { left: "$a(a + 1)$", right: "$a^2 + a$" },
      { left: "$-x^2y - x^2y$", right: "$-2x^2y$" },
      { left: "$(x-y)(x+y)$", right: "$x^2 - y^2$" }
    ];

    const cardList: Card[] = [];
    pairs.forEach((p, idx) => {
      cardList.push({
        id: idx * 2,
        content: p.left,
        matchId: idx,
        isFlipped: false,
        isMatched: false
      });
      cardList.push({
        id: idx * 2 + 1,
        content: p.right,
        matchId: idx,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle
    setCards(cardList.sort(() => Math.random() - 0.5));
    setSelected([]);
    setMoves(0);
    setIsWon(false);
    triggerSound("level-up");
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (id: number) => {
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched || selected.length >= 2) return;

    triggerSound("click");
    
    // Flip card
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));
    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const first = cards.find(c => c.id === newSelected[0])!;
      const second = cards.find(c => c.id === id)!;

      if (first.matchId === second.matchId) {
        // Correct match!
        setTimeout(() => {
          triggerSound("correct");
          setCards(prev => prev.map(c => c.matchId === first.matchId ? { ...c, isMatched: true } : c));
          setSelected([]);
          
          // Check win
          setCards(latest => {
            const allMatched = latest.every(c => c.isMatched || c.matchId === first.matchId);
            if (allMatched) {
              setIsWon(true);
              triggerSound("level-up");
              onAwardXP(30, 15);
            }
            return latest;
          });
        }, 600);
      } else {
        // Wrong match
        setTimeout(() => {
          triggerSound("incorrect");
          setCards(prev => prev.map(c => c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c));
          setSelected([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <button onClick={exitToMenu} className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100">
          ➜ Trở về khu trò chơi
        </button>
        <span className="text-sm font-black text-slate-800">🎴 THẺ BÀI TRÍ NHỚ ĐA THỨC</span>
      </div>

      <div className="flex justify-between text-xs font-black text-slate-500 px-1 bg-slate-50 p-2 rounded-xl">
        <span>Lượt lật thẻ: <strong className="text-indigo-600 text-sm">{moves}</strong></span>
        <span>Ghép thu gọn đa thức đồng dạng</span>
      </div>

      {!isWon ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
          {cards.map((card) => {
            const showFace = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`h-32 rounded-2xl flex items-center justify-center font-black transition-all border-2 relative ${
                  showFace 
                    ? card.isMatched 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 text-sm sm:text-base" 
                      : "bg-indigo-50 border-indigo-500 text-indigo-900 text-sm sm:text-base"
                    : "bg-indigo-600 hover:bg-indigo-700 border-indigo-700 text-white text-3xl hover:scale-105"
                }`}
              >
                {showFace ? (
                  <MathFormula formula={card.content} />
                ) : (
                  "❔"
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 space-y-6">
          <div className="text-7xl animate-bounce">🏆🧠🎉</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-emerald-600">Tuyệt vời! Siêu trí nhớ!</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto">
              Em đã ghép nối thành công toàn bộ hằng đẳng thức và đơn thức đồng dạng trong <strong className="text-slate-800">{moves} lượt</strong>. Thưởng ngay 30 XP!
            </p>
          </div>
          <button onClick={initGame} className="px-8 py-3 bg-emerald-500 text-white font-black rounded-xl shadow-md">
            CHƠI LẠI TRẬN MỚI 🎴
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// GAME 4 SUBCOMPONENT: AI LÀ TRIỆU PHÚ
// ==========================================
interface MillionaireProps {
  exitToMenu: () => void;
  triggerSound: (type: "correct" | "incorrect" | "click" | "level-up" | "pop") => void;
  onAwardXP: (xp: number, coins: number) => void;
  questionPool: Question[];
}

const prizeScale = [
  "1,000,000", "2,000,000", "5,000,000", "10,000,000", "20,000,000",
  "35,000,000", "50,000,000", "80,000,000", "120,000,000", "150,000,000"
];

function MillionaireGame({ exitToMenu, triggerSound, onAwardXP, questionPool }: MillionaireProps) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "won" | "lost">("ready");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currIdx, setCurrIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasSub, setHasSub] = useState(false);
  
  // Lifelines
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    askAi: true,
    skip: true
  });
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);

  const startNewGame = () => {
    // Collect 10 questions (mix of difficulties)
    const mcQ = questionPool.filter(q => q.type === "multiple-choice");
    const selected = getRandomQuestions(mcQ, 10);
    
    setQuestions(selected);
    setCurrIdx(0);
    setSelectedOpt(null);
    setHasSub(false);
    setDisabledOptions([]);
    setAiAdvice(null);
    setLifelines({ fiftyFifty: true, askAi: true, skip: true });
    setGameState("playing");
    triggerSound("level-up");
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || hasSub) return;
    triggerSound("click");
    
    const correctIdx = questions[currIdx].correctOptionIndex ?? 0;
    const allIndices = [0, 1, 2, 3].filter(idx => idx !== correctIdx);
    
    // Choose 2 random wrong options to disable
    const disabled = allIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setDisabledOptions(disabled);
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));
  };

  const useAskAi = () => {
    if (!lifelines.askAi || hasSub) return;
    triggerSound("click");
    
    const correctIdx = questions[currIdx].correctOptionIndex ?? 0;
    const isUnderstood = Math.random() < 0.85; // 85% accuracy
    const suggested = isUnderstood ? correctIdx : (correctIdx + 1) % 4;
    const alphabet = ["A", "B", "C", "D"];
    
    setAiAdvice(`🤖 Trợ lý AI khuyên em chọn đáp án ${alphabet[suggested]}. Hạng tử này khớp hoàn toàn với định luật đại số.`);
    setLifelines(prev => ({ ...prev, askAi: false }));
  };

  const useSkip = () => {
    if (!lifelines.skip || hasSub) return;
    triggerSound("click");
    
    setLifelines(prev => ({ ...prev, skip: false }));
    // Just load a replacement question for the current slot
    const mcQ = questionPool.filter(q => q.type === "multiple-choice" && !questions.map(item => item.id).includes(q.id));
    if (mcQ.length > 0) {
      const repl = mcQ[Math.floor(Math.random() * mcQ.length)];
      setQuestions(prev => prev.map((q, idx) => idx === currIdx ? repl : q));
      setSelectedOpt(null);
      setDisabledOptions([]);
      setAiAdvice(null);
    }
  };

  const handleSelect = (idx: number) => {
    if (hasSub || disabledOptions.includes(idx)) return;
    triggerSound("click");
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || hasSub) return;

    const correctIdx = questions[currIdx].correctOptionIndex ?? 0;
    const isCorrect = selectedOpt === correctIdx;
    
    setHasSub(true);

    if (isCorrect) {
      triggerSound("correct");
    } else {
      triggerSound("incorrect");
    }
  };

  const handleNext = () => {
    const isCorrect = selectedOpt === questions[currIdx].correctOptionIndex;
    if (!isCorrect) {
      setGameState("lost");
      return;
    }

    const nextIdx = currIdx + 1;
    if (nextIdx >= questions.length) {
      // Won the whole thing
      setGameState("won");
      triggerSound("level-up");
      onAwardXP(100, 50); // Mega champion award
    } else {
      setCurrIdx(nextIdx);
      setSelectedOpt(null);
      setHasSub(false);
      setDisabledOptions([]);
      setAiAdvice(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <button onClick={exitToMenu} className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100">
          ➜ Trở về khu trò chơi
        </button>
        <span className="text-sm font-black text-slate-800">👑 AI LÀ TRIỆU PHÚ ĐA THỨC</span>
      </div>

      {gameState === "ready" && (
        <div className="text-center py-10 space-y-6">
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            🥇
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Ai là Triệu Phú?</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
              Vượt qua 10 câu hỏi trắc nghiệm hóc búa để thắng phần thưởng tượng trưng trị giá <strong className="text-indigo-600 font-black">150.000.000đ</strong> và nhận ngay 100 XP học tập quý giá!
            </p>
          </div>
          <button onClick={startNewGame} className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-md">
            BẮT ĐẦU CHINH PHỤC 💰
          </button>
        </div>
      )}

      {gameState === "playing" && questions[currIdx] && (
        <div className="space-y-6">
          
          {/* Lifelines row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-800 px-3 py-1 rounded-xl text-xs font-black">
              Mức thưởng: <span className="text-indigo-600 text-sm font-black">{prizeScale[currIdx]}đ</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400">Sự trợ giúp:</span>
              <button 
                disabled={!lifelines.fiftyFifty || hasSub}
                onClick={useFiftyFifty}
                className="px-2.5 py-1 text-xs font-black bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg disabled:opacity-40 border border-purple-200"
              >
                50/50
              </button>
              <button 
                disabled={!lifelines.askAi || hasSub}
                onClick={useAskAi}
                className="px-2.5 py-1 text-xs font-black bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg disabled:opacity-40 border border-blue-200"
              >
                🤖 Trợ lý
              </button>
              <button 
                disabled={!lifelines.skip || hasSub}
                onClick={useSkip}
                className="px-2.5 py-1 text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg disabled:opacity-40 border border-rose-200"
              >
                ⏩ Đổi câu
              </button>
            </div>
          </div>

          {/* AI Advice notice */}
          {aiAdvice && (
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-xs font-bold text-blue-700 leading-relaxed">
              {aiAdvice}
            </div>
          )}

          {/* Question Text */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 relative">
            <span className="absolute top-3 left-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">CÂU HỎI {currIdx + 1}/10</span>
            <div className="text-center pt-3 text-sm sm:text-base font-bold">
              {renderTextWithMath(questions[currIdx].questionText)}
            </div>
          </div>

          {/* Scrambled Options list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(questions[currIdx].options || []).map((opt, idx) => {
              const isDisabled = disabledOptions.includes(idx);
              const isSelected = selectedOpt === idx;
              const isCorrectIdx = idx === questions[currIdx].correctOptionIndex;

              let style = "border-slate-200 bg-white hover:border-indigo-400 text-slate-700";
              if (isDisabled) style = "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed";
              else if (isSelected) style = "border-indigo-600 bg-indigo-50 text-indigo-900";
              
              if (hasSub) {
                if (isCorrectIdx) style = "border-emerald-500 bg-emerald-50 text-emerald-900";
                else if (isSelected) style = "border-rose-500 bg-rose-50 text-rose-900";
              }

              return (
                <button
                  key={idx}
                  disabled={hasSub || isDisabled}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-black transition-all text-sm sm:text-base flex items-center gap-2 ${style}`}
                >
                  <span className="text-slate-400 font-extrabold mr-1">
                    {idx === 0 ? "A:" : idx === 1 ? "B:" : idx === 2 ? "C:" : "D:"}
                  </span>
                  <MathFormula formula={opt} />
                </button>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            {!hasSub ? (
              <button
                disabled={selectedOpt === null}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-indigo-600 text-white font-black text-sm rounded-xl disabled:opacity-50 shadow-md"
              >
                Chốt phương án này! 👑
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-emerald-600 text-white font-black text-sm rounded-xl shadow-md"
              >
                {selectedOpt === questions[currIdx].correctOptionIndex ? "Trả lời tiếp ⏩" : "Xem kết quả chung cuộc 🌧️"}
              </button>
            )}
          </div>
        </div>
      )}

      {gameState === "won" && (
        <div className="text-center py-10 space-y-6">
          <div className="text-7xl animate-bounce">🏆🥇💸</div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-yellow-600">TRIỆU PHÚ ĐA THỨC!</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto">
              Không thể tin nổi! Em đã xuất sắc chinh phục hoàn hảo cả 10 câu hỏi để nhận phần thưởng lớn 100 XP & 50 Xu học tập!
            </p>
          </div>
          <button onClick={startNewGame} className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl">
            THỬ SỨC TRẬN MỚI 💸
          </button>
        </div>
      )}

      {gameState === "lost" && (
        <div className="text-center py-10 space-y-6">
          <div className="text-6xl text-slate-300">🌧️🌧️</div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-700">Dừng cuộc chơi đầy tiếc nuối!</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto">
              Đáp án chưa chính xác. Tuy nhiên, em đã thu về vốn kiến thức phong phú để sẵn sàng đánh bại các bài kiểm tra sắp tới!
            </p>
          </div>
          <button onClick={startNewGame} className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl">
            CHƠI LẠI TRẬN MỚI 👑
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// GAME 5 SUBCOMPONENT: LEO NÚI TRI THỨC (CLIMBING GAME)
// ==========================================
interface ClimbingProps {
  exitToMenu: () => void;
  triggerSound: (type: "correct" | "incorrect" | "click" | "level-up" | "pop") => void;
  onAwardXP: (xp: number, coins: number) => void;
  questionPool: Question[];
}

function ClimbingGame({ exitToMenu, triggerSound, onAwardXP, questionPool }: ClimbingProps) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "won" | "lost">("ready");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currIdx, setCurrIdx] = useState(0); // 0 (Nhận biết), 1 (Thông hiểu), 2 (Vận dụng), 3 (Vận dụng cao)
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasSub, setHasSub] = useState(false);

  const startNewGame = () => {
    // Select one question from each difficulty level:
    const q1 = questionPool.filter(q => q.difficulty === "nhan-biet" && q.type === "multiple-choice");
    const q2 = questionPool.filter(q => q.difficulty === "thong-hieu" && q.type === "multiple-choice");
    const q3 = questionPool.filter(q => q.difficulty === "van-dung" && q.type === "multiple-choice");
    const q4 = questionPool.filter(q => q.difficulty === "van-dung-cao" && q.type === "multiple-choice");

    if (q1.length && q2.length && q3.length && q4.length) {
      setQuestions([
        q1[Math.floor(Math.random() * q1.length)],
        q2[Math.floor(Math.random() * q2.length)],
        q3[Math.floor(Math.random() * q3.length)],
        q4[Math.floor(Math.random() * q4.length)]
      ]);
      setCurrIdx(0);
      setSelectedOpt(null);
      setHasSub(false);
      setGameState("playing");
      triggerSound("level-up");
    }
  };

  const handleSelect = (idx: number) => {
    if (hasSub) return;
    triggerSound("click");
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || hasSub) return;
    setHasSub(true);
    
    const correctIdx = questions[currIdx].correctOptionIndex ?? 0;
    if (selectedOpt === correctIdx) {
      triggerSound("correct");
    } else {
      triggerSound("incorrect");
    }
  };

  const handleNext = () => {
    const isCorrect = selectedOpt === questions[currIdx].correctOptionIndex;
    if (!isCorrect) {
      setGameState("lost");
      return;
    }

    const nextIdx = currIdx + 1;
    if (nextIdx >= 4) {
      setGameState("won");
      triggerSound("level-up");
      onAwardXP(50, 25);
    } else {
      setCurrIdx(nextIdx);
      setSelectedOpt(null);
      setHasSub(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <button onClick={exitToMenu} className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100">
          ➜ Trở về khu trò chơi
        </button>
        <span className="text-sm font-black text-slate-800">⛰️ LEO NÚI TRI THỨC</span>
      </div>

      {gameState === "ready" && (
        <div className="text-center py-10 space-y-6">
          <div className="text-6xl animate-bounce">⛰️🚩</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Cắm Cờ Đỉnh Núi!</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
              Vượt qua 4 sườn dốc tương ứng 4 cấp độ tư duy từ dễ đến khó nhất. Mỗi bước leo dốc đúng sẽ giúp em leo cao hơn. Trả lời sai em sẽ bị trượt xuống!
            </p>
          </div>
          <button onClick={startNewGame} className="px-10 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-md">
            BẮT ĐẦU LEO NÚI 🚩
          </button>
        </div>
      )}

      {gameState === "playing" && questions[currIdx] && (
        <div className="space-y-6">
          {/* Visual Mountain Steps */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-around">
            {[
              { label: "Vận dụng cao ❄️", key: 3 },
              { label: "Vận dụng 🍃", key: 2 },
              { label: "Thông hiểu 🏕️", key: 1 },
              { label: "Nhận biết ⛰️", key: 0 }
            ].map((step) => {
              const isCurrent = currIdx === step.key;
              const isPassed = currIdx > step.key;
              
              return (
                <div 
                  key={step.key}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black border flex flex-col items-center gap-1 ${
                    isCurrent 
                      ? "bg-rose-500 text-white border-rose-600 scale-105" 
                      : isPassed 
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                        : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}
                >
                  <span>{isPassed ? "✓" : step.key + 1}</span>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Question card */}
          <div className="bg-slate-50 p-5 rounded-2xl border">
            <h3 className="text-base font-black text-slate-800">
              {renderTextWithMath(questions[currIdx].questionText)}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(questions[currIdx].options || []).map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrectIdx = idx === questions[currIdx].correctOptionIndex;

              let style = "border-slate-200 bg-white hover:border-rose-400 text-slate-700";
              if (isSelected) style = "border-rose-500 bg-rose-50 text-rose-950";
              
              if (hasSub) {
                if (isCorrectIdx) style = "border-emerald-500 bg-emerald-50 text-emerald-950";
                else if (isSelected) style = "border-rose-500 bg-rose-50 text-rose-950";
              }

              return (
                <button
                  key={idx}
                  disabled={hasSub}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-black transition-all text-sm flex items-center justify-between ${style}`}
                >
                  <MathFormula formula={opt} />
                  {hasSub && isCorrectIdx && <Check size={18} className="text-emerald-600" />}
                  {hasSub && isSelected && !isCorrectIdx && <X size={18} className="text-rose-600" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            {!hasSub ? (
              <button
                disabled={selectedOpt === null}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-rose-500 text-white font-black text-sm rounded-xl disabled:opacity-50 shadow-md"
              >
                Leo dốc ⛰️
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-emerald-600 text-white font-black text-sm rounded-xl shadow-md"
              >
                {selectedOpt === questions[currIdx].correctOptionIndex ? "Lên nấc tiếp theo ⛰️" : "Xem kết quả chung cuộc 🌧️"}
              </button>
            )}
          </div>
        </div>
      )}

      {gameState === "won" && (
        <div className="text-center py-10 space-y-6">
          <div className="text-7xl animate-bounce">⛰️🚩🎉</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-rose-600">Đã Chinh Phục Đỉnh Núi!</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto">
              Thật tuyệt vời! Em đã cắm cờ thành công trên đỉnh Everest tri thức toán đại số. Nhận thưởng ngay 50 XP & 25 Xu học bổng!
            </p>
          </div>
          <button onClick={startNewGame} className="px-8 py-3 bg-rose-500 text-white font-black rounded-xl">
            LEO NÚI TRẬN MỚI ⛰️
          </button>
        </div>
      )}

      {gameState === "lost" && (
        <div className="text-center py-10 space-y-6">
          <div className="text-6xl text-slate-300">🌧️🌲</div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-700">Trượt dốc đầy tiếc nuối!</h2>
            <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto">
              Cố gắng rèn luyện thêm tư duy logic và kỹ năng cộng trừ đơn thức, đa thức nhé. Núi cao vẫn đang chờ em quay lại!
            </p>
          </div>
          <button onClick={startNewGame} className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl">
            CHƠI LẠI TRẬN MỚI ⛰️
          </button>
        </div>
      )}
    </div>
  );
}

// Internal SVG Helper
function CrownIcon() {
  return (
    <svg className="w-7 h-7 text-yellow-500 fill-yellow-300" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
