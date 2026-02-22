# News App

A full-stack news aggregation and analysis platform with AI-powered features including sentiment analysis, article clustering, personalized recommendations, and credibility assessment.

## Features

- **News Aggregation**: Fetch news from multiple sources (GNews, Currents, MediaStack, NewsAPI)
- **Sentiment Analysis**: AI-powered sentiment analysis of news articles
- **Article Clustering**: Automatically group similar articles by topic
- **Personalized Recommendations**: Get article recommendations based on your interests
- **Credibility Assessment**: Assess article credibility and detect bias
- **Advanced Search**: Filter and search news with advanced criteria
- **Tailored Feed**: Customize your news feed based on preferences

## Tech Stack

### Backend
- **FastAPI**: Modern, fast Python web framework
- **DeepSeek AI**: LLM integration for news analysis
- **Uvicorn**: ASGI server

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript

## Start with Docker

The easiest way to run the entire application:

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd NewsApp
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   DEEPSEEK_API_KEY=your_deepseek_api_key
   ```

3. **Build and run**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

See [DOCKER.md](DOCKER.md) for detailed Docker instructions.

## Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment** (Python 3.12 required)
   ```bash
   # Windows
   py -3.12 -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3.12 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file**
   ```env
   DEEPSEEK_API_KEY=your_api_key_here
   DEEPSEEK_API_URL=https://api.deepseek.com/v1
   FRONTEND_URL=http://localhost:3000
   ```

5. **Run the server**
   ```bash
   python main.py
   ```
   
   Server runs on http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd newsapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   Create `.env.local` if needed:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   App runs on http://localhost:3000

## Project Structure

```
NewsApp/
├── backend/                 # FastAPI backend
│   ├── main.py             # Application entry point
│   ├── routes/             # API endpoints
│   ├── services/           # DeepSeek AI integration
│   ├── models/             # Pydantic schemas
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker configuration
├── newsapp/                # Next.js frontend
│   ├── app/                # Next.js App Router pages
│   ├── lib/                # Utility functions and API clients
│   ├── public/             # Static assets
│   ├── package.json        # Node dependencies
│   └── Dockerfile          # Frontend Docker configuration
├── docker-compose.yml      # Docker orchestration
├── .env.example            # Example environment variables
└── DOCKER.md               # Docker documentation
```

## API Keys

You'll need the following API keys:

1. **DeepSeek API**: Get your key from [DeepSeek Platform](https://platform.deepseek.com/)
2. **News APIs** (for frontend):
   - [GNews](https://gnews.io/)
   - [Currents](https://currentsapi.services/)
   - [MediaStack](https://mediastack.com/)
   - [NewsAPI](https://newsapi.org/)

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

- `POST /sentiment/analyze` - Analyze article sentiment
- `POST /clustering/cluster` - Cluster similar articles
- `POST /recommendations/recommend` - Get personalized recommendations
- `POST /credibility/assess` - Assess article credibility

## Development

### Backend
```bash
cd backend
# Activate virtual environment
# Run in development mode with auto-reload
uvicorn main:app --reload
```

### Frontend
```bash
cd newsapp
# Run in development mode with hot-reload
npm run dev
```

## Building

### Using Docker
```bash
docker-compose up --build
```

### Manual Build

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd newsapp
npm run build
npm start
```

### Port Conflicts
If ports 3000 or 8000 are in use:
- Change ports in `docker-compose.yml` (Docker)
- Or run services on different ports locally

### API Key Issues
Ensure your `.env` file is properly configured with valid API keys.