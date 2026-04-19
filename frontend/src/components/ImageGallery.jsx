import { useState } from 'react';

export default function ImageGallery({ images, lang }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const goToPrev = () => setCurrentIndex(p => (p === 0 ? images.length - 1 : p - 1));
  const goToNext = () => setCurrentIndex(p => (p === images.length - 1 ? 0 : p + 1));
  const current = images[currentIndex];

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-heritage-beige-dark">
      <div className="relative h-80 md:h-96 bg-heritage-brown">
        <img
          src={current.url}
          alt={lang === 'ar' ? current.caption_ar : current.caption_en}
          className="w-full h-full object-cover opacity-95"
          onError={(e) => { e.target.src = 'https://placehold.co/800x400/f5e6ca/2C1810?text=صورة+غير+متاحة'; }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-heritage-green shadow transition"
            >
              <span className="material-icons">chevron_right</span>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-heritage-green shadow transition"
            >
              <span className="material-icons">chevron_left</span>
            </button>
          </>
        )}

        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <div className="bg-heritage-beige px-6 py-4">
        <p className="font-semibold text-heritage-brown text-right">
          {lang === 'ar' ? current.caption_ar : current.caption_en}
        </p>
        <p className="text-xs text-heritage-brown-md mt-1 flex items-center gap-1">
          <span className="material-icons text-xs">push_pin</span> {current.source}
        </p>
      </div>

      {images.length > 1 && (
        <div className="bg-heritage-beige-dark px-4 py-3 flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                idx === currentIndex ? 'border-heritage-gold' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
