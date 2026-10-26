import React, { useState } from 'react';
import {
  Youtube,
  Play,
  Clock,
  Eye,
  Radio,
  ExternalLink,
  X,
  Share2,
  Tv,
} from 'lucide-react';
import { YouTubeVideoItem, SiteConfig } from '../types/news';

interface YouTubeSectionProps {
  videos: YouTubeVideoItem[];
  siteConfig: SiteConfig;
}

export const YouTubeSection: React.FC<YouTubeSectionProps> = ({ videos, siteConfig }) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('सर्व');

  const categories = ['सर्व', 'थेट प्रक्षेपण / Live', 'ग्राउंड रिपोर्ट', 'विशेष बातमी', 'मुलाखत'];

  const filteredVideos =
    selectedFilter === 'सर्व'
      ? videos
      : videos.filter((v) => v.category.includes(selectedFilter) || (selectedFilter.includes('Live') && v.isLive));

  const mainFeaturedVideo = videos.find((v) => v.isLive) || videos[0];

  const handleShareVideo = (video: YouTubeVideoItem) => {
    const text = `📺 *${video.title}*\n\nपहा विचार लहरी न्यूज २४ वर:\nhttps://www.youtube.com/watch?v=${video.youtubeId}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="my-8 bg-slate-900 rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl border border-slate-800">
      {/* Header & Subscribe Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-600 text-white p-1 rounded-md">
              <Youtube className="w-5 h-5" />
            </span>
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              यूट्यूब विशेष व्हिडिओ बुलेटिन
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-marathi-title text-white">
            विचार लहरी न्यूज २४ थेट व्हिडिओ
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            वाशिम आणि विदर्भातील प्रत्येक घडामोडीचे थेट वार्तांकन आणि व्हिडिओ रिपोर्ट
          </p>
        </div>

        {/* Subscribe Banner */}
        <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{siteConfig.youtubeChannelName}</p>
            <p className="text-[11px] text-red-400 font-semibold">{siteConfig.youtubeSubscribersCount}</p>
          </div>
          <a
            href={siteConfig.youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow"
          >
            <Youtube className="w-4 h-4" />
            <span>सबस्क्राईब करा</span>
          </a>
        </div>
      </div>

      {/* Main Video Highlight & Player */}
      {mainFeaturedVideo && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Video Player Box */}
          <div className="lg:col-span-8 relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 group">
            {selectedVideo && selectedVideo.id === mainFeaturedVideo.id ? (
              <iframe
                src={`https://www.youtube.com/embed/${mainFeaturedVideo.youtubeId}?autoplay=1&rel=0`}
                title={mainFeaturedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                onClick={() => setSelectedVideo(mainFeaturedVideo)}
                className="relative w-full h-full cursor-pointer"
              >
                <img
                  src={
                    mainFeaturedVideo.customThumbnail ||
                    `https://img.youtube.com/vi/${mainFeaturedVideo.youtubeId}/hqdefault.jpg`
                  }
                  alt={mainFeaturedVideo.title}
                  className="w-full h-full object-cover group-hover:opacity-90 transition"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition duration-200">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                </div>
                {mainFeaturedVideo.isLive && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded flex items-center gap-1.5 animate-pulse shadow">
                    <Radio className="w-3.5 h-3.5" />
                    थेट प्रक्षेपण / LIVE
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-xs font-semibold px-2 py-0.5 rounded">
                  {mainFeaturedVideo.duration}
                </span>
              </div>
            )}
          </div>

          {/* Featured Video Details */}
          <div className="lg:col-span-4 space-y-3">
            <span className="bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold px-2.5 py-1 rounded">
              {mainFeaturedVideo.category}
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-marathi-title leading-snug text-white">
              {mainFeaturedVideo.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
              {mainFeaturedVideo.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {mainFeaturedVideo.views} व्ह्यूज
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {mainFeaturedVideo.publishedDate}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedVideo(mainFeaturedVideo)}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>व्हिडिओ पहा</span>
              </button>
              <button
                onClick={() => handleShareVideo(mainFeaturedVideo)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition"
                title="व्हॉट्सॲपवर शेअर करा"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>शेअर</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Filter Tabs */}
      <div className="mt-8 flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800 text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              selectedFilter === cat
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="group cursor-pointer bg-slate-800/60 hover:bg-slate-800 rounded-xl overflow-hidden border border-slate-700/60 hover:border-slate-600 transition flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-black overflow-hidden">
              <img
                src={
                  video.customThumbnail ||
                  `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`
                }
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                <div className="w-10 h-10 bg-red-600/90 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition shadow">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
              {video.isLive && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  LIVE
                </span>
              )}
              <span className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                {video.duration}
              </span>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-red-400">
                  {video.category}
                </span>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition line-clamp-2 mt-1 leading-snug">
                  {video.title}
                </h4>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-700/60">
                <span>{video.publishedDate}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareVideo(video);
                  }}
                  className="hover:text-emerald-400 transition"
                  title="व्हॉट्सॲपवर शेअर करा"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player (if clicked another video) */}
      {selectedVideo && selectedVideo.id !== mainFeaturedVideo?.id && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="p-3 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <span className="text-xs font-bold text-white truncate max-w-md">
                {selectedVideo.title}
              </span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-base font-bold text-white font-marathi-title">
                {selectedVideo.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedVideo.description}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <span>प्रकाशित: {selectedVideo.publishedDate}</span>
                <button
                  onClick={() => handleShareVideo(selectedVideo)}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>व्हॉट्सॲपवर शेअर करा</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
