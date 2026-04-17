# Sentiment Analyzer

Analyzes customer reviews from a CSV file, classifying each review as positive, negative, or neutral using OpenAI's GPT-4o. Displays sentiment metrics, a donut chart, a paginated review table, and AI-generated summaries of what customers love and what they complain about.

## Architecture

```
sentiment_analyzer_app_v1/
├── backend.py        FastAPI server — /analyze and /summarize endpoints
├── app_final.py      Streamlit frontend (calls the FastAPI backend)
├── frontend/         React + TypeScript + Tailwind SaaS dashboard (also calls the backend)
└── reviews.csv       Sample data for testing
```

The FastAPI backend is the single source of AI logic. Both frontends are independent and interchangeable — run whichever you prefer alongside the backend.

## Dependencies

**Backend**
```bash
pip install fastapi uvicorn openai
```

**Streamlit frontend**
```bash
pip install streamlit pandas plotly requests
```

**React frontend**
```bash
cd frontend
npm install
```

## Running the app

### Backend (required by both frontends)
```bash
python backend.py
# Runs on http://localhost:8000
```

### Option A — React dashboard
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```
The Vite dev server proxies `/analyze` and `/summarize` to `http://localhost:8000`, so there are no CORS issues.

### Option B — Streamlit
```bash
streamlit run app_final.py
# Runs on http://localhost:8501
```

In both frontends, enter your OpenAI API key at runtime. It is passed directly to the backend per request and never stored.

## API endpoints

### `POST /analyze`
Classifies a list of reviews.

```json
// Request
{ "reviews": ["Great food!", "Terrible service."], "api_key": "sk-..." }

// Response
{ "results": [{ "review": "Great food!", "sentiment": "positive" }, ...] }
```

### `POST /summarize`
Summarizes reviews grouped by sentiment.

```json
// Request
{ "groups": { "positive": ["Great food!"], "negative": ["Terrible service."] }, "api_key": "sk-..." }

// Response
{ "summaries": { "positive": "Customers love...", "negative": "Main complaints..." } }
```
