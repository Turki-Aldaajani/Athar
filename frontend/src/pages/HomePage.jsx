import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import LanguageSwitcher from '../components/LanguageSwitcher';

const STEPS = [
  { icon: 'photo_camera', ar: 'صوّر أو ارفع', en: 'Photograph or Upload', sub_ar: 'صورة لأي معلم تراثي', sub_en: 'A photo of any heritage landmark' },
  { icon: 'search', ar: 'تعرّف ذكي', en: 'Smart Recognition', sub_ar: 'نظام ذكاء اصطناعي متقدم', sub_en: 'Advanced AI identifies it instantly' },
  { icon: 'auto_stories', ar: 'اقرأ القصة', en: 'Read the Story', sub_ar: 'تاريخ غني وجدول أحداث', sub_en: 'Rich history and event timeline' },
];

export default function HomePage({ lang, setLang }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelected = async (base64Image) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/recognize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, language: lang }),
      });

      const data = await response.json();

      if (data.recognized && data.landmark) {
        navigate('/result', { state: { landmark: data.landmark, language: lang } });
      } else {
        setError(lang === 'ar' ? data.message_ar : data.message_en);
      }
    } catch {
      setError(lang === 'ar'
        ? 'خطأ في الاتصال. تأكد من الإنترنت.'
        : 'Connection error. Check your internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-cream">
      <LanguageSwitcher lang={lang} setLang={setLang} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-heritage-green to-heritage-brown text-white py-16 px-4 text-center">
        <p className="text-heritage-gold text-sm font-bold uppercase tracking-widest mb-8">
          {lang === 'ar' ? 'المرشد التراثي الذكي' : 'Smart Heritage Guide'}
        </p>
        <h1 className="font-black mb-4 text-shadow" style={{ fontFamily: "'Amiri', 'Cairo', serif", fontSize: 'clamp(6rem, 18vw, 12rem)', lineHeight: 1 }}>
          {lang === 'ar' ? 'أثر' : 'Athar'}
        </h1>
        <p className="text-xl text-white/80 max-w-md mx-auto">
          {lang === 'ar'
            ? 'اكتشف قصص المعالم السعودية التراثية بلمسة واحدة'
            : 'Discover Saudi heritage landmark stories with one tap'}
        </p>
      </section>

      {/* Uploader */}
      <section className="max-w-2xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl border border-heritage-beige-dark p-6">
          <h2 className="text-center font-bold text-heritage-brown-md mb-4 text-lg">
            {lang === 'ar' ? 'ارفع صورة معلم لتبدأ' : 'Upload a landmark photo to start'}
          </h2>
          <ImageUploader onImageSelected={handleImageSelected} isLoading={isLoading} lang={lang} />

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-xl text-red-700 text-center text-sm">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="text-center text-2xl font-black text-heritage-brown mb-8">
          {lang === 'ar' ? 'كيف يعمل؟' : 'How it works'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl border border-heritage-beige-dark shadow-sm p-6 text-center hover:shadow-md transition">
              <div className="flex justify-center mb-3">
                <span className="material-icons text-heritage-green" style={{ fontSize: '48px' }}>{step.icon}</span>
              </div>
              <h3 className="font-black text-heritage-brown text-lg mb-1">
                {lang === 'ar' ? step.ar : step.en}
              </h3>
              <p className="text-sm text-heritage-brown-md">
                {lang === 'ar' ? step.sub_ar : step.sub_en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Cards */}
      <section className="pb-16 px-4">
        <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Regions CTA */}
          <div className="bg-heritage-beige rounded-3xl p-6 border border-heritage-beige-dark text-center flex flex-col items-center">
            <span className="material-icons text-heritage-green mb-2" style={{ fontSize: '2rem' }}>map</span>
            <p className="text-heritage-brown font-bold text-base mb-1">
              {lang === 'ar' ? 'استكشف المناطق' : 'Explore Regions'}
            </p>
            <p className="text-heritage-brown-md text-xs mb-4">
              {lang === 'ar'
                ? 'تراث وثقافة كل منطقة بالتفصيل'
                : 'Heritage & culture of each region'}
            </p>
            <button
              onClick={() => navigate('/regions')}
              className="px-6 py-2.5 bg-heritage-green text-white font-bold rounded-full hover:bg-heritage-green-md transition shadow-md inline-flex items-center gap-2 text-sm"
            >
              <span className="material-icons text-sm">explore</span>
              {lang === 'ar' ? 'تصفح' : 'Browse'}
            </button>
          </div>

          {/* Explore/Suggest CTA */}
          <div
            className="rounded-3xl p-6 border text-center flex flex-col items-center"
            style={{ background: 'linear-gradient(135deg, #2d4a1e10, #5a3a1a08)', borderColor: '#c4933a55' }}
          >
            <span className="material-icons text-heritage-gold mb-2" style={{ fontSize: '2rem' }}>travel_explore</span>
            <p className="text-heritage-brown font-bold text-base mb-1">
              {lang === 'ar' ? 'مرشدك الشخصي' : 'Personal Guide'}
            </p>
            <p className="text-heritage-brown-md text-xs mb-4">
              {lang === 'ar'
                ? 'اكتب تفضيلاتك واحصل على اقتراحات ذكية'
                : 'Write your preferences & get smart suggestions'}
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="px-6 py-2.5 text-white font-bold rounded-full transition shadow-md inline-flex items-center gap-2 text-sm"
              style={{ background: 'linear-gradient(135deg, #5a3a1a, #8B6914)' }}
            >
              <span className="material-icons text-sm">auto_awesome</span>
              {lang === 'ar' ? 'جرّب الآن' : 'Try Now'}
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
