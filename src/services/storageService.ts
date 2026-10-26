import {
  Article,
  BreakingTickerItem,
  YouTubeVideoItem,
  EPaperEdition,
  AdBannerItem,
  NewsComment,
  SiteConfig,
} from '../types/news';
import {
  DEFAULT_ARTICLES,
  DEFAULT_BREAKING_TICKERS,
  DEFAULT_YOUTUBE_VIDEOS,
  DEFAULT_EPAPER_EDITIONS,
  DEFAULT_AD_BANNERS,
  DEFAULT_SITE_CONFIG,
} from '../data/defaultData';

const STORAGE_KEYS = {
  ARTICLES: 'vl_articles_v2',
  TICKERS: 'vl_tickers_v2',
  VIDEOS: 'vl_videos_v2',
  EPAPERS: 'vl_epapers_v2',
  ADS: 'vl_ads_v2',
  CONFIG: 'vl_config_v2',
  COMMENTS: 'vl_comments_v2',
  ADMIN_AUTH: 'vl_admin_authenticated',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error loading from localStorage for key ${key}:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving to localStorage for key ${key}:`, err);
  }
}

export const storageService = {
  // Articles
  getArticles(): Article[] {
    return safeGet<Article[]>(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
  },

  saveArticle(article: Omit<Article, 'id' | 'timestamp' | 'views'> & { id?: string }): Article {
    const articles = this.getArticles();
    if (article.id) {
      // Update existing
      const index = articles.findIndex((a) => a.id === article.id);
      if (index !== -1) {
        const updated: Article = {
          ...articles[index],
          ...article,
          id: article.id,
        };
        articles[index] = updated;
        safeSet(STORAGE_KEYS.ARTICLES, articles);
        return updated;
      }
    }
    // Create new
    const newArticle: Article = {
      ...article,
      id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      views: 1,
      isDemo: false,
    };
    articles.unshift(newArticle);
    safeSet(STORAGE_KEYS.ARTICLES, articles);

    // If it's breaking, automatically add to breaking tickers if desired
    if (newArticle.isBreaking) {
      this.saveTicker({
        text: newArticle.title,
        articleId: newArticle.id,
        priority: 'high',
        active: true,
      });
    }

    return newArticle;
  },

  deleteArticle(id: string): void {
    const articles = this.getArticles().filter((a) => a.id !== id);
    safeSet(STORAGE_KEYS.ARTICLES, articles);
  },

  incrementViews(id: string): void {
    const articles = this.getArticles();
    const article = articles.find((a) => a.id === id);
    if (article) {
      article.views = (article.views || 0) + 1;
      safeSet(STORAGE_KEYS.ARTICLES, articles);
    }
  },

  // Breaking Tickers
  getTickers(): BreakingTickerItem[] {
    return safeGet<BreakingTickerItem[]>(STORAGE_KEYS.TICKERS, DEFAULT_BREAKING_TICKERS);
  },

  saveTicker(ticker: Omit<BreakingTickerItem, 'id'> & { id?: string }): BreakingTickerItem {
    const tickers = this.getTickers();
    if (ticker.id) {
      const idx = tickers.findIndex((t) => t.id === ticker.id);
      if (idx !== -1) {
        tickers[idx] = { ...tickers[idx], ...ticker, id: ticker.id };
        safeSet(STORAGE_KEYS.TICKERS, tickers);
        return tickers[idx];
      }
    }
    const newTicker: BreakingTickerItem = {
      ...ticker,
      id: `bt-${Date.now()}`,
    };
    tickers.unshift(newTicker);
    safeSet(STORAGE_KEYS.TICKERS, tickers);
    return newTicker;
  },

  deleteTicker(id: string): void {
    const tickers = this.getTickers().filter((t) => t.id !== id);
    safeSet(STORAGE_KEYS.TICKERS, tickers);
  },

  // YouTube Videos
  getVideos(): YouTubeVideoItem[] {
    return safeGet<YouTubeVideoItem[]>(STORAGE_KEYS.VIDEOS, DEFAULT_YOUTUBE_VIDEOS);
  },

  saveVideo(video: Omit<YouTubeVideoItem, 'id'> & { id?: string }): YouTubeVideoItem {
    const videos = this.getVideos();
    if (video.id) {
      const idx = videos.findIndex((v) => v.id === video.id);
      if (idx !== -1) {
        videos[idx] = { ...videos[idx], ...video, id: video.id };
        safeSet(STORAGE_KEYS.VIDEOS, videos);
        return videos[idx];
      }
    }
    const newVideo: YouTubeVideoItem = {
      ...video,
      id: `yt-${Date.now()}`,
    };
    videos.unshift(newVideo);
    safeSet(STORAGE_KEYS.VIDEOS, videos);
    return newVideo;
  },

  deleteVideo(id: string): void {
    const videos = this.getVideos().filter((v) => v.id !== id);
    safeSet(STORAGE_KEYS.VIDEOS, videos);
  },

  // E-Paper Editions
  getEPapers(): EPaperEdition[] {
    return safeGet<EPaperEdition[]>(STORAGE_KEYS.EPAPERS, DEFAULT_EPAPER_EDITIONS);
  },

  saveEPaper(edition: Omit<EPaperEdition, 'id'> & { id?: string }): EPaperEdition {
    const epapers = this.getEPapers();
    if (edition.id) {
      const idx = epapers.findIndex((e) => e.id === edition.id);
      if (idx !== -1) {
        epapers[idx] = { ...epapers[idx], ...edition, id: edition.id };
        safeSet(STORAGE_KEYS.EPAPERS, epapers);
        return epapers[idx];
      }
    }
    const newEdition: EPaperEdition = {
      ...edition,
      id: `epaper-${Date.now()}`,
    };
    epapers.unshift(newEdition);
    safeSet(STORAGE_KEYS.EPAPERS, epapers);
    return newEdition;
  },

  deleteEPaper(id: string): void {
    const epapers = this.getEPapers().filter((e) => e.id !== id);
    safeSet(STORAGE_KEYS.EPAPERS, epapers);
  },

  // Advertisements
  getAds(): AdBannerItem[] {
    return safeGet<AdBannerItem[]>(STORAGE_KEYS.ADS, DEFAULT_AD_BANNERS);
  },

  saveAd(ad: Omit<AdBannerItem, 'id'> & { id?: string }): AdBannerItem {
    const ads = this.getAds();
    if (ad.id) {
      const idx = ads.findIndex((a) => a.id === ad.id);
      if (idx !== -1) {
        ads[idx] = { ...ads[idx], ...ad, id: ad.id };
        safeSet(STORAGE_KEYS.ADS, ads);
        return ads[idx];
      }
    }
    const newAd: AdBannerItem = {
      ...ad,
      id: `ad-${Date.now()}`,
    };
    ads.push(newAd);
    safeSet(STORAGE_KEYS.ADS, ads);
    return newAd;
  },

  deleteAd(id: string): void {
    const ads = this.getAds().filter((a) => a.id !== id);
    safeSet(STORAGE_KEYS.ADS, ads);
  },

  // Comments
  getComments(articleId: string): NewsComment[] {
    const all = safeGet<NewsComment[]>(STORAGE_KEYS.COMMENTS, []);
    return all.filter((c) => c.articleId === articleId);
  },

  addComment(comment: Omit<NewsComment, 'id' | 'timestamp'>): NewsComment {
    const all = safeGet<NewsComment[]>(STORAGE_KEYS.COMMENTS, []);
    const newComment: NewsComment = {
      ...comment,
      id: `comm-${Date.now()}`,
      timestamp: Date.now(),
    };
    all.unshift(newComment);
    safeSet(STORAGE_KEYS.COMMENTS, all);
    return newComment;
  },

  // Site Configuration
  getConfig(): SiteConfig {
    return safeGet<SiteConfig>(STORAGE_KEYS.CONFIG, DEFAULT_SITE_CONFIG);
  },

  saveConfig(config: Partial<SiteConfig>): SiteConfig {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    safeSet(STORAGE_KEYS.CONFIG, updated);
    return updated;
  },

  // Admin Auth
  verifyAdmin(password: string): boolean {
    const config = this.getConfig();
    const match = password.trim() === config.adminPasswordHash.trim();
    if (match) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    }
    return match;
  },

  isAdminLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  logoutAdmin(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  },

  updateAdminPassword(newPassword: string): void {
    const config = this.getConfig();
    config.adminPasswordHash = newPassword;
    safeSet(STORAGE_KEYS.CONFIG, config);
  },

  // Backup & Restore
  exportBackupData(): string {
    const data = {
      articles: this.getArticles(),
      tickers: this.getTickers(),
      videos: this.getVideos(),
      epapers: this.getEPapers(),
      ads: this.getAds(),
      config: this.getConfig(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.articles) safeSet(STORAGE_KEYS.ARTICLES, data.articles);
      if (data.tickers) safeSet(STORAGE_KEYS.TICKERS, data.tickers);
      if (data.videos) safeSet(STORAGE_KEYS.VIDEOS, data.videos);
      if (data.epapers) safeSet(STORAGE_KEYS.EPAPERS, data.epapers);
      if (data.ads) safeSet(STORAGE_KEYS.ADS, data.ads);
      if (data.config) safeSet(STORAGE_KEYS.CONFIG, data.config);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  resetToDefaults(): void {
    safeSet(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
    safeSet(STORAGE_KEYS.TICKERS, DEFAULT_BREAKING_TICKERS);
    safeSet(STORAGE_KEYS.VIDEOS, DEFAULT_YOUTUBE_VIDEOS);
    safeSet(STORAGE_KEYS.EPAPERS, DEFAULT_EPAPER_EDITIONS);
    safeSet(STORAGE_KEYS.ADS, DEFAULT_AD_BANNERS);
    safeSet(STORAGE_KEYS.CONFIG, DEFAULT_SITE_CONFIG);
  },
};
