import React, { useState, useMemo } from 'react';
import { Search, X, Clock, ArrowRight, Tag } from 'lucide-react';
import { Article, NewsCategory } from '../types/news';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('सर्व');

  const categories: (NewsCategory | 'सर्व')[] = [
    'सर्व',
    'वाशिम',
    'अकोला',
    'विदर्भ',
    'महाराष्ट्र',
    'कृषी',
    'राजकारण',
    'शिक्षण',
    'गुन्हेगारी',
    'क्रीडा',
  ];

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return articles.filter((art) => {
      const matchCat =
        selectedCategory === 'सर्व' ||
        art.category === selectedCategory ||
        art.district === selectedCategory;

      if (!term) return matchCat;

      const inTitle = art.title.toLowerCase().includes(term);
      const inSummary = art.summary.toLowerCase().includes(term);
      const inContent = art.content.toLowerCase().includes(term);
      const inDistrict = art.district ? art.district.toLowerCase().includes(term) : false;
      const inTags = art.tags ? art.tags.some((t) => t.toLowerCase().includes(term)) : false;

      return matchCat && (inTitle || inSummary || inContent || inDistrict || inTags);
    });
  }, [articles, searchTerm, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <Search className="w-5 h-5 text-red-600 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="बातमीचे शीर्षक, गाव, तालुका किंवा विषय शोधा (उदा. सोयाबीन, वाशिम, अकोला)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm sm:text-base bg-transparent border-0 focus:outline-none placeholder:text-slate-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Categories */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-semibold flex-shrink-0">
            <Tag className="w-3 h-3" /> वर्गवारी:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="px-5 py-2 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            {searchResults.length} {searchResults.length === 1 ? 'बातमी सापडली' : 'बातम्या सापडल्या'}
          </span>
          {searchTerm && (
            <span>
              शोध संज्ञा: <strong>"{searchTerm}"</strong>
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {searchResults.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-base font-semibold">कोणतीही बातमी सापडली नाही.</p>
              <p className="text-xs text-slate-400 mt-1">
                कृपया वेगळा शब्द किंवा वर्गवारी निवडून पुन्हा प्रयत्न करा.
              </p>
            </div>
          ) : (
            searchResults.map((article) => (
              <div
                key={article.id}
                onClick={() => {
                  onSelectArticle(article);
                  onClose();
                }}
                className="cursor-pointer group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg flex-shrink-0 bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] mb-1">
                    <span className="font-bold text-red-600">{article.category}</span>
                    {article.district && (
                      <span className="text-slate-400">• {article.district}</span>
                    )}
                    <span className="text-slate-400">• {article.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition leading-snug line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1 hidden sm:block">
                    {article.summary}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 transition flex-shrink-0 mt-2" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
