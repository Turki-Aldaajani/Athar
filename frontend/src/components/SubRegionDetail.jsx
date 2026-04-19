import LanguageSwitcher from './LanguageSwitcher';

export default function SubRegionDetail({ subRegion, regionName, onBack, lang, setLang }) {
  return (
    <div className="min-h-screen bg-heritage-cream" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <LanguageSwitcher lang={lang} setLang={setLang || (() => {})} />

      {/* Hero */}
      <div
        className="relative h-72 bg-cover bg-center"
        style={{
          backgroundImage: subRegion.hero_image ? `url(${subRegion.hero_image})` : 'none',
          backgroundColor: subRegion.hero_image ? 'transparent' : (subRegion.color || '#3d2a10'),
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <button
          onClick={onBack}
          className="absolute top-5 right-5 bg-white/90 hover:bg-white rounded-full px-4 py-2 shadow-lg font-bold text-heritage-green transition text-sm inline-flex items-center gap-1"
        >
          {lang === 'ar' ? 'رجوع' : 'Back'}
          <span className="material-icons text-sm">{lang === 'ar' ? 'arrow_forward' : 'arrow_back'}</span>
        </button>

        <div className="absolute bottom-0 right-0 left-0 p-6 text-white ">
          <p className="text-heritage-gold text-xs font-bold mb-1 flex items-center justify-start gap-1">
            <span className="material-icons" style={{ fontSize: '14px' }}>map</span>
            {regionName}
          </p>
          <h1 className="text-4xl font-black text-shadow mb-1">
            {lang === 'ar' ? subRegion.name_ar : subRegion.name_en}
          </h1>
          <p className="text-white/85 text-sm">
            {lang === 'ar' ? subRegion.tagline_ar : subRegion.tagline_en}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-black text-heritage-brown mb-3 flex items-center gap-2">
            {lang === 'ar' ? 'نبذة عامة' : 'Overview'}
            <span className="material-icons text-heritage-gold">info</span>
          </h2>
          <div className="bg-white rounded-2xl border border-heritage-beige-dark shadow-sm p-6">
            <p className="text-heritage-brown leading-loose ">
              {lang === 'ar' ? subRegion.overview_ar : subRegion.overview_en}
            </p>
          </div>
        </section>

        {/* Heritage Sites */}
        {subRegion.heritage_sites?.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-heritage-brown mb-4 flex items-center gap-2">
              {lang === 'ar' ? 'المواقع التراثية' : 'Heritage Sites'}
              <span className="material-icons text-heritage-gold">place</span>
            </h2>
            <div className="space-y-4">
              {subRegion.heritage_sites.map((site, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-heritage-beige-dark shadow-sm overflow-hidden"
                >
                  <div className="h-1 bg-gradient-to-r from-heritage-gold via-yellow-400 to-heritage-gold" />
                  <div className="p-5 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-heritage-beige flex items-center justify-center flex-shrink-0">
                      <span className="material-icons text-heritage-green text-2xl">{site.icon || 'place'}</span>
                    </div>
                    <div className=" flex-1">
                      <div className="flex items-center justify-start gap-2 mb-1">
                        <span className="text-xs bg-heritage-beige text-heritage-brown-md px-2 py-0.5 rounded-full font-bold">
                          {lang === 'ar' ? site.type_ar : site.type_en}
                        </span>
                        <h3 className="font-black text-heritage-brown text-lg">
                          {lang === 'ar' ? site.name_ar : site.name_en}
                        </h3>
                      </div>
                      <p className="text-heritage-brown-md text-sm leading-relaxed">
                        {lang === 'ar' ? site.desc_ar : site.desc_en}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cultural Notes */}
        {subRegion.cultural_notes_ar?.length > 0 && (
          <section className="bg-heritage-beige rounded-2xl p-6 border border-heritage-beige-dark border-r-4 border-r-heritage-gold">
            <h2 className="text-xl font-black text-heritage-brown mb-4 flex items-center gap-2">
              {lang === 'ar' ? 'هل تعلم؟' : 'Did You Know?'}
              <span className="material-icons text-heritage-gold">lightbulb</span>
            </h2>
            <ul className="space-y-3">
              {(lang === 'ar'
                ? subRegion.cultural_notes_ar
                : (subRegion.cultural_notes_en || subRegion.cultural_notes_ar)
              ).map((note, i) => (
                <li key={i} className="text-heritage-brown flex gap-2 items-start text-sm">
                  <span className="text-heritage-gold font-bold flex-shrink-0">•</span>
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Back Button */}
        <div className="text-center pb-8">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-heritage-green text-white font-bold rounded-full hover:bg-heritage-green-md transition shadow-md inline-flex items-center gap-2"
          >
            <span className="material-icons text-base">
              {lang === 'ar' ? 'arrow_forward' : 'arrow_back'}
            </span>
            {lang === 'ar' ? 'العودة للمناطق' : 'Back to Regions'}
          </button>
        </div>

      </div>
    </div>
  );
}
