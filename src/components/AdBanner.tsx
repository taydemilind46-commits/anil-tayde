import React from 'react';
import { ExternalLink, Megaphone } from 'lucide-react';
import { AdBannerItem } from '../types/news';

interface AdBannerProps {
  ad: AdBannerItem | undefined;
  className?: string;
  variant?: 'leaderboard' | 'box' | 'banner';
}

export const AdBanner: React.FC<AdBannerProps> = ({ ad, className = '', variant = 'banner' }) => {
  if (!ad || !ad.active) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-100 border border-slate-300 shadow-xs transition-all hover:border-slate-400 group ${className}`}
    >
      {/* Sponsor Label */}
      <div className="bg-slate-200/90 text-slate-500 text-[10px] font-semibold px-2 py-0.5 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Megaphone className="w-2.5 h-2.5 text-amber-600" />
          प्रायोजित जाहिरात (Advertisement)
        </span>
        <span className="truncate max-w-[150px]">{ad.sponsorName}</span>
      </div>

      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden"
      >
        <div className="relative aspect-[21/6] sm:aspect-[24/5] w-full max-h-28 overflow-hidden bg-slate-200">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent flex items-center p-3 sm:p-4">
            <div className="max-w-md">
              <h4 className="text-xs sm:text-sm md:text-base font-bold text-white drop-shadow font-marathi-title line-clamp-1">
                {ad.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-amber-300 font-semibold mt-0.5 flex items-center gap-1">
                <span>{ad.ctaText || 'अधिक माहितीसाठी संपर्क करा'}</span>
                <ExternalLink className="w-3 h-3" />
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};
