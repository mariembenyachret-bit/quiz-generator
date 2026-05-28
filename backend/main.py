import os
import json
import re
import requests
import fitz
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    text = text.encode("ascii", errors="ignore").decode("ascii")
    return text.strip()

def generate_quiz(text: str, num_questions: int = 5) -> dict:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    prompt = f"""Generate exactly {num_questions} multiple choice questions from this text.
Respond ONLY with valid JSON:
{{
  "questions": [
    {{
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "A"
    }}
  ]
}}
Text: {text[:3000]}"""

    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    
    response = requests.post(url, json=payload)
    resp_json = response.json()
    if "candidates" not in resp_json:
        raise ValueError(f"Gemini error: {resp_json}")
    raw = resp_json["candidates"][0]["content"]["parts"][0]["text"]
    
    match = re.search(r'\{.*\}', raw, re.DOTALL)
    if not match:
        raise ValueError("No JSON found")
    return json.loads(match.group())

@app.post("/generate-quiz")
async def generate_quiz_route(file: UploadFile = File(...), num_questions: int = 5):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="PDF only.")
    file_bytes = await file.read()
    text = extract_text(file_bytes)
    if len(text) < 50:
        raise HTTPException(status_code=400, detail="PDF too short.")
    quiz = generate_quiz(text, num_questions)
    return quiz

@app.get("/")
def root():
    return {"status": "API is running"}