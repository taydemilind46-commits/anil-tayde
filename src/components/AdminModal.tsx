import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit,
  FileText,
  Youtube,
  Zap,
  DollarSign,
  Settings,
  HelpCircle,
  Save,
  CheckCircle,
  AlertCircle,
  LogOut,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  BookOpen,
  Download,
  Database,
  RefreshCw,
} from 'lucide-react';
import {
  Article,
  BreakingTickerItem,
  YouTubeVideoItem,
  EPaperEdition,
  AdBannerItem,
  SiteConfig,
  NewsCategory,
} from '../types/news';
import { storageService } from '../services/storageService';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
  articles: Article[];
  tickers: BreakingTickerItem[];
  videos: YouTubeVideoItem[];
  epapers: EPaperEdition[];
  ads: AdBannerItem[];
  siteConfig: SiteConfig;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
  articles,
  tickers,
  videos,
  epapers,
  ads,
  siteConfig,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'articles' | 'epapers' | 'videos' | 'tickers' | 'ads' | 'settings' | 'guide'
  >('articles');

  // Success notice
  const [toastMessage, setToastMessage] = useState<string>('');

  // 1. Article Form State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artSummary, setArtSummary] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState<NewsCategory>('महाराष्ट्र');
  const [artDistrict, setArtDistrict] = useState('वाशिम');
  const [artAuthor, setArtAuthor] = useState(siteConfig.editorName);
  const [artImageUrl, setArtImageUrl] = useState('');
  const [artIsBreaking, setArtIsBreaking] = useState(false);
  const [artIsTopStory, setArtIsTopStory] = useState(false);

  // 2. EPaper Form State
  const [epaperEditionName, setEpaperEditionName] = useState('वाशिम मुख्य आवृत्ती');
  const [epaperDate, setEpaperDate] = useState('२६ ऑक्टोबर २०२६');
  const [epaperPdfUrl, setEpaperPdfUrl] = useState('');
  const [epaperCoverImage, setEpaperCoverImage] = useState('');
  const [epaperPage2Image, setEpaperPage2Image] = useState('');
  const [epaperPage3Image, setEpaperPage3Image] = useState('');
  const [epaperPage4Image, setEpaperPage4Image] = useState('');

  // 3. YouTube Form State
  const [ytTitle, setYtTitle] = useState('');
  const [ytIdOrUrl, setYtIdOrUrl] = useState('');
  const [ytDesc, setYtDesc] = useState('');
  const [ytCategory, setYtCategory] = useState('थेट प्रक्षेपण / Live');
  const [ytDuration, setYtDuration] = useState('१५:००');

  // 4. Ticker Form State
  const [tickerText, setTickerText] = useState('');

  // 5. Ad Form State
  const [adTitle, setAdTitle] = useState('');
  const [adSponsor, setAdSponsor] = useState('');
  const [adPlacement, setAdPlacement] = useState<'header' | 'sidebar' | 'in_article'>('header');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adTargetUrl, setAdTargetUrl] = useState('');

  // 6. Config Form State
  const [cfgChannelName, setCfgChannelName] = useState(siteConfig.channelName);
  const [cfgTagline, setCfgTagline] = useState(siteConfig.tagline);
  const [cfgEditor, setCfgEditor] = useState(siteConfig.editorName);
  const [cfgYoutubeUrl, setCfgYoutubeUrl] = useState(siteConfig.youtubeChannelUrl);
  const [cfgPhone, setCfgPhone] = useState(siteConfig.contactPhone);
  const [cfgWhatsapp, setCfgWhatsapp] = useState(siteConfig.contactWhatsapp);
  const [cfgEmail, setCfgEmail] = useState(siteConfig.contactEmail);
  const [cfgAddress, setCfgAddress] = useState(siteConfig.officeAddress);
  const [newAdminPass, setNewAdminPass] = useState('');

  useEffect(() => {
    setIsAuthenticated(storageService.isAdminLoggedIn());
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (storageService.verifyAdmin(passwordInput)) {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('आपले स्वागत आहे! ॲडमिन पॅनेल सुरू झाले आहे.');
    } else {
      setAuthError('पासवर्ड चुकीचा आहे! कृपया योग्य पासवर्ड प्रविष्ट करा.');
    }
  };

  const handleLogout = () => {
    storageService.logoutAdmin();
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Helper to extract YouTube ID
  const extractYouTubeId = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed.includes('/') && !trimmed.includes('?')) return trimmed;
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : trimmed;
  };

  // 1. Save Article
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim() || !artContent.trim()) {
      alert('कृपया बातमीचे शीर्षक आणि सविस्तर मजकूर भरा.');
      return;
    }

    const defaultImg =
      artImageUrl.trim() ||
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

    storageService.saveArticle({
      id: editingArticleId || undefined,
      title: artTitle.trim(),
      summary: artSummary.trim() || artTitle.trim().slice(0, 100),
      content: artContent.trim(),
      category: artCategory,
      district: artDistrict.trim(),
      author: artAuthor.trim() || siteConfig.editorName,
      date: new Date().toLocaleDateString('mr-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      imageUrl: defaultImg,
      isBreaking: artIsBreaking,
      isTopStory: artIsTopStory,
      isFeatured: true,
      tags: [artCategory, artDistrict],
    });

    // Reset Form
    setEditingArticleId(null);
    setArtTitle('');
    setArtSummary('');
    setArtContent('');
    setArtImageUrl('');
    setArtIsBreaking(false);
    setArtIsTopStory(false);
    onRefreshData();
    showToast(editingArticleId ? 'बातमी यशस्वीरीत्या अद्ययावत केली!' : 'नवीन बातमी प्रसिद्ध केली!');
  };

  const handleEditArticle = (art: Article) => {
    setEditingArticleId(art.id);
    setArtTitle(art.title);
    setArtSummary(art.summary);
    setArtContent(art.content);
    setArtCategory(art.category);
    setArtDistrict(art.district || 'वाशिम');
    setArtAuthor(art.author);
    setArtImageUrl(art.imageUrl);
    setArtIsBreaking(!!art.isBreaking);
    setArtIsTopStory(!!art.isTopStory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('तुम्हाला खात्री आहे का की ही बातमी हटवायची आहे?')) {
      storageService.deleteArticle(id);
      onRefreshData();
      showToast('बातमी हटवली गेली!');
    }
  };

  // 2. Save EPaper
  const handleSaveEPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!epaperEditionName.trim()) return;

    const cover =
      epaperCoverImage.trim() ||
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

    const pages = [
      { pageNumber: 1, pageTitle: 'पान १ - मुख्य बातमी व संपादकीय', imageUrl: cover },
      {
        pageNumber: 2,
        pageTitle: 'पान २ - जिल्हा व तालुका वार्ता',
        imageUrl:
          epaperPage2Image.trim() ||
          'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        pageNumber: 3,
        pageTitle: 'पान ३ - कृषी व बाजारभाव विशेष',
        imageUrl:
          epaperPage3Image.trim() ||
          'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
      },
      {
        pageNumber: 4,
        pageTitle: 'पान ४ - क्रीडा, मनोरंजन व जाहिराती',
        imageUrl:
          epaperPage4Image.trim() ||
          'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      },
    ];

    storageService.saveEPaper({
      editionName: epaperEditionName.trim(),
      date: epaperDate.trim(),
      isoDate: new Date().toISOString().slice(0, 10),
      city: epaperEditionName.includes('अकोला') ? 'अकोला' : 'वाशिम',
      coverImage: cover,
      pdfUrl:
        epaperPdfUrl.trim() ||
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileSizeBytes: '३.० MB',
      totalPages: 4,
      pages,
    });

    setEpaperPdfUrl('');
    setEpaperCoverImage('');
    setEpaperPage2Image('');
    setEpaperPage3Image('');
    setEpaperPage4Image('');
    onRefreshData();
    showToast('नवीन ई-वृत्तपत्र आवृत्ती यशस्वीपणे जोडली!');
  };

  const handleDeleteEPaper = (id: string) => {
    if (window.confirm('ही ई-पेपर आवृत्ती हटवायची आहे का?')) {
      storageService.deleteEPaper(id);
      onRefreshData();
      showToast('ई-पेपर आवृत्ती हटवली!');
    }
  };

  // 3. Save YouTube Video
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytTitle.trim() || !ytIdOrUrl.trim()) return;

    const cleanId = extractYouTubeId(ytIdOrUrl);

    storageService.saveVideo({
      youtubeId: cleanId,
      title: ytTitle.trim(),
      description: ytDesc.trim() || 'विचार लहरी न्यूज २४ विशेष व्हिडिओ रिपोर्ट.',
      category: ytCategory,
      duration: ytDuration.trim() || '१०:००',
      views: '१.२ हजार',
      publishedDate: 'आत्ताच',
      isLive: ytCategory.includes('Live'),
    });

    setYtTitle('');
    setYtIdOrUrl('');
    setYtDesc('');
    onRefreshData();
    showToast('नवीन यूट्यूब व्हिडिओ जोडला गेला!');
  };

  const handleDeleteVideo = (id: string) => {
    if (window.confirm('हा व्हिडिओ हटवायचा आहे का?')) {
      storageService.deleteVideo(id);
      onRefreshData();
      showToast('व्हिडिओ हटवला!');
    }
  };

  // 4. Save Ticker
  const handleSaveTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerText.trim()) return;

    storageService.saveTicker({
      text: tickerText.trim(),
      priority: 'high',
      active: true,
    });

    setTickerText('');
    onRefreshData();
    showToast('ब्रेकिंग न्यूज पट्टीवर जोडली गेली!');
  };

  const handleDeleteTicker = (id: string) => {
    storageService.deleteTicker(id);
    onRefreshData();
    showToast('पट्टी बातमी हटवली!');
  };

  // 5. Save Ad
  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adImageUrl.trim()) return;

    storageService.saveAd({
      title: adTitle.trim(),
      sponsorName: adSponsor.trim() || 'स्थानिक प्रायोजक',
      placement: adPlacement,
      imageUrl: adImageUrl.trim(),
      targetUrl: adTargetUrl.trim() || 'tel:+919823456789',
      active: true,
      ctaText: 'संपर्क करा',
    });

    setAdTitle('');
    setAdSponsor('');
    setAdImageUrl('');
    setAdTargetUrl('');
    onRefreshData();
    showToast('जाहिरात बॅनर जोडला गेला!');
  };

  const handleDeleteAd = (id: string) => {
    storageService.deleteAd(id);
    onRefreshData();
    showToast('जाहिरात हटवली!');
  };

  // 6. Save Config
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveConfig({
      channelName: cfgChannelName,
      tagline: cfgTagline,
      editorName: cfgEditor,
      youtubeChannelUrl: cfgYoutubeUrl,
      contactPhone: cfgPhone,
      contactWhatsapp: cfgWhatsapp,
      contactEmail: cfgEmail,
      officeAddress: cfgAddress,
    });

    if (newAdminPass.trim()) {
      storageService.updateAdminPassword(newAdminPass.trim());
      setNewAdminPass('');
    }

    onRefreshData();
    showToast('सेटिंग्ज यशस्वीरीत्या जतन केल्या!');
  };

  const handleBackupExport = () => {
    const dataStr = storageService.exportBackupData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VicharLahari_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const handleResetData = () => {
    if (window.confirm('तुम्हाला खरोखर सर्व नमुना डेटा मूळ स्थितीमध्ये रिसेट करायचा आहे का?')) {
      storageService.resetToDefaults();
      onRefreshData();
      showToast('डेटा मूळ स्थितीत रिसेट केला!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-sm">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-marathi-title">
                संपादक नियंत्रण कक्ष (Admin Panel)
              </h2>
              <p className="text-[11px] text-slate-400">
                विचार लहरी न्यूज २४ • बातम्या, वृत्तपत्र आणि चॅनल व्यवस्थापन
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
                title="लॉगआउट करा"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">लॉगआउट</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              aria-label="बंद करा"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Section */}
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 font-marathi-title">
                संपादक लॉगिन
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                बातम्या प्रसिद्ध करण्यासाठी, ई-पेपर अपलोड करण्यासाठी आणि चॅनल सेटिंग्ज बदलण्यासाठी लॉगिन करा.
              </p>
            </div>

            {authError && (
              <div className="w-full p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ॲडमिन गुप्त पासवर्ड / PIN:
                </label>
                <input
                  type="password"
                  required
                  placeholder="पासवर्ड टाका (डिफॉल्ट: vichar24)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>

              <div className="bg-slate-100 p-3 rounded-xl text-left border border-slate-200">
                <p className="text-[11px] text-slate-600">
                  🔑 <strong>डिफॉल्ट ॲडमिन पासवर्ड:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-mono font-bold">vichar24</code>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  (लॉगिन झाल्यानंतर तुम्ही सेटिंग्जमधून हा पासवर्ड बदलू शकता)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition"
              >
                लॉगिन करा
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar text-xs font-bold flex-shrink-0">
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                  activeTab === 'articles'
                    ? 'border-red-600 text-red-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>बातम्या व्यवस्थापन ({articles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('epapers')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                  activeTab === 'epapers'
                    ? 'border-red-600 text-red-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>ई-वृत्तपत्र / PDFs ({epapers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                  activeTab === 'videos'
                    ? 'border-red-600 text-red-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Youtube className="w-4 h-4 text-red-600" />
                <span>यूट्यूब व्हिडिओ ({videos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('tickers')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                  activeTab === 'tickers'
                    ? 'border-red-600 text-red-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>ब्रेकिंग पट्टी ({tickers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ads')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                  activeTab === 'ads'
                    ? 'border-red-600 text-red-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>जाहिराती ({ads.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-red-600 text-red-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>सेटिंग्ज व बॅकअप</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'border-red-600 text-red-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>मदत व वापर मार्गदर्शक</span>
              </button>
            </div>

            {/* Tab Contents (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
              {/* TAB 1: ARTICLES */}
              {activeTab === 'articles' && (
                <div className="space-y-6">
                  {/* Article Form */}
                  <form
                    onSubmit={handleSaveArticle}
                    className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-marathi-title">
                        <Plus className="w-5 h-5 text-red-600" />
                        <span>
                          {editingArticleId ? 'बातमी संपादित करा' : 'नवीन बातमी प्रसिद्ध करा'}
                        </span>
                      </h3>
                      {editingArticleId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArticleId(null);
                            setArtTitle('');
                            setArtSummary('');
                            setArtContent('');
                            setArtImageUrl('');
                          }}
                          className="text-xs text-slate-500 hover:text-red-600 underline"
                        >
                          रद्द करा
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          बातमीचे ठळक शीर्षक *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. वाशिम बाजार समितीत सोयाबीन खरेदीला वेग..."
                          value={artTitle}
                          onChange={(e) => setArtTitle(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          वर्गवारी (Category) *
                        </label>
                        <select
                          value={artCategory}
                          onChange={(e) => setArtCategory(e.target.value as NewsCategory)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                        >
                          <option value="वाशिम">वाशिम</option>
                          <option value="अकोला">अकोला</option>
                          <option value="विदर्भ">विदर्भ</option>
                          <option value="महाराष्ट्र">महाराष्ट्र</option>
                          <option value="देश">देश</option>
                          <option value="राजकारण">राजकारण</option>
                          <option value="कृषी">कृषी</option>
                          <option value="शिक्षण">शिक्षण</option>
                          <option value="गुन्हेगारी">गुन्हेगारी</option>
                          <option value="क्रीडा">क्रीडा</option>
                          <option value="मनोरंजन">मनोरंजन</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          गाव / जिल्हा / ठिकाण
                        </label>
                        <input
                          type="text"
                          placeholder="उदा. वाशिम, कारंजा, अकोला"
                          value={artDistrict}
                          onChange={(e) => setArtDistrict(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          वार्ताहर / प्रतिनिधीचे नाव
                        </label>
                        <input
                          type="text"
                          value={artAuthor}
                          onChange={(e) => setArtAuthor(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          फोटो लिंक (Image URL)
                        </label>
                        <input
                          type="url"
                          placeholder="https://... किंवा रिकामे ठेवा (आपोआप फोटो लागेल)"
                          value={artImageUrl}
                          onChange={(e) => setArtImageUrl(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        थोडक्यात सारांश (Short Summary)
                      </label>
                      <input
                        type="text"
                        placeholder="बातमीचा २-३ ओळींचा सारांश..."
                        value={artSummary}
                        onChange={(e) => setArtSummary(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        सविस्तर बातमीचा मजकूर *
                      </label>
                      <textarea
                        rows={6}
                        required
                        placeholder="बातमीचा सविस्तर तपशील येथे लिहा..."
                        value={artContent}
                        onChange={(e) => setArtContent(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white leading-relaxed"
                      ></textarea>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={artIsBreaking}
                          onChange={(e) => setArtIsBreaking(e.target.checked)}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <span className="text-red-600">⚡ ब्रेकिंग न्यूज म्हणून दाखवा</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={artIsTopStory}
                          onChange={(e) => setArtIsTopStory(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>⭐ मुख्य पानावर अग्रभागी (Top Story) ठेवा</span>
                      </label>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingArticleId ? 'बदल जतन करा' : 'बातमी प्रसिद्ध करा'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Articles Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        प्रसिद्ध झालेल्या सर्व बातम्या ({articles.length})
                      </h4>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                      {articles.map((art) => (
                        <div
                          key={art.id}
                          className="p-3 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={art.imageUrl}
                              alt=""
                              className="w-12 h-10 object-cover rounded flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{art.title}</p>
                              <p className="text-[11px] text-slate-400">
                                {art.category} • {art.date} • {art.author}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              onClick={() => handleEditArticle(art)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="संपादित करा"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded"
                              title="हटवा"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EPAPERS */}
              {activeTab === 'epapers' && (
                <div className="space-y-6">
                  <form
                    onSubmit={handleSaveEPaper}
                    className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                  >
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-marathi-title border-b border-slate-100 pb-3">
                      <BookOpen className="w-5 h-5 text-red-600" />
                      <span>नवीन डिजिटल वृत्तपत्र (E-Paper) आवृत्ती जोडा</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          आवृत्तीचे नाव (Edition Name) *
                        </label>
                        <input
                          type="text"
                          required
                          value={epaperEditionName}
                          onChange={(e) => setEpaperEditionName(e.target.value)}
                          placeholder="उदा. वाशिम मुख्य आवृत्ती किंवा अकोला विशेष"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          तारीख (Date) *
                        </label>
                        <input
                          type="text"
                          required
                          value={epaperDate}
                          onChange={(e) => setEpaperDate(e.target.value)}
                          placeholder="उदा. २६ ऑक्टोबर २०२६"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        वृत्तपत्र PDF लिंक (Google Drive / थेट PDF URL)
                      </label>
                      <input
                        type="url"
                        value={epaperPdfUrl}
                        onChange={(e) => setEpaperPdfUrl(e.target.value)}
                        placeholder="https://drive.google.com/... किंवा आपल्या होस्टिंगवरील PDF लिंक"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        💡 <strong>मार्गदर्शन:</strong> तुम्ही तुमची PDF गुगल ड्राइव्हवर अपलोड करून 'Anyone with link can view' करू शकता आणि ती लिंक येथे टाकू शकता.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          पान १ (मुख्य मुखपृष्ठ फोटो लिंक)
                        </label>
                        <input
                          type="url"
                          value={epaperCoverImage}
                          onChange={(e) => setEpaperCoverImage(e.target.value)}
                          placeholder="मुखपृष्ठाची इमेज लिंक (रिकामे ठेवल्यास नमुना फोटो लागेल)"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          पान २ फोटो लिंक
                        </label>
                        <input
                          type="url"
                          value={epaperPage2Image}
                          onChange={(e) => setEpaperPage2Image(e.target.value)}
                          placeholder="दुसऱ्या पानाची इमेज लिंक"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>ई-वृत्तपत्र जोडा</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing EPapers */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase">
                      उपलब्ध ई-पेपर आवृत्त्या ({epapers.length})
                    </h4>
                    <div className="space-y-2">
                      {epapers.map((ep) => (
                        <div
                          key={ep.id}
                          className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-200"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{ep.editionName}</p>
                            <p className="text-[11px] text-slate-500">
                              तारीख: {ep.date} • एकूण पाने: {ep.totalPages} •{' '}
                              <a
                                href={ep.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-red-600 underline"
                              >
                                PDF पहा
                              </a>
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteEPaper(ep.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VIDEOS */}
              {activeTab === 'videos' && (
                <div className="space-y-6">
                  <form
                    onSubmit={handleSaveVideo}
                    className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                  >
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-marathi-title border-b border-slate-100 pb-3">
                      <Youtube className="w-5 h-5 text-red-600" />
                      <span>नवीन यूट्यूब व्हिडिओ जोडा</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          व्हिडिओचे शीर्षक *
                        </label>
                        <input
                          type="text"
                          required
                          value={ytTitle}
                          onChange={(e) => setYtTitle(e.target.value)}
                          placeholder="उदा. वाशिममधील आजच्या ताज्या बातम्या थेट..."
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          यूट्यूब व्हिडिओ लिंक किंवा ID *
                        </label>
                        <input
                          type="text"
                          required
                          value={ytIdOrUrl}
                          onChange={(e) => setYtIdOrUrl(e.target.value)}
                          placeholder="उदा. https://youtu.be/dQw4w9WgXcQ किंवा dQw4w9WgXcQ"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          वर्गवारी
                        </label>
                        <select
                          value={ytCategory}
                          onChange={(e) => setYtCategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        >
                          <option value="थेट प्रक्षेपण / Live">थेट प्रक्षेपण / Live</option>
                          <option value="ग्राउंड रिपोर्ट">ग्राउंड रिपोर्ट</option>
                          <option value="विशेष बातमी">विशेष बातमी</option>
                          <option value="मुलाखत">मुलाखत</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          कालावधी (Duration)
                        </label>
                        <input
                          type="text"
                          value={ytDuration}
                          onChange={(e) => setYtDuration(e.target.value)}
                          placeholder="उदा. १२:४०"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>व्हिडिओ जोडा</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Videos */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase">
                      सध्याचे यूट्यूब व्हिडिओ ({videos.length})
                    </h4>
                    <div className="space-y-2">
                      {videos.map((vid) => (
                        <div
                          key={vid.id}
                          className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="p-2 bg-red-600 text-white rounded-md">
                              <Youtube className="w-4 h-4" />
                            </span>
                            <div>
                              <p className="font-bold text-slate-900">{vid.title}</p>
                              <p className="text-[11px] text-slate-500">
                                ID: {vid.youtubeId} • {vid.category} • {vid.duration}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TICKERS */}
              {activeTab === 'tickers' && (
                <div className="space-y-6">
                  <form
                    onSubmit={handleSaveTicker}
                    className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                  >
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-marathi-title border-b border-slate-100 pb-3">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <span>नवीन ब्रेकिंग पट्टी हेडलाईन जोडा</span>
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ब्रेकिंग न्यूज संदेश (Ticker Text) *
                      </label>
                      <input
                        type="text"
                        required
                        value={tickerText}
                        onChange={(e) => setTickerText(e.target.value)}
                        placeholder="उदा. वाशिम जिल्ह्यात जोरदार पाऊस, शेतकऱ्यांनी सतर्कतेचा इशारा..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>पट्टीवर प्रसिद्ध करा</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Tickers */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase">
                      सध्या कार्यरत ब्रेकिंग हेडलाईन्स ({tickers.length})
                    </h4>
                    <div className="space-y-2">
                      {tickers.map((t) => (
                        <div
                          key={t.id}
                          className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-200"
                        >
                          <span className="font-medium text-slate-800 flex-1">{t.text}</span>
                          <button
                            onClick={() => handleDeleteTicker(t.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 rounded ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ADS */}
              {activeTab === 'ads' && (
                <div className="space-y-6">
                  <form
                    onSubmit={handleSaveAd}
                    className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                  >
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-marathi-title border-b border-slate-100 pb-3">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <span>नवीन प्रायोजित जाहिरात बॅनर (Ad Monetization) जोडा</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          जाहिरातीचे शीर्षक *
                        </label>
                        <input
                          type="text"
                          required
                          value={adTitle}
                          onChange={(e) => setAdTitle(e.target.value)}
                          placeholder="उदा. हॉटेल राजवाडा, वाशिम"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          प्रायोजकाचे नाव
                        </label>
                        <input
                          type="text"
                          value={adSponsor}
                          onChange={(e) => setAdSponsor(e.target.value)}
                          placeholder="उदा. राजवाडा ग्रुप"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          बॅनर इमेज URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={adImageUrl}
                          onChange={(e) => setAdImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          क्लिक केल्यावर उघडणारी लिंक किंवा फोन (उदा. tel:9823456789)
                        </label>
                        <input
                          type="text"
                          value={adTargetUrl}
                          onChange={(e) => setAdTargetUrl(e.target.value)}
                          placeholder="tel:+919823456789 किंवा वेबसाईट URL"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>जाहिरात सक्रिय करा</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Ads */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase">
                      सध्याच्या जाहिराती ({ads.length})
                    </h4>
                    <div className="space-y-2">
                      {ads.map((ad) => (
                        <div
                          key={ad.id}
                          className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-200"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{ad.title}</p>
                            <p className="text-[11px] text-slate-500">
                              प्रायोजक: {ad.sponsorName} • जागा: {ad.placement}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SETTINGS & BACKUP */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <form
                    onSubmit={handleSaveConfig}
                    className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                  >
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-marathi-title border-b border-slate-100 pb-3">
                      <Settings className="w-5 h-5 text-slate-700" />
                      <span>चॅनल माहिती व संपर्क सेटिंग्ज</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          चॅनलचे नाव
                        </label>
                        <input
                          type="text"
                          value={cfgChannelName}
                          onChange={(e) => setCfgChannelName(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          टॅगलाईन (Tagline)
                        </label>
                        <input
                          type="text"
                          value={cfgTagline}
                          onChange={(e) => setCfgTagline(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          मुख्य संपादक नाव
                        </label>
                        <input
                          type="text"
                          value={cfgEditor}
                          onChange={(e) => setCfgEditor(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          आपले अधिकृत यूट्यूब चॅनल लिंक *
                        </label>
                        <input
                          type="url"
                          value={cfgYoutubeUrl}
                          onChange={(e) => setCfgYoutubeUrl(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          संपर्क फोन
                        </label>
                        <input
                          type="text"
                          value={cfgPhone}
                          onChange={(e) => setCfgPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          व्हॉट्सॲप नंबर (फक्त अंक)
                        </label>
                        <input
                          type="text"
                          value={cfgWhatsapp}
                          onChange={(e) => setCfgWhatsapp(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          अधिकृत ईमेल
                        </label>
                        <input
                          type="email"
                          value={cfgEmail}
                          onChange={(e) => setCfgEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        कार्यालयीन पत्ता
                      </label>
                      <input
                        type="text"
                        value={cfgAddress}
                        onChange={(e) => setCfgAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        नवीन ॲडमिन पासवर्ड सेट करा (बदलायचा असल्यास)
                      </label>
                      <input
                        type="password"
                        placeholder="रिकामे ठेवल्यास जुना पासवर्ड राहील"
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        className="w-full sm:w-1/2 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition"
                      >
                        <Save className="w-4 h-4" />
                        <span>सेटिंग्ज जतन करा</span>
                      </button>
                    </div>
                  </form>

                  {/* Backup & Restore Panel */}
                  <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-marathi-title">
                      <Database className="w-5 h-5 text-blue-600" />
                      <span>डेटा बॅकअप आणि सुरक्षितता</span>
                    </h3>
                    <p className="text-xs text-slate-600">
                      आपल्या सर्व बातम्या, ई-पेपर आणि व्हिडिओंची संपूर्ण माहिती सुरक्षित ठेवण्यासाठी बॅकअप डाउनलोड करा किंवा मूळ स्थितीमध्ये रिसेट करा.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={handleBackupExport}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow"
                      >
                        <Download className="w-4 h-4" />
                        <span>संपूर्ण बॅकअप JSON डाउनलोड करा</span>
                      </button>

                      <button
                        onClick={handleResetData}
                        className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>मूळ नमुना डेटा रिसेट करा</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: GUIDE (HOW TO ADD REAL YOUTUBE & PDFS & DEPLOY) */}
              {activeTab === 'guide' && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-xl font-bold text-slate-900 font-marathi-title text-red-600">
                      📖 'विचार लहरी न्यूज २४' वापर मार्गदर्शिका व मोफत ऑनलाईन पब्लिशिंग
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      आपले खरे वृत्तपत्र, खरे यूट्यूब चॅनल कसे जोडायचे आणि ॲप इंटरनेटवर मोफत कसे चालवायचे याचे सोपे टप्पे:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                          १
                        </span>
                        <span>आपले खरे यूट्यूब चॅनल आणि व्हिडिओ कसे जोडायचे?</span>
                      </h4>
                      <ol className="list-decimal pl-6 space-y-1 text-slate-700 text-xs">
                        <li>
                          <strong>सेटिंग्ज टॅब:</strong> 'सेटिंग्ज व बॅकअप' वर जाऊन "आपले अधिकृत यूट्यूब चॅनल लिंक" मध्ये तुमच्या चॅनलची लिंक (उदा. <code>https://youtube.com/@VicharLahariNews24</code>) टाका आणि सेव्ह करा.
                        </li>
                        <li>
                          <strong>व्हिडिओ जोडणे:</strong> 'यूट्यूब व्हिडिओ' टॅबवर जाऊन तुमच्या कोणत्याही व्हिडिओची लिंक (उदा. <code>https://youtu.be/abc123xyz</code>) टाका. ॲप आपोआप व्हिडिओ प्लेयर आणि थंबनेल तयार करेल!
                        </li>
                        <li>
                          <strong>थेट प्रक्षेपण (LIVE):</strong> जेव्हा तुम्ही यूट्यूबवर लाईव्ह असाल, तेव्हा वर्गवारीमध्ये "थेट प्रक्षेपण / Live" निवडा. मुख्य पानावर 'LIVE' बॅजसह व्हिडिओ दिसेल.
                        </li>
                      </ol>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                          २
                        </span>
                        <span>खरे वृत्तपत्र (E-Paper) आणि PDF मोफत कसे अपलोड करायचे?</span>
                      </h4>
                      <ol className="list-decimal pl-6 space-y-1 text-slate-700 text-xs">
                        <li>
                          तुमच्या वृत्तपत्राची PDF फाईल तुमच्या मोफत <strong>Google Drive</strong> वर अपलोड करा.
                        </li>
                        <li>
                          त्या फाईलवर राईट-क्लिक करून <strong>Share ➔ Anyone with the link</strong> करा आणि 'Copy link' वर क्लिक करा.
                        </li>
                        <li>
                          येथे ॲडमिन पॅनेलमध्ये <strong>'ई-वृत्तपत्र / PDFs'</strong> टॅब उघडून ती लिंक "वृत्तपत्र PDF लिंक" मध्ये पेस्ट करा.
                        </li>
                        <li>
                          वाचकांना थेट ई-पेपर वाचता येईल आणि एका क्लिकवर PDF डाऊनलोडही करता येईल!
                        </li>
                      </ol>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                          ३
                        </span>
                        <span>हे ॲप इंटरनेटवर मोफत कसे पब्लिश (लाईव्ह) करायचे?</span>
                      </h4>
                      <p className="text-slate-700 text-xs">
                        हे ॲप पूर्णपणे आधुनिक वेब तंत्रज्ञानावर (React + Vite + Tailwind) तयार आहे, त्यामुळे ते शून्य खर्चात खालील मोफत प्लॅटफॉर्मवर चालते:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-slate-700 text-xs">
                        <li>
                          <strong>Vercel (सर्वात सोपे आणि १००% मोफत):</strong> vercel.com वर मोफत खाते उघडा, हे कोड रिपॉझिटरी कनेक्ट करा आणि २ मिनिटांत <code>vicharlahari.vercel.app</code> सारखी मोफत लिंक मिळवा!
                        </li>
                        <li>
                          <strong>Netlify किंवा GitHub Pages:</strong> नेटलिफायवरही मोफत होस्टिंग उपलब्ध आहे.
                        </li>
                        <li>
                          <strong>स्वतःचे डोमेन (.com / .in):</strong> भविष्यात तुम्ही <code>vicharlaharinews24.com</code> हे डोमेन विकत घेऊन सहज जोडू शकता.
                        </li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                      <p className="font-bold">🔒 सुरक्षिततेची काळजी:</p>
                      <p>
                        ॲडमिन पासवर्ड कुणाशीही शेअर करू नका. 'सेटिंग्ज' टॅबमधून तुमचा पासवर्ड नियमितपणे बदलत राहा.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
