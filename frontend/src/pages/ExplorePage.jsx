import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';

const EXAMPLES_AR = [
  'أحب الأماكن الهادئة والطبيعة والتاريخ',
  'أريد أماكن فيها قلاع وحصون قديمة',
  'أحب الأسواق التراثية والحرف اليدوية',
  'أريد أماكن دينية وتاريخية إسلامية',
  'أفضّل الأماكن المناسبة للعائلة',
];

const EXAMPLES_EN = [
  'I love quiet natural places with history',
  'I want castles and ancient forts',
  'I enjoy traditional markets and crafts',
  'I prefer Islamic historical sites',
  'Looking for family-friendly heritage spots',
];

const TYPE_ICONS = {
  'قلعة': 'fort',
  'fort': 'fort',
  'سوق': 'storefront',
  'market': 'storefront',
  'قرية': 'holiday_village',
  'village': 'holiday_village',
  'مسجد': 'mosque',
  'mosque': 'mosque',
  'طبيعي': 'landscape',
  'natural': 'landscape',
  'ديني': 'star',
  'religious': 'star',
  'default': 'place',
};

function getIcon(type = '') {
  const t = type.toLowerCase();
  for (const [key, icon] of Object.entries(TYPE_ICONS)) {
    if (t.includes(key)) return icon;
  }
  return TYPE_ICONS.default;
}

function ScoreRing({ score }) {
  const color = score >= 80 ? '#5a7a3a' : score >= 60 ? '#c4933a' : '#8B6914';
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg border-4"
        style={{ borderColor: color, color }}
      >
        {score}%
      </div>
      <span className="text-xs mt-1" style={{ color }}>
        تطابق
      </span>
    </div>
  );
}

export default function ExplorePage({ lang, setLang }) {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);

  const ar = lang === 'ar';

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), language: lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error');
      setSuggestions(data.suggestions || []);
    } catch (e) {
      setError(ar ? 'حدث خطأ أثناء التحليل. حاول مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (ex) => {
    setText(ex);
    setSuggestions(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-heritage-cream" dir={ar ? 'rtl' : 'ltr'}>
      <LanguageSwitcher lang={lang} setLang={setLang} />

      {/* Back bar */}
      <div className="bg-heritage-beige border-b border-heritage-beige-dark px-4 py-3">
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-heritage-green font-bold hover:opacity-70 transition text-base"
          >
            <span className="material-icons">{ar ? 'arrow_forward' : 'arrow_back'}</span>
            <span>{ar ? 'رجوع للرئيسية' : 'Back to Home'}</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div
        className="text-white py-12 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #2d4a1e 0%, #5a3a1a 100%)' }}
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
            <span className="material-icons text-heritage-gold" style={{ fontSize: '2.2rem' }}>travel_explore</span>
          </div>
        </div>
        <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "'Amiri', serif" }}>
          {ar ? 'مرشدك التراثي الشخصي' : 'Your Personal Heritage Guide'}
        </h1>
        <p className="text-white/75 max-w-md mx-auto text-sm">
          {ar
            ? 'أخبرنا عن تفضيلاتك وما تحب تزوره، وسيقترح لك الذكاء الاصطناعي أفضل الأماكن التراثية'
            : 'Tell us your preferences and what you love to visit, and AI will suggest the best heritage spots for you'}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-heritage-beige-dark p-6">
          <label className="block font-bold text-heritage-brown mb-3">
            <span className="material-icons text-heritage-green align-middle me-2 text-base">edit_note</span>
            {ar ? 'اكتب تفضيلاتك بحرية' : 'Write your preferences freely'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={ar
              ? 'مثال: أحب الأماكن التاريخية الهادئة، والقلاع الطينية، والأسواق القديمة...'
              : 'Example: I love quiet historical places, mud forts, and ancient markets...'}
            className="w-full border border-heritage-beige-dark rounded-xl p-3 text-heritage-brown text-sm resize-none focus:outline-none focus:ring-2 focus:ring-heritage-green/30 bg-heritage-cream"
            style={{ fontFamily: ar ? "'Amiri', serif" : 'inherit', direction: ar ? 'rtl' : 'ltr' }}
          />

          {/* Example chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-heritage-brown-md font-semibold self-center">
              {ar ? 'أمثلة:' : 'Try:'}
            </span>
            {(ar ? EXAMPLES_AR : EXAMPLES_EN).map((ex, i) => (
              <button
                key={i}
                onClick={() => handleExample(ex)}
                className="text-xs px-3 py-1 rounded-full border border-heritage-gold/40 text-heritage-brown hover:bg-heritage-gold/10 transition"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="mt-5 w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition"
            style={{
              background: loading || !text.trim()
                ? '#aaa'
                : 'linear-gradient(135deg, #2d4a1e, #5a7a3a)',
              cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <>
                <span className="material-icons animate-spin text-base">autorenew</span>
                {ar ? 'جارٍ التحليل...' : 'Analysing...'}
              </>
            ) : (
              <>
                <span className="material-icons text-base">auto_awesome</span>
                {ar ? 'احصل على اقتراحاتك' : 'Get My Suggestions'}
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {suggestions && suggestions.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-heritage-brown mb-4 flex items-center gap-2">
              <span className="material-icons text-heritage-gold text-xl">stars</span>
              {ar ? `أفضل ${suggestions.length} أماكن تناسبك` : `Top ${suggestions.length} places for you`}
            </h2>
            <div className="space-y-4">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-heritage-beige-dark shadow-sm p-5 flex gap-4 items-start hover:shadow-md transition"
                >
                  {/* Rank + Icon */}
                  <div className="flex flex-col items-center gap-2 min-w-[48px]">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
                      style={{ background: i === 0 ? '#5a3a1a' : i === 1 ? '#5a7a3a' : '#8B6914' }}
                    >
                      {i + 1}
                    </div>
                    <span className="material-icons text-heritage-brown-md text-2xl">
                      {getIcon(ar ? s.type_ar : s.type_en)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-black text-heritage-brown text-lg leading-tight" style={{ fontFamily: "'Amiri', serif" }}>
                          {ar ? s.name_ar : s.name_en}
                        </h3>
                        <p className="text-xs text-heritage-gold font-semibold mt-0.5">
                          <span className="material-icons text-xs align-middle me-0.5">location_on</span>
                          {ar ? s.location_ar : s.location_en}
                        </p>
                      </div>
                      <ScoreRing score={s.match_score || 85} />
                    </div>

                    <p className="mt-2 text-sm text-heritage-brown-md leading-relaxed">
                      {ar ? s.reason_ar : s.reason_en}
                    </p>

                    <span
                      className="inline-block mt-2 text-xs px-3 py-1 rounded-full font-semibold"
                      style={{ background: '#f5f0e8', color: '#5a3a1a' }}
                    >
                      {ar ? s.type_ar : s.type_en}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Re-ask */}
            <button
              onClick={() => { setSuggestions(null); setText(''); }}
              className="mt-6 w-full py-3 rounded-xl font-bold border-2 border-heritage-green text-heritage-green hover:bg-heritage-green hover:text-white transition flex items-center justify-center gap-2"
            >
              <span className="material-icons text-base">refresh</span>
              {ar ? 'ابحث من جديد' : 'Search Again'}
            </button>
          </div>
        )}

        {suggestions && suggestions.length === 0 && (
          <div className="text-center py-8 text-heritage-brown-md">
            <span className="material-icons text-4xl mb-2 block">search_off</span>
            {ar ? 'لم نجد مقترحات مناسبة. حاول بوصف مختلف.' : 'No suggestions found. Try a different description.'}
          </div>
        )}
      </div>
    </div>
  );
}
