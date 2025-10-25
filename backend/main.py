# backend/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Ensure these imports match your file names and function signatures
from database import init_db, get_db, Quiz
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz
from models import QuizOutput, QuizRequest # Assuming QuizRequest is used
from models import QuizHistoryResponse # Assuming this is used for history response

# --- FINAL CONFIGURATION ---
# CRITICAL FIX: Explicitly set the Vercel URL to resolve CORS error
VERCEL_FRONTEND_URL = "https://ai-quiz-generator-6khj.vercel.app" 
RENDER_API_URL = "https://ai-quiz-generator-api-wkj1.onrender.com"

app = FastAPI(title="AI Wiki Quiz Generator")

app.add_middleware(
    CORSMiddleware,
    # FIX: Explicitly list origins to prevent deployment CORS errors
    allow_origins=[
        "http://localhost:5173", # VITE Dev environment
        "http://127.0.0.1:5173",
        VERCEL_FRONTEND_URL,     # <-- YOUR LIVE VERCEL DOMAIN
        RENDER_API_URL,          # Allow self-reference
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

# --- ENDPOINTS ---

class GenerateQuizRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"message": "AI Wiki Quiz Generator API", "status": "running"}

@app.post("/generate_quiz")
def generate_quiz_endpoint(request: GenerateQuizRequest, db: Session = Depends(get_db)):
    try:
        if not request.url.strip():
            raise HTTPException(status_code=400, detail="URL cannot be empty")
        
        if "wikipedia.org" not in request.url.lower():
            raise HTTPException(status_code=400, detail="Please provide a valid Wikipedia URL")
        
        # 1. Scrape data
        scraped_data = scrape_wikipedia(request.url) 
        
        if not scraped_data or len(scraped_data["content"]) < 200:
             raise HTTPException(status_code=400, detail="Extracted content is too short or empty for quiz generation.")
        
        # 2. Generate Quiz
        quiz_data = generate_quiz(scraped_data["title"], scraped_data["content"])
        
        # 3. Save to DB
        quiz_record = Quiz(
            url=request.url,
            title=quiz_data.get("title", scraped_data["title"]), 
            scraped_content=scraped_data["content"],
            full_quiz_data=json.dumps(quiz_data)
        )
        
        db.add(quiz_record)
        db.commit()
        db.refresh(quiz_record)
        
        return {
            "id": quiz_record.id,
            "quiz_data": quiz_data,
            "message": "Quiz generated successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Server processing error: {e}")
        raise HTTPException(status_code=500, detail="Quiz generation failed due to internal error or LLM formatting.")

@app.get("/history", response_model=List[QuizHistoryResponse])
def get_history(db: Session = Depends(get_db)):
    try:
        quizzes = db.query(Quiz).order_by(Quiz.date_generated.desc()).all()
        return quizzes
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    try:
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        quiz_data = json.loads(quiz.full_quiz_data)
        
        return {
            "id": quiz.id,
            "url": quiz.url,
            "title": quiz.title,
            "date_generated": quiz.date_generated,
            "quiz_data": quiz_data
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))