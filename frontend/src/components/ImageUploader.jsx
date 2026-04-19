import { useState } from 'react';

export default function ImageUploader({ onImageSelected, isLoading, lang }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(lang === 'ar' ? 'الرجاء اختيار صورة فقط' : 'Please select an image');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(lang === 'ar'
        ? 'حجم الصورة كبير جداً (الحد الأقصى 10 ميجا)'
        : 'Image too large (max 10MB)');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      setPreview(reader.result);
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <label className="w-full cursor-pointer block">
        <div className="border-2 border-dashed border-heritage-gold rounded-2xl p-10 text-center hover:bg-heritage-beige/40 transition bg-white shadow-sm">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-14 h-14 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-bold text-heritage-brown-md">
                {lang === 'ar' ? 'جاري التحليل والتعرف...' : 'Analyzing landmark...'}
              </p>
            </div>
          ) : preview ? (
            <div className="flex flex-col items-center gap-4">
              <img src={preview} alt="preview" className="max-h-64 rounded-xl shadow-lg object-contain" />
              <p className="text-sm text-heritage-brown-md">{fileName}</p>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setPreview(null); setFileName(null); }}
                className="text-sm text-heritage-green font-bold hover:underline"
              >
                {lang === 'ar' ? 'اختر صورة أخرى' : 'Choose Different Image'}
              </button>
            </div>
          ) : (
            <div className="py-4">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-2xl font-bold text-heritage-brown mb-2">
                {lang === 'ar' ? 'اختر صورة المعلم' : 'Select a Landmark Photo'}
              </p>
              <p className="text-heritage-brown-md">
                {lang === 'ar'
                  ? 'صوّر أو اختر من المعرض — JPG أو PNG'
                  : 'Take or choose from gallery — JPG or PNG'}
              </p>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
      </label>
    </div>
  );
}
