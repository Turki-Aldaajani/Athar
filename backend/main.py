from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json
from pathlib import Path
import os
import base64
import io
from groq import Groq
import imagehash
from PIL import Image

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


def load_reference_hashes():
    ref_dir = Path(__file__).parent / "data" / "reference_images"
    map_path = ref_dir / "reference_map.json"
    hashes = []
    if not map_path.exists():
        print("Warning: reference_map.json not found, skipping hash precomputation")
        return hashes
    with open(map_path, encoding="utf-8") as f:
        ref_map = json.load(f)
    for entry in ref_map.get("references", []):
        img_path = ref_dir / entry["filename"]
        if not img_path.exists():
            print(f"Warning: reference image not found: {img_path}")
            continue
        try:
            img = Image.open(img_path).convert("RGB")
            h = imagehash.phash(img)
            hashes.append({"hash": h, "landmark_id": entry["landmark_id"], "filename": entry["filename"]})
            print(f"Loaded reference hash for {entry['filename']} → {entry['landmark_id']}")
        except Exception as e:
            print(f"Warning: failed to hash {entry['filename']}: {e}")
    return hashes


REFERENCE_HASHES = load_reference_hashes()
HASH_THRESHOLD = 10

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
    if not req.image or len(req.image) == 0:
        raise HTTPException(status_code=400, detail="No image provided")

    if REFERENCE_HASHES:
        try:
            img_bytes = base64.b64decode(req.image)
            incoming_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            incoming_hash = imagehash.phash(incoming_img)
            for ref in REFERENCE_HASHES:
                distance = incoming_hash - ref["hash"]
                print(f"Hash distance to {ref['filename']}: {distance}")
                if distance <= HASH_THRESHOLD:
                    matched_id = ref["landmark_id"]
                    print(f"Fingerprint match: {ref['filename']} → {matched_id} (distance={distance})")
                    landmark = next((lm for lm in LANDMARKS if lm["id"] == matched_id), None)
                    if landmark:
                        return {
                            "recognized": True,
                            "landmark": landmark,
                            "language": req.language
                        }
        except Exception as e:
            print(f"Hash matching error (falling through to AI): {e}")

    if not groq_client:
        raise HTTPException(status_code=503, detail="Groq API not configured")

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
                            "text": """أنت نظام ذكاء اصطناعي متخصص في التعرف على التراث السعودي. انظر إلى الصورة وحدد أيّ من المعالم والشخصيات التالية تظهر فيها:

المباني التراثية:
1. قصر سلوى (Salwa Palace) — قصر طيني في الدرعية، جزء من حي الطريف
2. قصر المصمك (Masmak Fort) — حصن طيني في وسط الرياض ذو أبراج دائرية
3. حي الطريف (At-Turaif District) — منازل طينية نجدية في الدرعية على ضفة الوادي
4. ديوانية الإمام (Imam's Diwan) — مبنى تاريخي في الدرعية
5. بيت نصيف (Nasif House) — بيت حجازي تقليدي في جدة القديمة ذو رواشين خشبية
6. الحِجر مدائن صالح (Hegra Mada'in Saleh) — مقابر نبطية منحوتة في صخور وردية ضخمة في العُلا
7. حديقة البجيري (Al-Bujairi Heritage Park) — منطقة تراثية مرممة في الدرعية

القطع الأثرية والنقوش:
8. نحت الجِمال بالعُلا (Camel Site Al-Ula) — تماثيل جمال وخيول منحوتة بحجمها الطبيعي في الصخر البازلتي
9. نقوش الحِمة (Hima Rock Art) — نقوش ورسوم صخرية قديمة لحيوانات وأشكال بشرية وكتابات ثمودية

الشخصيات التاريخية:
10. الملك عبدالعزيز بن سعود (King Abdulaziz) — مؤسس المملكة العربية السعودية، رجل بملابس تقليدية وعقال

أجب بالاسم الدقيق من القائمة أعلاه فقط، بدون أي شيء آخر.
إذا لم تتطابق الصورة مع أي معلم أو شخصية، قل: "Unknown"."""
                        }
                    ]
                }
            ],
            temperature=0.1,
            max_tokens=80,
        )

        answer = vision_response.choices[0].message.content.strip().lower()
        print(f"Groq Response: {answer}")

        landmark_map = {
            # Heritage Buildings
            "salwa palace": "salwa-palace",
            "قصر سلوى": "salwa-palace",
            "masmak fort": "masmak-fort",
            "masmak": "masmak-fort",
            "المصمك": "masmak-fort",
            "قصر المصمك": "masmak-fort",
            "at-turaif": "at-turaif",
            "turaif": "at-turaif",
            "الطريف": "at-turaif",
            "حي الطريف": "at-turaif",
            "imam's diwan": "imam-diwan",
            "imam diwan": "imam-diwan",
            "ديوانية الإمام": "imam-diwan",
            "الديوانية": "imam-diwan",
            "nasif house": "nasif-house",
            "nasif": "nasif-house",
            "بيت نصيف": "nasif-house",
            "نصيف": "nasif-house",
            # Hegra / Mada'in Saleh
            "hegra": "hegra",
            "mada'in saleh": "hegra",
            "madain saleh": "hegra",
            "الحجر": "hegra",
            "مدائن صالح": "hegra",
            "الحِجر": "hegra",
            # Camel Rock Art
            "camel site": "camel-site",
            "camel rock art": "camel-site",
            "نحت الجمال": "camel-site",
            "الجِمال": "camel-site",
            "موقع الجمال": "camel-site",
            # King Abdulaziz
            "king abdulaziz": "king-abdulaziz",
            "abdulaziz": "king-abdulaziz",
            "ibn saud": "king-abdulaziz",
            "الملك عبدالعزيز": "king-abdulaziz",
            "عبدالعزيز": "king-abdulaziz",
            "ابن سعود": "king-abdulaziz",
            # Hima Rock Art
            "hima rock art": "hima-rock-art",
            "hima": "hima-rock-art",
            "نقوش الحمة": "hima-rock-art",
            "الحِمة": "hima-rock-art",
            "نقوش حائل": "hima-rock-art",
            "جبة": "hima-rock-art",
            "jubbah": "hima-rock-art",
            # Bujairi Heritage Park
            "al-bujairi": "bujairi",
            "bujairi": "bujairi",
            "البجيري": "bujairi",
            "حديقة البجيري": "bujairi",
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


class SuggestRequest(BaseModel):
    text: str
    language: str = "ar"


def build_heritage_context():
    """Build a compact summary of all heritage sites for the LLM."""
    lines = []
    # Landmarks
    for lm in LANDMARKS:
        lines.append(
            f"- {lm['name_ar']} ({lm['name_en']}): {lm.get('description_ar', '')[:120]}"
        )
    # Sub-regions from regions.json
    regions_path = Path(__file__).parent.parent / "frontend" / "src" / "data" / "regions.json"
    if regions_path.exists():
        with open(regions_path, encoding="utf-8") as f:
            rdata = json.load(f)
        for sub in rdata.get("region", {}).get("sub_regions", []):
            sites = sub.get("heritage_sites", [])
            for site in sites:
                lines.append(
                    f"- {site['name_ar']} ({site['name_en']}) في {sub['name_ar']}: {site.get('desc_ar','')[:100]}"
                )
    return "\n".join(lines)


HERITAGE_CONTEXT = build_heritage_context()


@app.post("/api/suggest")
async def suggest_places(req: SuggestRequest):
    if not groq_client:
        raise HTTPException(status_code=503, detail="Groq API not configured")

    lang = req.language
    sys_prompt = (
        "أنت مرشد تراثي سعودي ذكي ومتخصص. مهمتك أن تحلل تفضيلات المستخدم وتقترح أماكن تراثية مناسبة "
        "من قائمة المواقع التراثية السعودية المتوفرة. "
        "أجب دائماً بـ JSON فقط بدون أي نص إضافي. "
        "أعد مصفوفة JSON باسم 'suggestions' تحتوي على 3-5 عناصر بهذا الشكل:\n"
        '{"suggestions": [{"name_ar": "...", "name_en": "...", "location_ar": "...", "location_en": "...", '
        '"reason_ar": "...", "reason_en": "...", "type_ar": "...", "type_en": "...", "match_score": 90}]}\n'
        "match_score هو نسبة مئوية تعكس مدى تطابق الموقع مع تفضيلات المستخدم.\n"
        "reason_ar يجب أن يشرح لماذا هذا المكان مناسب لتفضيلات هذا المستخدم تحديداً في جملة واحدة."
    )

    user_prompt = (
        f"تفضيلات المستخدم: {req.text}\n\n"
        f"قائمة المواقع التراثية المتاحة:\n{HERITAGE_CONTEXT}\n\n"
        "اقترح أنسب 3-5 مواقع بناءً على تفضيلاته وأعد JSON فقط."
    )

    try:
        resp = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.4,
            max_tokens=1200,
        )
        raw = resp.choices[0].message.content.strip()
        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw)
        return {"ok": True, "suggestions": result.get("suggestions", [])}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        print(f"Suggest error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


FRONTEND_DIST = Path(__file__).parent.parent / "frontend" / "dist"
REF_IMAGES_DIR = Path(__file__).parent / "data" / "reference_images"
IMAGES_DIR = Path(__file__).parent / "data" / "images"

app.mount("/ref-images", StaticFiles(directory=str(REF_IMAGES_DIR)), name="ref-images")
app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

if FRONTEND_DIST.exists() and (FRONTEND_DIST / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="static-assets")


@app.on_event("startup")
async def startup_event():
    print(f"Athar API started")
    print(f"Loaded {len(LANDMARKS)} landmarks")
    print(f"Groq API: {'Configured' if groq_client else 'Not configured'}")
    print(f"Reference fingerprints loaded: {len(REFERENCE_HASHES)}")
    if FRONTEND_DIST.exists():
        print(f"Serving frontend from {FRONTEND_DIST}")
    else:
        print("Frontend dist not found — API-only mode")


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str):
    if not FRONTEND_DIST.exists():
        return {"message": "Athar API is running. Frontend not built."}
    # Serve specific static files from dist root (logo, favicon, etc.)
    requested = FRONTEND_DIST / full_path
    if requested.exists() and requested.is_file():
        return FileResponse(str(requested))
    # SPA fallback — serve index.html
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"message": "Athar API is running."}
