from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import json
from datetime import datetime

from database import init_db, get_db, Quiz
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz

app = FastAPI(title="AI Wiki Quiz Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

class GenerateQuizRequest(BaseModel):
    url: str

class QuizHistoryResponse(BaseModel):
    id: int
    url: str
    title: str
    date_generated: datetime

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
        
        scraped_data = scrape_wikipedia(request.url)
        
        quiz_data = generate_quiz(scraped_data["title"], scraped_data["content"])
        
        quiz_record = Quiz(
            url=request.url,
            title=quiz_data["title"],
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
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    try:
        quizzes = db.query(Quiz).order_by(Quiz.date_generated.desc()).all()
        
        return [
            QuizHistoryResponse(
                id=quiz.id,
                url=quiz.url,
                title=quiz.title,
                date_generated=quiz.date_generated
            )
            for quiz in quizzes
        ]
    
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
