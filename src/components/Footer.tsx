import React from 'react';
import {
  Youtube,
  Phone,
  Mail,
  MapPin,
  Share2,
  FileText,
  Lock,
  ArrowUp,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { NewsCategory, SiteConfig } from '../types/news';

interface FooterProps {
  onSelectCategory: (cat: NewsCategory | 'व्हिडिओ' | 'ई-पेपर' | 'संपर्क') => void;
  onOpenAdmin: () => void;
  siteConfig: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAdmin,
  siteConfig,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories: NewsCategory[] = [
    'महाराष्ट्र',
    'वाशिम',
    'अकोला',
    'विदर्भ',
    'देश',
    'राजकारण',
    'कृषी',
    'शिक्षण',
    'गुन्हेगारी',
    'क्रीडा',
    'मनोरंजन',
  ];

  return (
    <footer className="bg-slate-950 text-white border-t-4 border-red-600 mt-12">
      {/* 1. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Col 1: Brand & About (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white p-2 rounded-lg font-black text-xl border border-red-500 shadow">
                VL24
              </div>
              <div>
                <h3 className="text-2xl font-black font-marathi-title leading-tight">
                  <span className="text-white">विचार</span>{' '}
                  <span className="text-red-500">लहरी</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  NEWS 24 • सत्य, निर्भीड, निष्पक्ष
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {siteConfig.aboutText}
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs">
              <a
                href={siteConfig.youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition shadow"
                title="यूट्यूब"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${siteConfig.contactWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white transition shadow"
                title="व्हॉट्सॲप"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-700 transition"
              >
                <Lock className="w-3 h-3" />
                <span>संपादक लॉगिन</span>
              </button>
            </div>
          </div>

          {/* Col 2: News Categories (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              बातम्यांचे विभाग (News Categories)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className="text-left text-slate-300 hover:text-white hover:translate-x-1 transition-transform flex items-center gap-1.5 py-0.5"
                >
                  <span className="text-red-500 font-bold">›</span>
                  <span>{cat}</span>
                </button>
              ))}
              <button
                onClick={() => onSelectCategory('ई-पेपर')}
                className="text-left text-amber-400 font-bold hover:text-amber-300 transition flex items-center gap-1.5 py-0.5"
              >
                <span className="text-amber-500 font-bold">›</span>
                <span>डिजिटल ई-वृत्तपत्र</span>
              </button>
              <button
                onClick={() => onSelectCategory('व्हिडिओ')}
                className="text-left text-red-400 font-bold hover:text-red-300 transition flex items-center gap-1.5 py-0.5"
              >
                <span className="text-red-500 font-bold">›</span>
                <span>यूट्यूब व्हिडिओ</span>
              </button>
            </div>
          </div>

          {/* Col 3: Contact & Office (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              कार्यालय व संपर्क
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{siteConfig.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`tel:${siteConfig.contactPhone}`} className="hover:underline">
                  {siteConfig.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${siteConfig.contactEmail}`} className="hover:underline">
                  {siteConfig.contactEmail}
                </a>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                <p><strong>मुख्य संपादक:</strong> {siteConfig.editorName}</p>
                <p><strong>नोंदणी क्रमांक:</strong> {siteConfig.rniRegistrationNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Content Notice */}
        <div className="mt-8 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>
            ℹ️ <strong>नमुना वृत्त माहिती (Demo Content):</strong> या ॲपमध्ये प्रारंभी दाखवलेल्या बातम्या प्रात्यक्षिकासाठी नमुना स्वरूपात आहेत. संपादक ॲडमिन पॅनेलमधून आपल्या खऱ्या बातम्या, ई-पेपर आणि यूट्यूब व्हिडिओ कधीही जोडू शकतात.
          </span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition font-bold"
          >
            <span>वर जा</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Bottom Copyright Bar */}
      <div className="bg-black py-4 px-4 text-center text-xs text-slate-500 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} विचार लहरी न्यूज २४ (Vichar Lahari News 24). सर्व हक्क सुरक्षित.</p>
          <p className="text-[11px]">
            वाशिम • अकोला • विदर्भ • महाराष्ट्र डिजिटल पत्रकारिता
          </p>
        </div>
      </div>
    </footer>
  );
};
