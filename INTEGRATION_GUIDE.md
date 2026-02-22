# Integration Guide: Frontend + FastAPI Backend

## Setup Steps

### 1. Backend Setup (FastAPI)

**Requirements**: Python 3.12

Navigate to the backend folder:
```bash
cd backend
```

Create virtual environment:
```bash
# Windows
py -3.12 -m venv venv
venv\Scripts\activate

# macOS/Linux
python3.12 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Add your DeepSeek API key to `.env`:
```
DEEPSEEK_API_KEY=your_api_key_from_deepseek
```

Get your key from: https://platform.deepseek.com/

Start the server:
```bash
python main.py
```

Backend will run on `http://localhost:8000`

### 2. Frontend Setup (Next.js)

Navigate to the frontend folder:
```bash
cd ../newsapp
```

Install dependencies (if not already done):
```bash
npm install
```

The `.env.local` already has:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Start the dev server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Use Enhanced Features

Go to http://localhost:3000/tailored

1. **Search for articles** using the filters
2. **Click AI buttons** once articles are loaded:
   - 📊 **Sentiment Analysis** - See if articles are positive/negative
   - 🔗 **Cluster Articles** - Group similar stories together
   - ⭐ **Personalized Recommendations** - Get best matches for your interests

## API Files Created

### Frontend Integration Layer
- [lib/llm-api.js](../newsapp/lib/llm-api.js) - Functions to call FastAPI endpoints

### Backend Implementation
- [services/deepseek.py](../backend/services/deepseek.py) - DeepSeek LLM client
- [routes/sentiment.py](../backend/routes/sentiment.py) - Sentiment analysis endpoint
- [routes/clustering.py](../backend/routes/clustering.py) - Article clustering endpoint
- [routes/recommendations.py](../backend/routes/recommendations.py) - Recommendations endpoint
- [routes/credibility.py](../backend/routes/credibility.py) - Credibility assessment (placeholder)

## Architecture

```
Frontend (Next.js)
    ↓ HTTP requests
lib/llm-api.js (makes API calls)
    ↓
Backend (FastAPI on :8000)
    ↓
services/deepseek.py (calls DeepSeek API)
    ↓
DeepSeek LLM API
```

## Features

### 1. Sentiment Analysis
Analyzes article headlines + descriptions for sentiment (positive/negative/neutral)

### 2. Article Clustering
Groups similar articles by topic using LLM understanding

### 3. Personalized Recommendations
Ranks articles by relevance to your keywords/interests

### 4. Credibility Assessment
Evaluates article trustworthiness and bias levels (ready for enhancement)

## Troubleshooting

### Backend not connecting?
- Check `http://localhost:8000/docs` - should show API docs
- Verify `.env` has valid `DEEPSEEK_API_KEY`
- Check Python virtual environment is activated

### CORS errors?
- Backend CORS is set to allow `localhost:3000`
- Make sure frontend is running on port 3000

### Slow responses?
- DeepSeek API calls take time (5-30 seconds per request)
- This is normal for LLM processing
- Consider limiting articles for faster results

## Next Steps

1. ✅ Set up both servers
2. ✅ Test basic search
3. ✅ Try LLM features
4. Enhance credibility scoring
5. Add custom prompts for specific analysis
6. Deploy to production (render.com, vercel, etc.)
