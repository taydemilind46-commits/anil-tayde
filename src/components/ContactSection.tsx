import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Share2,
  Youtube,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { SiteConfig } from '../types/news';

interface ContactSectionProps {
  siteConfig: SiteConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ siteConfig }) => {
  const [tipName, setTipName] = useState('');
  const [tipPhone, setTipPhone] = useState('');
  const [tipLocation, setTipLocation] = useState('');
  const [tipDetails, setTipDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipName.trim() || !tipDetails.trim()) return;

    // Send formatted message via WhatsApp
    const message = `🚨 *विचार लहरी न्यूज २४ - बातमी अलर्ट*\n\n*नाव:* ${tipName}\n*मोबाईल:* ${tipPhone}\n*गाव/तालुका:* ${tipLocation}\n\n*बातमीचा तपशील:*\n${tipDetails}`;
    window.open(
      `https://wa.me/${siteConfig.contactWhatsapp}?text=${encodeURIComponent(message)}`,
      '_blank'
    );

    setSubmitted(true);
    setTipName('');
    setTipPhone('');
    setTipLocation('');
    setTipDetails('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="my-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          आमच्याशी संपर्क साधा
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-marathi-title text-slate-900 mt-2">
          विचार लहरी न्यूज २४ मुख्य कार्यालय
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          {siteConfig.aboutText}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Info & Editorial Board */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 font-marathi-title">
              कार्यालयीन पत्ता व माहिती
            </h3>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">मुख्य कार्यालय</p>
                  <p className="font-semibold text-slate-900 leading-snug">{siteConfig.officeAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">संपर्क व व्हॉट्सॲप हेल्पलाईन</p>
                  <a
                    href={`tel:${siteConfig.contactPhone}`}
                    className="font-semibold text-slate-900 hover:text-red-600 transition block"
                  >
                    {siteConfig.contactPhone}
                  </a>
                  <a
                    href={`https://wa.me/${siteConfig.contactWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:underline font-bold"
                  >
                    व्हॉट्सॲपवर चॅट करा
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">ई-मेल</p>
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="font-semibold text-slate-900 hover:text-red-600 transition"
                  >
                    {siteConfig.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">यूट्यूब चॅनल</p>
                  <a
                    href={siteConfig.youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <span>{siteConfig.youtubeChannelName}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Editorial Board Card */}
            <div className="pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                संपादकीय मंडळ (Editorial Board)
              </p>
              <div className="space-y-1 text-xs text-slate-800">
                <p>
                  <strong>मुख्य संपादक:</strong> {siteConfig.editorName}
                </p>
                <p>
                  <strong>कार्यकारी संपादक:</strong> {siteConfig.executiveEditor}
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  नोंदणी क्रमांक: {siteConfig.rniRegistrationNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Citizen News Tip Submission Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-red-600 text-white">
                <MessageSquare className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-marathi-title">
                  आपल्या परिसरातील बातमी किंवा व्हिडिओ पाठवा
                </h3>
                <p className="text-xs text-slate-500">
                  वाशिम, अकोला, विदर्भ परिसरातील ज्वलंत समस्या, शेतकरी प्रश्न, अपघात किंवा विकासकामे विचार लहरी न्यूज २४ पर्यंत पोहोचवा.
                </p>
              </div>
            </div>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 text-xs font-bold">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>बातमी पाठवल्याबद्दल धन्यवाद! आमची टीम लवकरच याची खातरजमा करेल.</span>
              </div>
            )}

            <form onSubmit={handleSubmitTip} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    आपले नाव *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. राहुल देशमुख"
                    value={tipName}
                    onChange={(e) => setTipName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    मोबाईल नंबर (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="उदा. 9823456789"
                    value={tipPhone}
                    onChange={(e) => setTipPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  गाव / तालुका / शहर (वाशिम, अकोला इ.)
                </label>
                <input
                  type="text"
                  placeholder="उदा. कारंजा लाड, वाशिम"
                  value={tipLocation}
                  onChange={(e) => setTipLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  बातमीचा सविस्तर तपशील *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="घडलेली घटना, ठिकाण, वेळ आणि सविस्तर माहिती येथे लिहा..."
                  value={tipDetails}
                  onChange={(e) => setTipDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white resize-none"
                ></textarea>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                💡 <strong>टीप:</strong> 'थेट पाठवा' बटणावर क्लिक केल्यावर ही माहिती थेट संपादकांच्या व्हॉट्सॲपवर पाठवली जाईल. तेथे आपण संबंधित फोटो किंवा व्हिडिओ जोडू शकता.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>थेट बातमी पाठवा (WhatsApp द्वारे)</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
