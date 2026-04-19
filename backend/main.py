from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from pathlib import Path
import os
from groq import Groq

app = FastAPI(
    title="Athar API",
    description="Smart Saudi Heritage Guide",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://athar-heritage-guide.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_landmarks():
    db_path = Path(__file__).parent / "data" / "landmarks.json"
    if db_path.exists():
        with open(db_path, encoding="utf-8") as f:
            data = json.load(f)
            return data.get("landmarks", [])
    return []


LANDMARKS = load_landmarks()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = None

if GROQ_API_KEY:
    try:
        groq_client = Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Warning: Groq client initialization failed: {e}")


class RecognizeRequest(BaseModel):
    image: str  # base64
    language: str = "ar"


@app.get("/")
def root():
    return {
        "message": "Athar API — Smart Saudi Heritage Guide",
        "status": "running",
        "landmarks_count": len(LANDMARKS)
    }


@app.get("/api/landmarks")
def get_all_landmarks(language: str = "ar"):
    return {
        "landmarks": LANDMARKS,
        "count": len(LANDMARKS),
        "language": language
    }


@app.get("/api/landmark/{landmark_id}")
def get_landmark_details(landmark_id: str, language: str = "ar"):
    landmark = next((lm for lm in LANDMARKS if lm["id"] == landmark_id), None)
    if not landmark:
        raise HTTPException(status_code=404, detail="Landmark not found")
    return {"landmark": landmark, "language": language}


@app.post("/api/recognize")
async def recognize_landmark(req: RecognizeRequest):
    if not groq_client:
        raise HTTPException(status_code=503, detail="Groq API not configured")

    if not req.image or len(req.image) == 0:
        raise HTTPException(status_code=400, detail="No image provided")

    try:
        print("Sending image to Groq Vision...")

        vision_response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{req.image}"}
                        },
                        {
                            "type": "text",
                            "text": """التعرف على المعلم التراثي السعودي. اختر من بين هذه الخيارات فقط:
1. قصر سلوى (Salwa Palace)
2. قصر المصمك (Masmak Fort)
3. حي الطريف (At-Turaif District)
4. ديوانية الإمام (Imam's Diwan)
5. بيت نصيف (Nasif House)

أجب بالاسم الدقيق من القائمة أعلاه فقط، بدون أي شيء آخر.
إذا لم تتطابق الصورة مع أي معلم، قل: "Unknown"."""
                        }
                    ]
                }
            ],
            temperature=0.1,
            max_tokens=50,
        )

        answer = vision_response.choices[0].message.content.strip().lower()
        print(f"Groq Response: {answer}")

        landmark_map = {
            "salwa palace": "salwa-palace",
            "قصر سلوى": "salwa-palace",
            "masmak fort": "masmak-fort",
            "قصر المصمك": "masmak-fort",
            "at-turaif": "at-turaif",
            "حي الطريف": "at-turaif",
            "imam's diwan": "imam-diwan",
            "ديوانية الإمام": "imam-diwan",
            "nasif house": "nasif-house",
            "بيت نصيف": "nasif-house",
        }

        landmark_id = None
        for key, value in landmark_map.items():
            if key in answer:
                landmark_id = value
                break

        if not landmark_id or "unknown" in answer:
            return {
                "recognized": False,
                "message_ar": "لم نتمكن من التعرف على هذا المعلم. جرّب معلماً آخر من قائمتنا.",
                "message_en": "We couldn't recognize this landmark. Try another from our collection.",
                "landmarks_list": [{"id": lm["id"], "name": lm["name_ar"]} for lm in LANDMARKS]
            }

        landmark = next((lm for lm in LANDMARKS if lm["id"] == landmark_id), None)

        if not landmark:
            raise HTTPException(status_code=404, detail="Landmark not found in database")

        return {
            "recognized": True,
            "landmark": landmark,
            "language": req.language
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.on_event("startup")
async def startup_event():
    print(f"Athar API started")
    print(f"Loaded {len(LANDMARKS)} landmarks")
    print(f"Groq API: {'Configured' if groq_client else 'Not configured'}")
