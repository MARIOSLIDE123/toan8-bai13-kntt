import React, { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { motion, AnimatePresence } from "motion/react";
import { X, Info } from "lucide-react";

interface MathFormulaProps {
  formula: string;
  block?: boolean;
  tooltip?: string;
  key?: React.Key;
}

export default function MathFormula({ formula, block = false, tooltip }: MathFormulaProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  let html = "";
  try {
    html = katex.renderToString(formula, {
      displayMode: block,
      throwOnError: false,
    });
  } catch (error) {
    console.error("KaTeX rendering error:", error);
    html = `<span class="text-red-500 font-mono">${formula}</span>`;
  }

  return (
    <>
      <span
        className={`inline-flex items-center gap-1 group relative ${
          block ? "w-full justify-center my-3 overflow-x-auto py-2" : "inline-block"
        }`}
      >
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsZoomed(true)}
          className={`cursor-zoom-in transition-all duration-150 relative inline-flex items-center rounded-lg p-1 hover:bg-slate-100 ${
            block ? "bg-slate-50/50 px-4 py-2 border border-slate-100 shadow-xs max-w-full overflow-x-auto" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
          title={tooltip || "Chạm để phóng to công thức"}
        />
        
        {tooltip && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow-md whitespace-nowrap pointer-events-none z-50">
            {tooltip}
          </span>
        )}
      </span>

      {/* Lightbox / Zoom modal */}
      <AnimatePresence>
        {isZoomed && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 text-center space-y-6 relative"
            >
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">
                  Cận cảnh Công thức Toán học
                </span>
                <p className="text-xs text-slate-400">Xem chi tiết và thu phóng chuẩn SGK</p>
              </div>

              {/* Display zoomed math formula */}
              <div 
                className="py-10 px-4 bg-slate-50 rounded-2xl border border-slate-100 overflow-x-auto flex items-center justify-center text-xl sm:text-2xl font-semibold text-slate-800"
                dangerouslySetInnerHTML={{ 
                  __html: katex.renderToString(formula, { displayMode: true, throwOnError: false }) 
                }}
              />

              {tooltip && (
                <div className="flex items-start gap-2 bg-blue-50/80 text-blue-700 border border-blue-100 rounded-xl p-3 text-xs text-left">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">Giải thích ký hiệu:</span>
                    <span>{tooltip}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsZoomed(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-blue-100"
              >
                Đóng lại
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function renderTextWithMath(text: string): React.ReactNode {
  if (!text) return null;
  
  // Regex to extract $$...$$ or $...$ including line breaks
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const formula = part.slice(2, -2).trim();
          return <MathFormula key={index} formula={formula} block={true} />;
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const formula = part.slice(1, -1).trim();
          return <MathFormula key={index} formula={formula} block={false} />;
        }
        return <span key={index} className="whitespace-pre-line">{part}</span>;
      })}
    </>
  );
}
