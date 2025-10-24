# AI Wiki Quiz Generator

A full-stack application that transforms Wikipedia articles into engaging educational quizzes using AI.

## Features

- 📚 **Wikipedia Integration**: Automatically scrapes and processes Wikipedia articles
- 🤖 **AI-Powered**: Uses Google Gemini AI to generate intelligent quiz questions
- 💾 **Quiz History**: Saves all generated quizzes to SQLite database
- 🎨 **Beautiful UI**: Clean, responsive interface built with React and Tailwind CSS
- ✅ **Smart Questions**: Multiple-choice questions with explanations and correct answers
- 🔑 **Key Insights**: Extracts key entities and suggests related topics

## Tech Stack

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy (SQLite)
- BeautifulSoup4 (Web scraping)
- LangChain + Google Gemini AI
- Pydantic (Data validation)

### Frontend
- React (Vite)
- Tailwind CSS
- Axios

## API Endpoints

### `POST /generate_quiz`
Generate a new quiz from a Wikipedia URL.

**Request:**
```json
{
  "url": "https://en.wikipedia.org/wiki/Artificial_Intelligence"
}
```

**Response:**
```json
{
  "id": 1,
  "quiz_data": {
    "title": "Artificial Intelligence",
    "summary": "...",
    "questions": [...],
    "key_entities": [...],
    "related_topics": [...]
  },
  "message": "Quiz generated successfully"
}
```

### `GET /history`
Get all generated quizzes.

**Response:**
```json
[
  {
    "id": 1,
    "url": "https://...",
    "title": "...",
    "date_generated": "2025-10-24T..."
  }
]
```

### `GET /quiz/{quiz_id}`
Get a specific quiz by ID.

**Response:**
```json
{
  "id": 1,
  "url": "https://...",
  "title": "...",
  "date_generated": "2025-10-24T...",
  "quiz_data": {...}
}
```

## Project Structure

```
.
├── backend/
│   ├── database.py              # SQLAlchemy setup and models
│   ├── models.py                # Pydantic schemas for LLM output
│   ├── scraper.py               # Wikipedia scraping logic
│   ├── llm_quiz_generator.py   # Gemini AI quiz generation
│   ├── main.py                  # FastAPI application and endpoints
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── services/            # API communication
│   │   ├── tabs/                # Main tab components
│   │   ├── App.jsx              # Main React component
│   │   └── index.css            # Tailwind CSS
│   └── package.json
│
└── README.md
```

## Usage

1. Navigate to the application
2. Click on "Generate Quiz" tab
3. Enter a Wikipedia URL (e.g., https://en.wikipedia.org/wiki/Python_(programming_language))
4. Click "Generate Quiz"
5. Wait 10-30 seconds for the AI to analyze and generate the quiz
6. View your quiz with questions, answers, and explanations
7. Check "Quiz History" tab to view all previously generated quizzes

## How It Works

1. **Scraping**: The app fetches the Wikipedia article and extracts clean text content
2. **AI Processing**: Google Gemini analyzes the content and generates:
   - 7-10 multiple-choice questions
   - Correct answers with explanations
   - Article summary
   - Key entities/concepts
   - Related topics for further reading
3. **Storage**: All data is saved to SQLite database
4. **Display**: React frontend presents the quiz in an engaging, educational format
