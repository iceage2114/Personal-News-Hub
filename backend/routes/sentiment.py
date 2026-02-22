from fastapi import APIRouter, HTTPException
from typing import List
from models.schemas import Article, SentimentRequest, SentimentResponse
from services.deepseek import DeepseekClient

router = APIRouter(prefix="/sentiment", tags=["sentiment"])
deepseek = DeepseekClient()


@router.post("/analyze", response_model=List[SentimentResponse])
async def analyze_sentiment(request: SentimentRequest):
    """Analyze sentiment of articles"""
    try:
        results = []
        for article in request.articles:
            text = f"{article.title}. {article.description or ''}"
            sentiment_data = await deepseek.analyze_sentiment(text)
            
            results.append(SentimentResponse(
                url=article.url,
                sentiment=sentiment_data.get("sentiment", "neutral"),
                confidence=sentiment_data.get("confidence", 0.5)
            ))
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
