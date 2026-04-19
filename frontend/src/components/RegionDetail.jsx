import LanguageSwitcher from './LanguageSwitcher';

export default function RegionDetail({ region, onBack, lang, setLang }) {
  return (
    <div className="min-h-screen bg-heritage-cream">
      <LanguageSwitcher lang={lang} setLang={setLang || (() => {})} />

      {/* Hero image */}
      <div
        className="relative h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${region.hero_image})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <button
          onClick={onBack}
          className="absolute top-5 right-5 bg-white/90 hover:bg-white rounded-full px-4 py-2 shadow-lg font-bold text-heritage-green transition text-sm"
        >
          {lang === 'ar' ? 'رجوع →' : '← Back'}
        </button>
        <div className="absolute bottom-6 right-6 left-6 text-white text-right">
          <h1 className="text-4xl font-black mb-1 text-shadow">
            {lang === 'ar' ? region.name_ar : region.name_en}
          </h1>
          <p className="text-base text-white/85">
            {lang === 'ar' ? region.tagline_ar : region.tagline_en}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10 space-y-10">

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-black text-heritage-brown mb-4 text-right">
            {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
          </h2>
          <div className="bg-white rounded-2xl border border-heritage-beige-dark shadow-sm p-6">
            <p className="text-heritage-brown leading-loose text-right">
              {lang === 'ar' ? region.overview_ar : region.overview_en}
            </p>
          </div>
        </section>

        {/* Highlights */}
        {region.highlights?.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-heritage-brown mb-4 text-right">
              {lang === 'ar' ? '✨ أبرز المعالم' : '✨ Highlights'}
            </h2>
            <div className="space-y-4">
              {region.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-heritage-beige-dark shadow-sm p-5 border-r-4 border-r-heritage-gold"
                >
                  <div className="flex gap-4 items-start">
                    <span className="text-4xl flex-shrink-0">{item.icon}</span>
                    <div className="text-right flex-1">
                      <h3 className="font-black text-heritage-brown text-lg mb-1">
                        {lang === 'ar' ? item.title_ar : item.title_en}
                      </h3>
                      <p className="text-heritage-brown-md text-sm leading-relaxed">
                        {lang === 'ar' ? item.description_ar : item.description_en}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cultural notes */}
        {region.cultural_notes_ar?.length > 0 && (
          <section className="bg-heritage-beige rounded-2xl p-7 border border-heritage-beige-dark border-r-4 border-r-heritage-gold">
            <h2 className="text-xl font-black text-heritage-brown mb-5 text-right">
              💡 {lang === 'ar' ? 'هل تعلم؟' : 'Did You Know?'}
            </h2>
            <ul className="space-y-3">
              {(lang === 'ar'
                ? region.cultural_notes_ar
                : (region.cultural_notes_en || region.cultural_notes_ar)
              ).map((note, i) => (
                <li key={i} className="text-heritage-brown text-right flex gap-2 items-start">
                  <span className="text-heritage-gold font-bold flex-shrink-0">•</span>
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
