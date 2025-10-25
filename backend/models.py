# backend/models.py
from pydantic import BaseModel, Field
from typing import List

class Question(BaseModel):
    question: str = Field(description="The quiz question")
    options: List[str] = Field(description="List of 4 multiple choice options")
    correct_answer: str = Field(description="The correct answer from the options")
    explanation: str = Field(description="Brief explanation of why the answer is correct")
    topic_area: str = Field(description="The specific topic covered by the question.") # Added field

class QuizOutput(BaseModel):
    title: str = Field(description="Title of the Wikipedia article")
    summary: str = Field(description="Brief summary of the article (2-3 sentences)")
    questions: List[Question] = Field(description="List of 5-10 quiz questions")
    key_entities: List[str] = Field(description="List of 3-5 key entities or concepts from the article")
    related_topics: List[str] = Field(description="List of 3-5 related topics for further reading")