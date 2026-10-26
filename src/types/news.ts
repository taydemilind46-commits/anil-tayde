export type NewsCategory =
  | 'सर्व'
  | 'महाराष्ट्र'
  | 'वाशिम'
  | 'अकोला'
  | 'विदर्भ'
  | 'देश'
  | 'राजकारण'
  | 'शिक्षण'
  | 'कृषी'
  | 'गुन्हेगारी'
  | 'क्रीडा'
  | 'मनोरंजन';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  district?: string;
  author: string;
  authorRole?: string;
  date: string;
  timestamp: number;
  views: number;
  imageUrl: string;
  imageCaption?: string;
  isBreaking?: boolean;
  isTopStory?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  isDemo?: boolean;
}

export interface BreakingTickerItem {
  id: string;
  text: string;
  articleId?: string;
  priority?: 'high' | 'normal';
  active: boolean;
}

export interface YouTubeVideoItem {
  id: string;
  youtubeId: string; // e.g. YouTube video ID
  title: string;
  description: string;
  duration: string;
  views: string;
  publishedDate: string;
  category: string;
  isLive?: boolean;
  customThumbnail?: string;
}

export interface EPaperPage {
  pageNumber: number;
  pageTitle: string;
  imageUrl: string;
}

export interface EPaperEdition {
  id: string;
  date: string; // e.g. "२६ ऑक्टोबर २०२६"
  isoDate: string; // e.g. "2026-10-26"
  editionName: string; // e.g. "वाशिम मुख्य आवृत्ती"
  city: string; // वाशिम, अकोला, विदर्भ
  coverImage: string;
  pages: EPaperPage[];
  pdfUrl?: string;
  fileSizeBytes?: string;
  totalPages: number;
}

export interface AdBannerItem {
  id: string;
  title: string;
  placement: 'header' | 'sidebar' | 'in_article' | 'footer' | 'epaper';
  sponsorName: string;
  imageUrl: string;
  targetUrl: string;
  active: boolean;
  ctaText?: string;
}

export interface NewsComment {
  id: string;
  articleId: string;
  name: string;
  city: string;
  text: string;
  timestamp: number;
  formattedDate: string;
}

export interface SiteConfig {
  channelName: string;
  englishName: string;
  tagline: string;
  editorName: string;
  executiveEditor: string;
  youtubeChannelUrl: string;
  youtubeChannelName: string;
  youtubeSubscribersCount: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  officeAddress: string;
  rniRegistrationNumber: string;
  aboutText: string;
  adminPasswordHash: string; // SHA-256 or safe hashed PIN
}
