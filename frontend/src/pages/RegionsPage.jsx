import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import RegionDetail from '../components/RegionDetail';
import regionsData from '../data/regions.json';

export default function RegionsPage({ lang, setLang }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const navigate = useNavigate();

  if (selectedRegion) {
    return (
      <RegionDetail
        region={selectedRegion}
        onBack={() => setSelectedRegion(null)}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-heritage-cream">
      <LanguageSwitcher lang={lang} setLang={setLang} />

      {/* Back */}
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

      {/* Header */}
      <div className="text-center py-10 px-4">
        <h1 className="text-4xl font-black text-heritage-brown mb-2 flex items-center justify-center gap-3">
          <span className="material-icons text-heritage-green" style={{ fontSize: '40px' }}>map</span>
          {lang === 'ar' ? 'ثقافة المناطق' : 'Regional Cultures'}
        </h1>
        <p className="text-heritage-brown-md">
          {lang === 'ar'
            ? 'اختر منطقة لاستكشاف تراثها وحضارتها'
            : 'Choose a region to explore its heritage and civilization'}
        </p>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionsData.regions.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className="relative h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1 border border-heritage-beige-dark"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${region.hero_image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-5 text-white text-right">
                <h3 className="text-2xl font-black mb-1">
                  {lang === 'ar' ? region.name_ar : region.name_en}
                </h3>
                <p className="text-xs text-white/85">
                  {lang === 'ar' ? region.tagline_ar : region.tagline_en}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
