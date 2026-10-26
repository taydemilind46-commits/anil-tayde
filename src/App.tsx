import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Flame,
  Radio,
  FileText,
  Youtube,
  Share2,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ShieldAlert,
  X,
  Sparkles,
  ExternalLink,
  Tag,
  ArrowRight,
  Tv,
} from 'lucide-react';
import {
  Article,
  BreakingTickerItem,
  YouTubeVideoItem,
  EPaperEdition,
  AdBannerItem,
  SiteConfig,
  NewsCategory,
} from './types/news';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { ArticleCard } from './components/ArticleCard';
import { ArticleModal } from './components/ArticleModal';
import { EPaperSection } from './components/EPaperSection';
import { EPaperModal } from './components/EPaperModal';
import { YouTubeSection } from './components/YouTubeSection';
import { AdBanner } from './components/AdBanner';
import { ContactSection } from './components/ContactSection';
import { SearchModal } from './components/SearchModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

export default function App() {
  // App Data from storageService
  const [articles, setArticles] = useState<Article[]>([]);
  const [tickers, setTickers] = useState<BreakingTickerItem[]>([]);
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [epapers, setEpapers] = useState<EPaperEdition[]>([]);
  const [ads, setAds] = useState<AdBannerItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(storageService.getConfig());

  // UI State
  const [currentCategory, setCurrentCategory] = useState<
    NewsCategory | 'व्हिडिओ' | 'ई-पेपर' | 'संपर्क'
  >('सर्व');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedEPaper, setSelectedEPaper] = useState<EPaperEdition | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLiveTvOpen, setIsLiveTvOpen] = useState(false);
  const [showDemoNotice, setShowDemoNotice] = useState(true);

  // Load data on mount
  const refreshData = () => {
    setArticles(storageService.getArticles());
    setTickers(storageService.getTickers());
    setVideos(storageService.getVideos());
    setEpapers(storageService.getEPapers());
    setAds(storageService.getAds());
    setSiteConfig(storageService.getConfig());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered articles for current category
  const filteredArticles = useMemo(() => {
    if (currentCategory === 'सर्व' || currentCategory === 'व्हिडिओ' || currentCategory === 'ई-पेपर' || currentCategory === 'संपर्क') {
      return articles;
    }
    return articles.filter(
      (a) => a.category === currentCategory || a.district?.includes(currentCategory)
    );
  }, [articles, currentCategory]);

  // Derived sets for homepage
  const topStory = useMemo(() => {
    return articles.find((a) => a.isTopStory) || articles[0];
  }, [articles]);

  const trendingStories = useMemo(() => {
    return articles.filter((a) => a.id !== topStory?.id).slice(0, 4);
  }, [articles, topStory]);

  const washimNews = useMemo(() => {
    return articles.filter((a) => a.category === 'वाशिम' || a.district?.includes('वाशिम')).slice(0, 3);
  }, [articles]);

  const akolaNews = useMemo(() => {
    return articles.filter((a) => a.category === 'अकोला' || a.district?.includes('अकोला')).slice(0, 3);
  }, [articles]);

  const vidarbhaNews = useMemo(() => {
    return articles.filter((a) => a.category === 'विदर्भ' || a.district?.includes('विदर्भ')).slice(0, 4);
  }, [articles]);

  const krishiNews = useMemo(() => {
    return articles.filter((a) => a.category === 'कृषी').slice(0, 3);
  }, [articles]);

  const headerAd = ads.find((a) => a.placement === 'header' && a.active);
  const sidebarAd = ads.find((a) => a.placement === 'sidebar' && a.active);
  const inArticleAd = ads.find((a) => a.placement === 'in_article' && a.active);

  // Handle ticker click
  const handleSelectTicker = (ticker: BreakingTickerItem) => {
    if (ticker.articleId) {
      const art = articles.find((a) => a.id === ticker.articleId);
      if (art) {
        setSelectedArticle(art);
        return;
      }
    }
    // Search by ticker text
    setIsSearchOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* 1. Demo Notice Banner (Dismissible) */}
      {showDemoNotice && (
        <div className="bg-amber-400 text-slate-950 text-xs py-1.5 px-4 font-semibold flex items-center justify-between border-b border-amber-500 shadow-xs z-50">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <span className="bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
              नमुना आवृत्ती (Demo)
            </span>
            <span>
              या ॲपमध्ये प्रारंभी प्रात्यक्षिकासाठी नमुना बातम्या लोड केल्या आहेत. आपण वर उजवीकडील <strong>'ॲडमिन'</strong> बटनावर क्लिक करून आपल्या खऱ्या बातम्या, ई-पेपर आणि यूट्यूब व्हिडिओ थेट प्रसिद्ध करू शकता!
            </span>
          </div>
          <button
            onClick={() => setShowDemoNotice(false)}
            className="p-1 hover:bg-amber-500 rounded text-slate-900"
            aria-label="बंद करा"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Main Header */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLiveTv={() => setIsLiveTvOpen(true)}
        siteConfig={siteConfig}
      />

      {/* 3. Breaking News Ticker */}
      <BreakingTicker tickers={tickers} onSelectTicker={handleSelectTicker} />

      {/* 4. Leaderboard Ad Banner (Below Ticker) */}
      {headerAd && (
        <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 mt-3">
          <AdBanner ad={headerAd} />
        </div>
      )}

      {/* 5. Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-5">
        {/* VIEW A: DEDICATED E-PAPER PAGE */}
        {currentCategory === 'ई-पेपर' && (
          <div className="space-y-6">
            <EPaperSection
              editions={epapers}
              onOpenEdition={(edition) => setSelectedEPaper(edition)}
            />
          </div>
        )}

        {/* VIEW B: DEDICATED YOUTUBE VIDEO HUB */}
        {currentCategory === 'व्हिडिओ' && (
          <div className="space-y-6">
            <YouTubeSection videos={videos} siteConfig={siteConfig} />
          </div>
        )}

        {/* VIEW C: DEDICATED CONTACT PAGE */}
        {currentCategory === 'संपर्क' && (
          <div className="space-y-6">
            <ContactSection siteConfig={siteConfig} />
          </div>
        )}

        {/* VIEW D: CATEGORY SPECIFIC LIST (Maharashtra, Washim, Akola, Vidarbha, Politics, Agriculture, Crime, etc.) */}
        {currentCategory !== 'सर्व' &&
          currentCategory !== 'व्हिडिओ' &&
          currentCategory !== 'ई-पेपर' &&
          currentCategory !== 'संपर्क' && (
            <div className="space-y-6">
              {/* Category Breadcrumb & Title */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    विशेष वर्गवारी
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-marathi-title text-slate-900 mt-1">
                    {currentCategory} बातम्या
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentCategory} परिसरातील ताज्या घडामोडी, ब्रेकिंग न्यूज व विशेष वृत्तांत
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-200">
                    {filteredArticles.length} बातम्या उपलब्ध
                  </span>
                </div>
              </div>

              {/* Grid of Articles */}
              {filteredArticles.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
                  <p className="text-base font-bold text-slate-700">
                    या वर्गवारीत सध्या कोणतीही बातमी प्रसिद्ध झालेली नाही.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    संपादक ॲडमिन पॅनेलमधून नवीन बातमी जोडू शकतात.
                  </p>
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="mt-4 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    ॲडमिनमधून बातमी जोडा
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onClick={(art) => setSelectedArticle(art)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        {/* VIEW E: MAIN HOMEPAGE (ALL NEWS) */}
        {currentCategory === 'सर्व' && (
          <div className="space-y-10">
            {/* 1. Hero News & Top Stories Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Big Hero Card (8 cols) */}
              <div className="lg:col-span-8">
                {topStory && (
                  <ArticleCard
                    article={topStory}
                    variant="hero"
                    onClick={(art) => setSelectedArticle(art)}
                  />
                )}
              </div>

              {/* Top Stories List (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <h3 className="text-base font-bold text-slate-900 font-marathi-title flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-red-600" />
                      <span>महत्त्वाच्या ठळक घडामोडी</span>
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {trendingStories.map((art) => (
                      <ArticleCard
                        key={art.id}
                        article={art}
                        variant="horizontal"
                        onClick={(article) => setSelectedArticle(article)}
                      />
                    ))}
                  </div>
                </div>

                {/* WhatsApp Community Quick Join Box */}
                <div className="mt-4 pt-3 border-t border-slate-100 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-950">
                        आमच्या व्हॉट्सॲप ग्रुपमध्ये सामील व्हा!
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        प्रत्येक बातमी मोबाईलवर सर्वात आधी मिळवा
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${siteConfig.contactWhatsapp}?text=${encodeURIComponent(
                        'मला विचार लहरी न्यूज २४ च्या व्हॉट्सॲप ग्रुपमध्ये सामील करा.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition"
                      title="व्हॉट्सॲप ग्रुप जॉईन करा"
                    >
                      <Share2 className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. District Special: Washim & Akola Highlights */}
            <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-red-600 text-white">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold font-marathi-title text-slate-900">
                      वाशिम आणि अकोला विशेष (जिल्हा वार्ता)
                    </h3>
                    <p className="text-xs text-slate-500">
                      वाशिम, कारंजा, रिसोड, मालेगाव, मंगरूळपीर, अकोला परिसरातील ताज्या बातम्या
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentCategory('वाशिम')}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <span>सर्व जिल्हा बातम्या</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...washimNews, ...akolaNews].slice(0, 3).map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={(art) => setSelectedArticle(art)}
                  />
                ))}
              </div>
            </section>

            {/* 3. YouTube Video Channel Showcase */}
            <YouTubeSection videos={videos} siteConfig={siteConfig} />

            {/* 4. Krishi & Farmer News Block (कृषी विशेष व बाजारभाव) */}
            <section className="bg-emerald-950 text-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-emerald-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-emerald-950 text-xs font-black px-2 py-0.5 rounded">
                      बळीराजा विशेष
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold font-marathi-title text-white">
                      कृषी मंच आणि विदर्भ बाजारभाव
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-300 mt-1">
                    सोयाबीन, कापूस, तूर आणि खरीप पिकांचे ताजे बाजारभाव आणि शेती सल्ला
                  </p>
                </div>

                <button
                  onClick={() => setCurrentCategory('कृषी')}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>अधिक कृषी बातम्या</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {krishiNews.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="cursor-pointer group bg-emerald-900/60 hover:bg-emerald-900 rounded-xl overflow-hidden border border-emerald-800 transition flex flex-col justify-between"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-xs text-emerald-200 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[11px] text-emerald-400 border-t border-emerald-800/80">
                        <span>{article.date}</span>
                        <span className="text-amber-400 font-bold group-hover:underline">
                          वाचा ›
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. In-Feed Advertisement Banner */}
            {inArticleAd && (
              <div className="w-full">
                <AdBanner ad={inArticleAd} />
              </div>
            )}

            {/* 6. Digital Newspaper E-Paper Banner */}
            <EPaperSection
              editions={epapers}
              onOpenEdition={(edition) => setSelectedEPaper(edition)}
            />

            {/* 7. Vidarbha & Maharashtra Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg sm:text-xl font-extrabold font-marathi-title text-slate-900">
                  विदर्भ आणि महाराष्ट्र ठळक बातम्या
                </h3>
                <button
                  onClick={() => setCurrentCategory('विदर्भ')}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <span>सर्व बातम्या पहा</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {vidarbhaNews.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={(art) => setSelectedArticle(art)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 6. Modals */}

      {/* A. Full Article Reading Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onSelectRelated={(art) => setSelectedArticle(art)}
        allArticles={articles}
      />

      {/* B. Full E-Paper Reader Modal */}
      <EPaperModal
        edition={selectedEPaper}
        allEditions={epapers}
        onSelectEdition={(ed) => setSelectedEPaper(ed)}
        onClose={() => setSelectedEPaper(null)}
      />

      {/* C. Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={articles}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      {/* D. Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshData={refreshData}
        articles={articles}
        tickers={tickers}
        videos={videos}
        epapers={epapers}
        ads={ads}
        siteConfig={siteConfig}
      />

      {/* E. Live TV News Modal */}
      {isLiveTvOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="p-3.5 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span className="font-bold text-sm font-marathi-title">
                  विचार लहरी न्यूज २४ • थेट प्रक्षेपण (LIVE TV)
                </span>
              </div>
              <button
                onClick={() => setIsLiveTvOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              {/* Display primary YouTube embed or fallback stream */}
              <iframe
                src={`https://www.youtube.com/embed/${videos[0]?.youtubeId || 'dQw4w9WgXcQ'}?autoplay=1&rel=0`}
                title="Live News Stream"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">
                  थेट प्रक्षेपण चालू आहे • विचार लहरी न्यूज २४ यूट्यूब चॅनल
                </p>
                <p className="text-sm font-bold mt-0.5">
                  {videos[0]?.title || 'वाशिम व विदर्भातील आजच्या ताज्या बातम्यांचे थेट विश्लेषण'}
                </p>
              </div>

              <a
                href={siteConfig.youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow"
              >
                <Youtube className="w-4 h-4" />
                <span>यूट्यूबवर सबस्क्राईब करा</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 7. Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        siteConfig={siteConfig}
      />
    </div>
  );
}
