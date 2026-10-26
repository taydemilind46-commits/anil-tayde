import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Share2,
  Calendar,
  Layers,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { EPaperEdition } from '../types/news';

interface EPaperModalProps {
  edition: EPaperEdition | null;
  allEditions: EPaperEdition[];
  onSelectEdition: (edition: EPaperEdition) => void;
  onClose: () => void;
}

export const EPaperModal: React.FC<EPaperModalProps> = ({
  edition,
  allEditions,
  onSelectEdition,
  onClose,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!edition) return null;

  const pages = edition.pages && edition.pages.length > 0 ? edition.pages : [
    { pageNumber: 1, pageTitle: 'पान १ - मुख्य आवृत्ती', imageUrl: edition.coverImage }
  ];

  const currentPage = pages[currentPageIndex] || pages[0];

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setZoomLevel(1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setZoomLevel(1);
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const handleShareEPaper = () => {
    const text = `📰 *विचार लहरी न्यूज २४ - आजचे ई-वृत्तपत्र*\n\nआवृत्ती: ${edition.editionName} (${edition.date})\n\n👉 *मोफत ई-पेपर वाचण्यासाठी येथे क्लिक करा:*\n${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadPdf = () => {
    if (edition.pdfUrl) {
      window.open(edition.pdfUrl, '_blank');
    } else {
      alert('या आवृत्तीची पीडीएफ लिंक लवकरच उपलब्ध होईल.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white p-1.5 rounded-lg flex items-center justify-center font-bold text-xs">
            ई-पेपर
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white font-marathi-title flex items-center gap-2">
              <span>{edition.editionName}</span>
              <span className="hidden sm:inline-block text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                {edition.date}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {currentPage.pageTitle} • एकूण पाने: {pages.length}
            </p>
          </div>
        </div>

        {/* Edition selector dropdown */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-slate-400">आवृत्ती बदला:</span>
          <select
            value={edition.id}
            onChange={(e) => {
              const selected = allEditions.find((ed) => ed.id === e.target.value);
              if (selected) {
                onSelectEdition(selected);
                setCurrentPageIndex(0);
                setZoomLevel(1);
              }
            }}
            className="bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            {allEditions.map((ed) => (
              <option key={ed.id} value={ed.id}>
                {ed.editionName} ({ed.date})
              </option>
            ))}
          </select>
        </div>

        {/* Right Actions: PDF Download, Share & Close */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {edition.pdfUrl && (
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
              title="वृत्तपत्र PDF डाउनलोड करा"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF डाउनलोड</span>
            </button>
          )}

          <button
            onClick={handleShareEPaper}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow"
            title="व्हॉट्सॲपवर शेअर करा"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">शेअर</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            aria-label="बंद करा"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Newspaper Canvas Viewport */}
      <div className="flex-1 relative overflow-auto bg-slate-950 flex items-center justify-center p-2 sm:p-4">
        {/* Newspaper Page Container */}
        <div
          className="relative bg-white shadow-2xl transition-transform duration-200 ease-out origin-center select-none max-w-4xl w-full border border-slate-700"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={currentPage.imageUrl}
            alt={currentPage.pageTitle}
            className="w-full h-auto block object-contain max-h-[85vh] mx-auto pointer-events-auto"
            draggable={false}
          />
        </div>

        {/* Left / Right Navigation Buttons (Floating) */}
        {currentPageIndex > 0 && (
          <button
            onClick={handlePrevPage}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-red-600 text-white p-2.5 sm:p-3 rounded-full backdrop-blur-xs transition shadow-xl border border-slate-700 z-10"
            title="मागील पान"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {currentPageIndex < pages.length - 1 && (
          <button
            onClick={handleNextPage}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-slate-900/80 hover:bg-red-600 text-white p-2.5 sm:p-3 rounded-full backdrop-blur-xs transition shadow-xl border border-slate-700 z-10"
            title="पुढील पान"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Control Toolbar */}
      <div className="bg-slate-900 border-t border-slate-800 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-white flex-shrink-0">
        {/* Page Switcher Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 hidden sm:inline mr-1">पाने:</span>
          {pages.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentPageIndex(idx);
                setZoomLevel(1);
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded transition ${
                currentPageIndex === idx
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              पान {p.pageNumber}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:text-white text-slate-300 hover:bg-slate-700 rounded transition"
            title="झूम कमी करा"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs px-2 font-mono text-slate-300">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:text-white text-slate-300 hover:bg-slate-700 rounded transition"
            title="झूम वाढवा"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 hover:text-white text-slate-300 hover:bg-slate-700 rounded transition border-l border-slate-700 pl-1.5"
            title="मूळ आकार"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
