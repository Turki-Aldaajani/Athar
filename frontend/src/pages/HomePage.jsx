import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';

const STEPS = [
  { icon: 'photo_camera', ar: 'صوّر أو ارفع', en: 'Photograph' },
  { icon: 'search', ar: 'تعرّف ذكي', en: 'AI Recognition' },
  { icon: 'auto_stories', ar: 'اقرأ القصة', en: 'Read Story' },
];

export default function HomePage({ lang, setLang }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert(lang === 'ar' ? 'الرجاء اختيار صورة فقط' : 'Please select an image');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert(lang === 'ar' ? 'حجم الصورة كبير جداً (الحد الأقصى 10 ميجا)' : 'Image too large (max 10MB)');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      setPreview(reader.result);
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/recognize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, language: lang }),
        });
        const data = await response.json();
        if (data.recognized && data.landmark) {
          navigate('/result', { state: { landmark: data.landmark, language: lang } });
        } else {
          setError(lang === 'ar' ? data.message_ar : data.message_en);
          setPreview(null);
        }
      } catch {
        setError(lang === 'ar' ? 'خطأ في الاتصال. تأكد من الإنترنت.' : 'Connection error. Check your internet.');
        setPreview(null);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-heritage-cream" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <LanguageSwitcher lang={lang} setLang={setLang} />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-heritage-green to-heritage-brown text-white py-10 px-4 text-center">
        <p className="text-heritage-gold text-xs font-bold uppercase tracking-widest mb-4">
          {lang === 'ar' ? 'المرشد التراثي الذكي' : 'Smart Heritage Guide'}
        </p>
        <h1
          className="font-black mb-3 text-shadow"
          style={{
            fontFamily: "'Amiri', 'Cairo', serif",
            fontSize: 'clamp(4rem, 13vw, 8rem)',
            lineHeight: 1,
          }}
        >
          {lang === 'ar' ? 'أثر' : 'Athar'}
        </h1>
        <p className="text-base text-white/75 max-w-sm mx-auto">
          {lang === 'ar'
            ? 'اكتشف قصص المعالم السعودية التراثية بلمسة واحدة'
            : 'Discover Saudi heritage landmark stories with one tap'}
        </p>
      </section>

      {/* ── Circular Upload ── */}
      <section className="flex flex-col items-center px-4 -mt-1 pt-10 pb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        {/* Circle */}
        <button
          type="button"
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center rounded-full transition-all duration-300 group focus:outline-none"
          style={{
            width: 260,
            height: 260,
            border: '3px dashed #c4933a',
            background: 'radial-gradient(circle at center, #fffbf2 60%, #f5e8c8 100%)',
            boxShadow: '0 4px 32px 0 rgba(196,147,58,0.13)',
            cursor: isLoading ? 'default' : 'pointer',
          }}
          aria-label={lang === 'ar' ? 'ارفع صورة معلم' : 'Upload landmark photo'}
        >
          {/* Subtle gold glow ring on hover */}
          <span
            className="absolute inset-0 rounded-full transition-all duration-300 group-hover:opacity-100 opacity-0"
            style={{ boxShadow: '0 0 0 6px rgba(196,147,58,0.15)' }}
          />

          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-heritage-brown-md px-4 text-center">
                {lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
              </p>
            </div>
          ) : preview ? (
            <div className="flex flex-col items-center gap-2 w-full h-full p-3">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <span className="material-icons text-heritage-gold" style={{ fontSize: '46px' }}>
                photo_camera
              </span>
              <p className="text-sm font-black text-heritage-brown leading-snug">
                {lang === 'ar' ? 'ارفع صورة معلم' : 'Upload Landmark Photo'}
              </p>
              <p className="text-xs text-heritage-brown-md leading-tight">
                {lang === 'ar'
                  ? 'اضغط للتصوير أو الاختيار من المعرض'
                  : 'Tap to capture or choose from gallery'}
              </p>
            </div>
          )}
        </button>

        {/* Reset link if preview */}
        {preview && !isLoading && (
          <button
            type="button"
            onClick={() => { setPreview(null); setFileName(null); }}
            className="mt-3 text-xs text-heritage-green font-bold hover:underline"
          >
            {lang === 'ar' ? 'اختر صورة أخرى' : 'Choose Different Image'}
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 w-full max-w-xs p-3 bg-red-50 border border-red-300 rounded-xl text-red-700 text-center text-xs">
            {error}
          </div>
        )}
      </section>

      {/* ── The Big Two ── */}
      <section className="px-4 pb-10">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Personal Guide */}
          <div
            className="rounded-3xl p-7 border flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-200"
            style={{
              background: 'linear-gradient(145deg, #fdf6e3, #f5e8c8)',
              borderColor: '#c4933a55',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #5a3a1a, #8B6914)' }}
            >
              <span className="material-icons text-white" style={{ fontSize: '28px' }}>travel_explore</span>
            </div>
            <p className="text-heritage-brown font-black text-lg mb-1">
              {lang === 'ar' ? 'مرشدك الشخصي' : 'Personal Guide'}
            </p>
            <p className="text-heritage-brown-md text-sm mb-5 leading-relaxed">
              {lang === 'ar'
                ? 'اكتب تفضيلاتك واحصل على اقتراحات مواقع تراثية ذكية مُصمَّمة لك'
                : 'Write your preferences & get AI-powered heritage site suggestions tailored to you'}
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="px-7 py-2.5 text-white font-bold rounded-full transition-all shadow-md hover:opacity-90 inline-flex items-center gap-2 text-sm"
              style={{ background: 'linear-gradient(135deg, #5a3a1a, #8B6914)' }}
            >
              <span className="material-icons text-sm">auto_awesome</span>
              {lang === 'ar' ? 'جرّب الآن' : 'Try Now'}
            </button>
          </div>

          {/* Explore Regions */}
          <div
            className="rounded-3xl p-7 border flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-200"
            style={{
              background: 'linear-gradient(145deg, #eef4e8, #dcecd2)',
              borderColor: '#2d4a1e44',
            }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm bg-heritage-green">
              <span className="material-icons text-white" style={{ fontSize: '28px' }}>map</span>
            </div>
            <p className="text-heritage-brown font-black text-lg mb-1">
              {lang === 'ar' ? 'استكشف المناطق' : 'Explore Regions'}
            </p>
            <p className="text-heritage-brown-md text-sm mb-5 leading-relaxed">
              {lang === 'ar'
                ? 'تجوّل في أغنى مناطق المملكة تراثاً وتاريخاً مع معالمها وقصصها الأصيلة'
                : 'Journey through Saudi Arabia\'s richest heritage regions with their landmarks and authentic stories'}
            </p>
            <button
              onClick={() => navigate('/regions')}
              className="px-7 py-2.5 bg-heritage-green text-white font-bold rounded-full hover:bg-heritage-green-md transition-all shadow-md inline-flex items-center gap-2 text-sm"
            >
              <span className="material-icons text-sm">explore</span>
              {lang === 'ar' ? 'تصفح' : 'Browse'}
            </button>
          </div>

        </div>
      </section>

      {/* ── How it works — thin strip ── */}
      <div style={{ background: '#f7f0e2', borderTop: '1px solid #e8d9b8', borderBottom: '1px solid #e8d9b8' }}>
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-around gap-2">
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center flex-1">
              <span className="material-icons text-heritage-brown-md" style={{ fontSize: '20px' }}>
                {step.icon}
              </span>
              <span className="text-xs font-bold text-heritage-brown-md">
                {lang === 'ar' ? step.ar : step.en}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer spacer */}
      <div className="h-8" />
    </div>
  );
}
