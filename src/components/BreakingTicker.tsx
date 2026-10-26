import React, { useState } from 'react';
import { Zap, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { BreakingTickerItem } from '../types/news';

interface BreakingTickerProps {
  tickers: BreakingTickerItem[];
  onSelectTicker: (ticker: BreakingTickerItem) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ tickers, onSelectTicker }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeTickers = tickers.filter((t) => t.active);

  if (activeTickers.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeTickers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeTickers.length) % activeTickers.length);
  };

  const currentItem = activeTickers[currentIndex] || activeTickers[0];

  return (
    <div className="w-full bg-slate-900 text-white border-y border-red-700/60 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center overflow-hidden">
        {/* Glowing Breaking Badge */}
        <div className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center gap-1.5 shadow-lg select-none z-10 transition">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-300" />
          <span className="tracking-wide uppercase font-bold">ब्रेकिंग न्यूज</span>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden px-3 sm:px-4 py-1.5">
          <div
            onClick={() => onSelectTicker(currentItem)}
            className="cursor-pointer group flex items-center gap-2 truncate text-xs sm:text-sm text-slate-100 hover:text-amber-300 transition duration-150"
            title="संपूर्ण बातमी वाचण्यासाठी येथे क्लिक करा"
          >
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-red-950/80 text-red-300 border border-red-800 font-semibold">
              महत्त्वाची घडामोड
            </span>
            <span className="truncate font-medium group-hover:underline">
              {currentItem.text}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-shrink-0 flex items-center space-x-1 px-2 border-l border-slate-800 text-slate-400 text-xs">
          <span className="hidden md:inline px-1 text-[11px] text-slate-500">
            {currentIndex + 1} / {activeTickers.length}
          </span>
          <button
            onClick={handlePrev}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition"
            aria-label="मागील बातमी"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition"
            aria-label="पुढील बातमी"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
