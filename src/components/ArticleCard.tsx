import React from 'react';
import { Clock, Eye, Share2, Tag, ArrowUpRight } from 'lucide-react';
import { Article } from '../types/news';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  variant?: 'hero' | 'grid' | 'horizontal' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onClick,
  variant = 'grid',
}) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `*${article.title}*\n\nसविस्तर वाचा विचार लहरी न्यूज २४ वर:\n${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // 1. HERO VARIANT
  if (variant === 'hero') {
    return (
      <div
        onClick={() => onClick(article)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
            {article.isBreaking && (
              <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider animate-pulse flex items-center gap-1 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                ब्रेकिंग
              </span>
            )}
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded shadow">
              {article.category}
            </span>
            {article.district && (
              <span className="bg-slate-800/80 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded border border-slate-700">
                📍 {article.district}
              </span>
            )}
            {article.isDemo && (
              <span className="bg-slate-700/80 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-600">
                नमुना वृत्त
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-marathi-title leading-snug group-hover:text-amber-300 transition-colors line-clamp-2 sm:line-clamp-3">
            {article.title}
          </h2>

          <p className="hidden sm:block text-slate-300 text-sm md:text-base mt-2 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="text-slate-300 font-medium">✍️ {article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="hidden md:flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {article.views} वाचले
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-xs font-semibold transition"
              title="व्हॉट्सॲपवर शेअर करा"
            >
              <Share2 className="w-3 h-3" />
              <span className="hidden xs:inline">शेअर</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. HORIZONTAL VARIANT (Great for sidebars and trending lists)
  if (variant === 'horizontal') {
    return (
      <div
        onClick={() => onClick(article)}
        className="group cursor-pointer flex gap-3 p-2.5 rounded-xl hover:bg-white transition border border-transparent hover:border-slate-200 hover:shadow-sm"
      >
        <div className="relative w-28 h-20 sm:w-32 sm:h-22 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {article.isBreaking && (
            <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded">
              ब्रेकिंग
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] mb-1">
              <span className="font-bold text-red-600">{article.category}</span>
              {article.district && (
                <span className="text-slate-400">• {article.district}</span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition leading-snug line-clamp-2">
              {article.title}
            </h3>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.date}
            </span>
            <button
              onClick={handleShare}
              className="text-slate-400 hover:text-emerald-600 transition p-1"
              title="शेअर करा"
            >
              <Share2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. COMPACT VARIANT (Text-focused list with bullet)
  if (variant === 'compact') {
    return (
      <div
        onClick={() => onClick(article)}
        className="group cursor-pointer py-2.5 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 px-2 rounded transition"
      >
        <div className="flex items-start gap-2">
          <span className="text-red-600 font-black text-sm mt-0.5">▪</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-800 group-hover:text-red-700 line-clamp-2 leading-snug">
              {article.title}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
              <span className="text-blue-900 font-medium">{article.category}</span>
              <span>•</span>
              <span>{article.date}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. GRID VARIANT (Standard Magazine Card)
  return (
    <div
      onClick={() => onClick(article)}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
            {article.category}
          </span>
          {article.isBreaking && (
            <span className="bg-amber-500 text-slate-900 text-[11px] font-black px-1.5 py-0.5 rounded shadow">
              ⚡ महत्त्वाचे
            </span>
          )}
        </div>
        {article.district && (
          <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-xs font-medium">
            📍 {article.district}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition leading-snug line-clamp-2 font-marathi-title">
            {article.title}
          </h3>
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1 hover:text-emerald-600 text-slate-400 transition"
              title="व्हॉट्सॲपवर शेअर करा"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <span className="text-red-600 group-hover:translate-x-0.5 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
