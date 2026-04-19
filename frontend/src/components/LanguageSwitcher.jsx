export default function LanguageSwitcher({ lang, setLang }) {
  return (
    <nav className="bg-heritage-green text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-2xl font-black tracking-wide select-none">
          {lang === 'ar' ? 'أثر' : 'Athar'}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setLang('ar')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
              lang === 'ar'
                ? 'bg-white text-heritage-green'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
              lang === 'en'
                ? 'bg-white text-heritage-green'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </nav>
  );
}
