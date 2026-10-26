import React from 'react';
import { FileText, Download, Eye, Calendar, ArrowRight, BookOpen, Share2 } from 'lucide-react';
import { EPaperEdition } from '../types/news';

interface EPaperSectionProps {
  editions: EPaperEdition[];
  onOpenEdition: (edition: EPaperEdition) => void;
}

export const EPaperSection: React.FC<EPaperSectionProps> = ({ editions, onOpenEdition }) => {
  const latestEdition = editions[0];

  if (!latestEdition) return null;

  return (
    <section className="my-8 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl border border-blue-900/50">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Info & Features */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1 shadow">
              <BookOpen className="w-3.5 h-3.5" />
              डिजिटल ई-वृत्तपत्र
            </span>
            <span className="bg-slate-800 text-amber-400 text-xs font-semibold px-2.5 py-1 rounded border border-slate-700">
              दैनिक विचार लहरी
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-marathi-title leading-tight text-white">
            आजचे संपूर्ण वृत्तपत्र वाचा डिजिटल स्वरूपात
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            वाशिम, अकोला, विदर्भ आणि महाराष्ट्राच्या ताज्या बातम्या आता थेट आपल्या मोबाईलवर. पानांची अदलाबदल करा, झूम करून वाचा किंवा पीडीएफ डाउनलोड करून ऑफलाइन जतन करा.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenEdition(latestEdition)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition transform hover:-translate-y-0.5"
            >
              <Eye className="w-4 h-4" />
              <span>आजचा ई-पेपर उघडा</span>
            </button>

            {latestEdition.pdfUrl && (
              <a
                href={latestEdition.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>PDF डाउनलोड ({latestEdition.fileSizeBytes || 'PDF'})</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-red-400" />
              {latestEdition.date}
            </span>
            <span>•</span>
            <span>आवृत्ती: {latestEdition.editionName}</span>
            <span>•</span>
            <span>एकूण पाने: {latestEdition.totalPages || 4}</span>
          </div>
        </div>

        {/* Right: Cover Preview Mockup */}
        <div
          onClick={() => onOpenEdition(latestEdition)}
          className="cursor-pointer group relative w-full max-w-xs sm:max-w-sm rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-white transform transition-transform duration-300 group-hover:scale-102"
        >
          <img
            src={latestEdition.coverImage}
            alt={latestEdition.editionName}
            className="w-full h-auto object-cover max-h-96 group-hover:opacity-95 transition"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              पूर्ण वृत्तपत्र वाचा
            </span>
          </div>
        </div>
      </div>

      {/* Archive / Other Editions Grid */}
      {editions.length > 1 && (
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            मागील आवृत्त्या (Archived Editions):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {editions.map((ed) => (
              <div
                key={ed.id}
                onClick={() => onOpenEdition(ed)}
                className="cursor-pointer p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 transition flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white truncate">{ed.editionName}</p>
                  <p className="text-[11px] text-slate-400">{ed.date}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
