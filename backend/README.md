# News App FastAPI Backend

FastAPI backend for LLM-powered news analysis using DeepSeek.

## Features

- **Sentiment Analysis**: Analyze sentiment of news articles
- **Article Clustering**: Group similar articles by topic
- **Personalized Recommendations**: Recommend articles based on user interests
- **Credibility Assessment**: Assess article credibility and bias levels

## Setup

### 1. Create Virtual Environment

**Requirements**: Python 3.12

```bash
cd backend

# Windows
py -3.12 -m venv venv
venv\Scripts\activate

# macOS/Linux
python3.12 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Environment Variables

Create `.env` file with:

```
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1
FRONTEND_URL=http://localhost:3000
```

Get your DeepSeek API key from [https://platform.deepseek.com/](https://platform.deepseek.com/)

### 4. Run Server

```bash
python main.py
```

Server runs on `http://localhost:8000`

## API Endpoints

### Sentiment Analysis

```
POST /sentiment/analyze
```

Analyze sentiment of multiple articles.

### Article Clustering

```
POST /clustering/cluster
```

Group similar articles by topic.

### Recommendations

```
POST /recommendations/recommend
```

Get personalized article recommendations based on user interests.

### Credibility Assessment

```
POST /credibility/assess
```

Assess credibility and bias level of an article.

## Documentation

- Interactive docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Architecture

- **main.py**: FastAPI app setup and routes
- **routes/**: Individual endpoint handlers
- **services/**: DeepSeek API integration
- **models/**: Pydantic schemas for request/response validation
