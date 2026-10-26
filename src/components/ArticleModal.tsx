import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Eye,
  Share2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Send,
  User,
  MapPin,
  Calendar,
  Tag,
  ArrowLeft,
  MessageSquare,
  Facebook,
  Twitter,
} from 'lucide-react';
import { Article, NewsComment } from '../types/news';
import { storageService } from '../services/storageService';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onSelectRelated: (article: Article) => void;
  allArticles: Article[];
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onSelectRelated,
  allArticles,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentCity, setCommentCity] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    if (article) {
      storageService.incrementViews(article.id);
      const loadedComments = storageService.getComments(article.id);
      setComments(loadedComments);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Clean up speech synthesis on close
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article?.id]);

  if (!article) return null;

  // Text-To-Speech Marathi / Indian Hindi Voice
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('तुमच्या ब्राउझरमध्ये ऑडिओ वाचन उपलब्ध नाही.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.summary}. ${article.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'mr-IN'; // Marathi language code
      utterance.rate = 0.95;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `📰 *${article.title}*\n\n${article.summary}\n\n👉 *सविस्तर वाचा विचार लहरी न्यूज २४ वर:*\n${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        article.title + ' - विचार लहरी न्यूज २४'
      )}&url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment = storageService.addComment({
      articleId: article.id,
      name: commentName.trim(),
      city: commentCity.trim() || 'महाराष्ट्र',
      text: commentText.trim(),
      formattedDate: 'आत्ताच',
    });

    setComments([newComment, ...comments]);
    setCommentName('');
    setCommentCity('');
    setCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 3000);
  };

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.district === article.district))
    .slice(0, 4);

  // Font size classes
  const contentFontSizeClass =
    fontSize === 'xlarge'
      ? 'text-xl leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg leading-relaxed'
      : 'text-base leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white sm:rounded-2xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 sm:my-auto border border-slate-200">
        {/* Sticky Action Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-slate-700 hover:text-red-600 font-bold text-sm transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>बातम्यांकडे परत</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Audio Reader */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                isSpeaking
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="मराठीत बातमी ऐका"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-600" />}
              <span>{isSpeaking ? 'वाचन थांबवा' : 'बातमी ऐका'}</span>
            </button>

            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-bold text-slate-700">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded ${fontSize === 'normal' ? 'bg-white shadow-xs text-red-600' : ''}`}
                title="सामान्य अक्षर"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded ${fontSize === 'large' ? 'bg-white shadow-xs text-red-600' : ''}`}
                title="मोठे अक्षर"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded ${fontSize === 'xlarge' ? 'bg-white shadow-xs text-red-600' : ''}`}
                title="अतिशय मोठे अक्षर"
              >
                A++
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-full transition"
              aria-label="बंद करा"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Category & Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                {article.category}
              </span>
              {article.district && (
                <span className="bg-blue-900 text-white text-xs font-semibold px-2.5 py-1 rounded">
                  📍 {article.district}
                </span>
              )}
              {article.isBreaking && (
                <span className="bg-amber-400 text-slate-900 text-xs font-black px-2 py-1 rounded animate-pulse">
                  ⚡ ब्रेकिंग न्यूज
                </span>
              )}
              {article.isDemo && (
                <span className="bg-slate-200 text-slate-600 text-[11px] px-2 py-0.5 rounded">
                  नमुना बातमी (Demo)
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-marathi-title leading-tight">
              {article.title}
            </h1>

            {/* Author, Date, Location */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <User className="w-4 h-4 text-red-600" />
                  {article.author} {article.authorRole ? `(${article.authorRole})` : ''}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {article.date}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.views + 1} वाचले
                </span>
              </div>
            </div>
          </div>

          {/* Social Share Bar */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-red-600" />
              <span>मित्र व व्हॉट्सॲप ग्रुपमध्ये शेअर करा:</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>व्हॉट्सॲप</span>
              </button>
              <button
                onClick={handleShareFacebook}
                className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                title="Facebook वर शेअर करा"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareTwitter}
                className="p-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition"
                title="X (Twitter) वर शेअर करा"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
                title="लिंक कॉपी करा"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'कॉपी झाली!' : 'लिंक'}</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <div className="rounded-xl overflow-hidden shadow-md max-h-[480px] bg-slate-900">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover max-h-[480px]"
              />
            </div>
            {article.imageCaption && (
              <p className="text-xs text-slate-500 italic text-center px-4">
                📷 {article.imageCaption}
              </p>
            )}
          </div>

          {/* Summary Quote Box */}
          <div className="border-l-4 border-red-600 bg-red-50/60 p-4 rounded-r-xl">
            <p className="text-sm sm:text-base font-semibold text-slate-800 italic leading-relaxed">
              "{article.summary}"
            </p>
          </div>

          {/* Article Full Content */}
          <div
            className={`text-slate-800 font-sans space-y-4 whitespace-pre-line tracking-wide ${contentFontSizeClass}`}
          >
            {article.content}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> टॅग्ज:
              </span>
              {article.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-md transition cursor-pointer"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Editorial Disclaimer */}
          <div className="p-3 bg-slate-100 text-slate-600 rounded-lg text-xs leading-relaxed border border-slate-200">
            <strong>विचार लहरी न्यूज २४ डिस्क्लेमर:</strong> हे वृत्त संपादक मंडळाच्या मार्गदर्शनाखाली प्रसिद्ध करण्यात आले आहे. आपल्या प्रतिक्रिया किंवा सुधारणेसाठी आमच्याशी संपर्क साधा.
          </div>

          {/* Comments Section */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-marathi-title">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <span>वाचकांच्या प्रतिक्रिया ({comments.length})</span>
              </h3>
            </div>

            {commentSubmitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-semibold">
                ✓ आपली प्रतिक्रिया यशस्वीपणे नोंदवली गेली आहे! धन्यवाद.
              </div>
            )}

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <p className="text-xs font-bold text-slate-700">आपले मत नोंदवा:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="आपले पूर्ण नाव *"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
                <input
                  type="text"
                  placeholder="गाव / शहर (उदा. वाशिम, अकोला)"
                  value={commentCity}
                  onChange={(e) => setCommentCity(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <textarea
                rows={3}
                placeholder="या बातमीबद्दल आपली प्रतिक्रिया लिहा..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                required
              ></textarea>
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>प्रतिक्रिया पाठवा</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {comments.map((c) => (
                <div key={c.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="text-slate-400 text-[11px]">{c.city} • {c.formattedDate}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 font-marathi-title">
                संबंधित आणखी महत्त्वाच्या बातम्या
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="cursor-pointer group flex gap-3 p-3 rounded-xl bg-slate-50 hover:bg-red-50/50 border border-slate-200 transition"
                  >
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-red-600 uppercase">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-700 line-clamp-2 mt-0.5">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {rel.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
