# AI Wiki Quiz Generator

## Overview
A full-stack application that transforms Wikipedia articles into engaging educational quizzes using Google Gemini AI. The application scrapes Wikipedia content, generates intelligent quiz questions with explanations, and stores everything in an SQLite database for historical reference.

## Project State
**Status:** Fully Implemented ✅  
**Date Created:** October 24, 2025  
**Last Updated:** October 24, 2025

## Recent Changes
- **October 24, 2025:** Complete implementation of AI Wiki Quiz Generator
  - Built Python FastAPI backend with SQLite database
  - Implemented Wikipedia scraping with BeautifulSoup
  - Integrated Google Gemini AI via LangChain for quiz generation
  - Created React frontend with Tailwind CSS
  - Added two-tab interface: Generate Quiz and Quiz History
  - Configured workflows for backend (port 8000) and frontend (port 5000)

## Tech Stack

### Backend (Python)
- **Framework:** FastAPI
- **Database:** SQLite with SQLAlchemy ORM
- **Web Scraping:** BeautifulSoup4 + Requests
- **AI/LLM:** LangChain + Google Gemini AI (gemini-2.0-flash-exp)
- **Validation:** Pydantic
- **Environment:** Python 3.11, python-dotenv

### Frontend (React)
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with @tailwindcss/postcss
- **HTTP Client:** Axios
- **Routing:** Single-page app with tab navigation

## Project Architecture

### Backend Structure
```
backend/
├── database.py              # SQLAlchemy models and DB setup
├── models.py                # Pydantic schemas for LLM output
├── scraper.py               # Wikipedia content extraction
├── llm_quiz_generator.py   # Gemini AI quiz generation logic
├── main.py                  # FastAPI application & endpoints
├── .env                     # Environment variables (API keys)
└── requirements.txt         # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Modal.jsx        # Reusable modal component
│   │   └── QuizDisplay.jsx  # Quiz rendering component
│   ├── services/
│   │   └── api.js           # API communication layer
│   ├── tabs/
│   │   ├── GenerateQuizTab.jsx  # Quiz generation interface
│   │   └── HistoryTab.jsx       # Quiz history table
│   ├── App.jsx              # Main app with tab management
│   └── index.css            # Tailwind directives
└── package.json
```

## API Endpoints

### POST /generate_quiz
Generates a new quiz from a Wikipedia URL.
- **Input:** `{ "url": "https://en.wikipedia.org/wiki/..." }`
- **Output:** Quiz ID and complete quiz data (questions, summary, entities, topics)
- **Process:** Scrapes → AI processes → Saves to DB → Returns quiz

### GET /history
Returns all previously generated quizzes.
- **Output:** Array of quiz metadata (id, url, title, date)

### GET /quiz/{quiz_id}
Retrieves a specific quiz by ID.
- **Output:** Complete quiz data including all questions and metadata

## Features

### Quiz Generation
- Accepts any Wikipedia article URL
- Scrapes and cleans article content
- Generates 7-10 multiple-choice questions via AI
- Each question includes:
  - 4 answer options
  - Correct answer highlighted
  - Detailed explanation
- Extracts key entities and related topics
- Creates article summary

### Quiz History
- Displays all generated quizzes in a table
- Shows ID, title, URL, and generation date
- "View Details" button opens modal with full quiz
- Persistent storage in SQLite database

### UI/UX
- Clean, educational design with gradient backgrounds
- Two-tab interface for easy navigation
- Real-time loading states with spinners
- Error handling and validation
- Responsive design with Tailwind CSS
- Modal popups for detailed quiz viewing

## Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (required for quiz generation)

## Database Schema

### Quiz Table
- `id`: Primary key (auto-increment)
- `url`: Wikipedia article URL
- `title`: Article title
- `date_generated`: Timestamp of quiz creation
- `scraped_content`: Raw cleaned article text
- `full_quiz_data`: JSON string of complete quiz structure

## Workflows
1. **Backend:** `uvicorn main:app --host 0.0.0.0 --port 8000` (Console output)
2. **Frontend:** `npm run dev` (Webview on port 5000)

## How It Works

1. **User Input:** User enters a Wikipedia URL in the frontend
2. **Scraping:** Backend fetches and cleans the article content
3. **AI Processing:** Gemini AI analyzes content and generates:
   - Educational quiz questions
   - Answer options with one correct answer
   - Explanations for each correct answer
   - Article summary
   - Key concepts/entities
   - Related topics for further study
4. **Storage:** Complete quiz data saved to SQLite database
5. **Display:** Frontend shows quiz immediately with styled components
6. **History:** All quizzes accessible via History tab with modal view

## User Preferences
- Uses SQLite for database (as specified in requirements)
- Gemini AI model: gemini-2.0-flash-exp
- Generates 7-10 questions per quiz
- Clean, educational-focused UI design
