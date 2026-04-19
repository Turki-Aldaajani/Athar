export default function Timeline({ events, lang }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="relative py-4">
      <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-heritage-gold to-heritage-beige-dark" />

      <div className="space-y-5 pr-16">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="relative flex items-start"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="absolute right-0 top-3 w-4 h-4 bg-heritage-gold rounded-full ring-4 ring-heritage-beige z-10 translate-x-[6px]" />

            <div className="flex-1 bg-white rounded-xl border border-heritage-beige-dark shadow-sm p-5 hover:shadow-md transition">
              <div className="text-heritage-gold font-black text-base mb-1">
                {lang === 'ar' ? event.year : (event.year_en || event.year)}
              </div>
              <div className="text-heritage-brown text-right leading-relaxed">
                {lang === 'ar' ? event.event_ar : event.event_en}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
