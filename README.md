# أثر — Athar 🏛️
### المرشد التراثي الذكي للمعالم السعودية
**Smart AI-Powered Saudi Heritage Guide**

<div align="center">

![Athar Logo](https://img.shields.io/badge/أثر-Athar-1B5E20?style=for-the-badge&labelColor=C5A028)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![Groq](https://img.shields.io/badge/Groq-Llama_4-F55036?style=flat-square)

**[🌐 تجربة التطبيق المباشر](https://project-6hfy6.vercel.app)** &nbsp;|&nbsp; **[⚡ API Backend](https://athar-7vap.onrender.com)**

</div>

---

## 📌 عن المشروع | About

**أثر** هو تطبيق ويب ذكي يُعرِّف المستخدم بالمعالم التراثية السعودية عبر تحليل الصور بالذكاء الاصطناعي، ويقدم لكل معلم قصته التاريخية وجدول الأحداث ومعرض الصور.

**Athar** is a smart web application that identifies Saudi heritage landmarks from photos using AI, then presents each landmark's historical narrative, event timeline, and image gallery — in both Arabic and English.

---

## ✨ المميزات | Features

| الميزة | Feature |
|--------|---------|
| 📸 رفع صورة أو التقاطها | Upload or capture a photo |
| 🤖 تعرف فوري بالذكاء الاصطناعي (Groq Llama 4) | Instant AI recognition via Groq Llama 4 |
| 📖 قصة تاريخية سردية لكل معلم | Rich historical narrative per landmark |
| ⏳ جدول زمني تفاعلي للأحداث | Interactive event timeline |
| 📸 معرض صور احترافي | Professional image gallery |
| 🌍 استكشاف ثقافة المناطق السعودية | Regional Saudi culture explorer |
| 🇸🇦 / 🇬🇧 دعم العربية والإنجليزية | Full Arabic & English support |

---

## 🏛️ المعالم المدعومة | Supported Landmarks

| المعلم | Landmark | المنطقة | UNESCO |
|--------|----------|---------|--------|
| قصر سلوى | Salwa Palace | الدرعية | ✅ |
| قصر المصمك | Masmak Fort | الرياض | ❌ |
| حي الطريف | At-Turaif District | الدرعية | ✅ |
| ديوانية الإمام | Imam's Diwan | الدرعية | ✅ |
| بيت نصيف | Nasif House | جدة | ✅ |

---

## 🏗️ الهندسة المعمارية | Architecture

```
Athar/
├── backend/                 # FastAPI Python Backend
│   ├── main.py              # API endpoints + Groq integration
│   ├── requirements.txt     # Python dependencies
│   ├── render.yaml          # Render.com deployment config
│   ├── build.sh             # Build script
│   └── data/
│       └── landmarks.json   # Heritage database (5 landmarks)
│
└── frontend/                # React + Vite + Tailwind Frontend
    ├── src/
    │   ├── components/
    │   │   ├── ImageUploader.jsx    # Photo upload & preview
    │   │   ├── LandmarkResult.jsx   # Landmark info card
    │   │   ├── Timeline.jsx         # Historical timeline
    │   │   ├── ImageGallery.jsx     # Photo carousel
    │   │   ├── LanguageSwitcher.jsx # AR/EN switcher + nav
    │   │   └── RegionDetail.jsx     # Region culture page
    │   ├── pages/
    │   │   ├── HomePage.jsx         # Main upload page
    │   │   ├── ResultPage.jsx       # Landmark result page
    │   │   └── RegionsPage.jsx      # Regions explorer
    │   └── data/
    │       └── regions.json         # 5 Saudi regions data
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 التشغيل المحلي | Local Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_key_here" > .env

uvicorn main:app --reload --port 8000
```

API متاح على: `http://localhost:8000`  
توثيق Swagger: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local

npm run dev
```

التطبيق على: `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/` | Health check |
| `GET` | `/api/landmarks` | جميع المعالم |
| `GET` | `/api/landmark/{id}` | تفاصيل معلم محدد |
| `POST` | `/api/recognize` | تعرف على المعلم من صورة |

### مثال — Recognize Endpoint

```json
POST /api/recognize
{
  "image": "<base64_encoded_image>",
  "language": "ar"
}
```

---

## 🎨 تقنيات المستخدمة | Tech Stack

**Frontend**
- React 18 + React Router v6
- Tailwind CSS (custom heritage color palette)
- Vite
- Cairo Font (Google Fonts)

**Backend**
- FastAPI (Python)
- Groq API — `meta-llama/llama-4-scout-17b-16e-instruct`
- Pydantic v2
- Uvicorn

**Deployment**
- Frontend → Vercel
- Backend → Render.com

---

## 🌐 النشر | Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [project-6hfy6.vercel.app](https://project-6hfy6.vercel.app) |
| Backend | Render | [athar-7vap.onrender.com](https://athar-7vap.onrender.com) |

---

## 👨‍💻 المطور | Developer

**تركي الدعجاني** | Turki Aldaajani

مشروع تخرج — جامعة الملك سعود | Graduation Project — King Saud University

---

<div align="center">
  <sub>صُنع بـ ❤️ للتراث السعودي | Made with ❤️ for Saudi Heritage</sub>
</div>
