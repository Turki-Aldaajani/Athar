export default function LandmarkResult({ landmark, lang }) {
  if (!landmark) return null;

  return (
    <div className="bg-white rounded-2xl border border-heritage-beige-dark shadow-md overflow-hidden">
      <div className="bg-heritage-beige px-6 py-5 border-b border-heritage-beige-dark">
        <h2 className="text-3xl font-black text-heritage-brown ">
          {lang === 'ar' ? landmark.name_ar : landmark.name_en}
        </h2>
        <p className="text-heritage-brown-md mt-1 flex items-center justify-start gap-1">
          <span className="material-icons text-sm">location_on</span>
          {lang === 'ar' ? landmark.location_ar : landmark.location_en}
        </p>
      </div>

      <div className="px-6 py-5">
        <div className="flex flex-wrap gap-3 justify-start mb-4">
          {landmark.period_ar && (
            <span className="bg-heritage-green text-white text-sm font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-1">
              <span className="material-icons text-sm">account_balance</span>
              {lang === 'ar' ? landmark.period_ar : landmark.period_en}
            </span>
          )}
          {landmark.unesco && (
            <span className="bg-heritage-gold text-white text-sm font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-1">
              <span className="material-icons text-sm">verified</span>
              UNESCO
            </span>
          )}
        </div>

        <p className="text-heritage-brown leading-relaxed">
          {lang === 'ar' ? landmark.description_short_ar : landmark.description_short_en}
        </p>
      </div>
    </div>
  );
}
