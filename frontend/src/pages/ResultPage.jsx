import { useLocation, useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import LandmarkResult from '../components/LandmarkResult';
import Timeline from '../components/Timeline';
import ImageGallery from '../components/ImageGallery';

export default function ResultPage({ lang, setLang }) {
  const location = useLocation();
  const navigate = useNavigate();
  const landmark = location.state?.landmark;

  if (!landmark) {
    return (
      <div className="min-h-screen bg-heritage-cream flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-2xl shadow border border-heritage-beige-dark">
          <p className="text-xl text-heritage-brown-md mb-6">
            {lang === 'ar' ? 'لم يتم العثور على بيانات' : 'No landmark data found'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-heritage-green text-white rounded-full font-bold hover:bg-heritage-green-md transition inline-flex items-center gap-2"
          >
            <span className="material-icons text-base">home</span>
            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-heritage-cream">
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

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">

        {/* Landmark summary card */}
        <LandmarkResult landmark={landmark} lang={lang} />

        {/* Story */}
        <section>
          <h2 className="text-2xl font-black text-heritage-brown mb-4 text-right flex items-center justify-end gap-2">
            {lang === 'ar' ? 'القصة التاريخية' : 'Historical Story'}
            <span className="material-icons text-heritage-gold">auto_stories</span>
          </h2>
          <div className="bg-white rounded-2xl border border-heritage-beige-dark shadow-sm p-6">
            <p className="text-heritage-brown leading-loose text-right whitespace-pre-wrap">
              {lang === 'ar' ? landmark.story_ar : landmark.story_en}
            </p>
          </div>
        </section>

        {/* Gallery */}
        {landmark.reference_images?.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-heritage-brown mb-4 text-right flex items-center justify-end gap-2">
              {lang === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
              <span className="material-icons text-heritage-gold">photo_library</span>
            </h2>
            <ImageGallery images={landmark.reference_images} lang={lang} />
          </section>
        )}

        {/* Timeline */}
        {landmark.timeline?.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-heritage-brown mb-4 text-right flex items-center justify-end gap-2">
              {lang === 'ar' ? 'تسلسل الأحداث' : 'Timeline'}
              <span className="material-icons text-heritage-gold">timeline</span>
            </h2>
            <Timeline events={landmark.timeline} lang={lang} />
          </section>
        )}

        {/* Back button bottom */}
        <div className="text-center pt-4 pb-8">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-heritage-green text-white font-bold rounded-full hover:bg-heritage-green-md transition shadow-md inline-flex items-center gap-2"
          >
            <span className="material-icons text-base">refresh</span>
            {lang === 'ar' ? 'جرّب معلماً آخر' : 'Try Another Landmark'}
          </button>
        </div>
      </div>
    </div>
  );
}
