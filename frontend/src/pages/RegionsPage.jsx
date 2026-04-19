import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import SubRegionDetail from '../components/SubRegionDetail';
import regionsData from '../data/regions.json';

const region = regionsData.region;

export default function RegionsPage({ lang, setLang }) {
  const [selectedSub, setSelectedSub] = useState(null);
  const navigate = useNavigate();

  if (selectedSub) {
    return (
      <SubRegionDetail
        subRegion={selectedSub}
        regionName={lang === 'ar' ? region.name_ar : region.name_en}
        onBack={() => setSelectedSub(null)}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-heritage-cream" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <LanguageSwitcher lang={lang} setLang={setLang} />

      {/* Back bar */}
      <div className="bg-heritage-beige border-b border-heritage-beige-dark px-4 py-3">
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-heritage-green font-bold hover:opacity-70 transition"
          >
            <span className="material-icons text-base">{lang === 'ar' ? 'arrow_forward' : 'arrow_back'}</span>
            <span>{lang === 'ar' ? 'رجوع للرئيسية' : 'Back to Home'}</span>
          </button>
        </div>
      </div>

      {/* Region Header — plain dark brown, no image */}
      <div
        className="px-6 py-10 text-white text-center"
        style={{ background: 'linear-gradient(to bottom, #2d4a1e, #3d2a10)' }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="material-icons text-heritage-gold">map</span>
          <span className="text-heritage-gold text-sm font-bold uppercase tracking-widest">
            {lang === 'ar' ? 'استكشف المنطقة' : 'Explore the Region'}
          </span>
        </div>
        <h1 className="text-4xl font-black text-shadow mb-2" style={{ fontFamily: "'Amiri', serif" }}>
          {lang === 'ar' ? region.name_ar : region.name_en}
        </h1>
        <p className="text-white/80 text-base max-w-md mx-auto">
          {lang === 'ar' ? region.tagline_ar : region.tagline_en}
        </p>
      </div>

      {/* Overview */}
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-white rounded-2xl border border-heritage-beige-dark shadow-sm p-6 mb-6">
          <p className="text-heritage-brown leading-loose text-base">
            {lang === 'ar' ? region.overview_ar : region.overview_en}
          </p>
        </div>

        {/* Did You Know */}
        <div className="bg-heritage-beige rounded-2xl border border-heritage-beige-dark border-r-4 border-r-heritage-gold p-5 mb-8">
          <h3 className="text-lg font-black text-heritage-brown mb-3 flex items-center gap-2">
            {lang === 'ar' ? 'هل تعلم؟' : 'Did You Know?'}
            <span className="material-icons text-heritage-gold">lightbulb</span>
          </h3>
          <ul className="space-y-2">
            {(lang === 'ar' ? region.cultural_notes_ar : region.cultural_notes_en).map((note, i) => (
              <li key={i} className="text-heritage-brown flex gap-2 items-start text-sm leading-relaxed">
                <span className="text-heritage-gold font-bold flex-shrink-0">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sub-regions */}
        <h2 className="text-2xl font-black text-heritage-brown mb-5 flex items-center gap-2">
          {lang === 'ar' ? 'محافظات وأحياء تراثية' : 'Governorates & Heritage Areas'}
          <span className="material-icons text-heritage-gold">place</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-16">
          {region.sub_regions.map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelectedSub(sub)}
              className="relative h-52 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1 border border-heritage-beige-dark w-full"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${sub.hero_image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Site count badge */}
              <div className="absolute top-3 left-3 bg-heritage-gold/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <span className="material-icons" style={{ fontSize: '12px' }}>place</span>
                {sub.heritage_sites?.length || 0} {lang === 'ar' ? 'مواقع' : 'sites'}
              </div>

              <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                <h3 className="text-xl font-black mb-0.5">
                  {lang === 'ar' ? sub.name_ar : sub.name_en}
                </h3>
                <p className="text-xs text-white/80">
                  {lang === 'ar' ? sub.tagline_ar : sub.tagline_en}
                </p>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100">
                <span className="material-icons text-white text-sm">arrow_back_ios</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
