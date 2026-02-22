from pydantic import BaseModel
from typing import List, Optional


class Article(BaseModel):
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    url: str
    source: str
    published_at: Optional[str] = None


class SentimentRequest(BaseModel):
    articles: List[Article]


class SentimentResponse(BaseModel):
    url: str
    sentiment: str  # positive, negative, neutral
    confidence: float


class ClusteringRequest(BaseModel):
    articles: List[Article]


class ClusteringResponse(BaseModel):
    clusters: List[dict]  # grouped articles


class RecommendationRequest(BaseModel):
    user_interests: List[str]
    articles: List[Article]


class RecommendationResponse(BaseModel):
    recommendations: List[dict]


class CredibilityRequest(BaseModel):
    article: Article


class CredibilityResponse(BaseModel):
    credibility_score: float  # 0-1
    bias_level: str  # low, medium, high
    flags: List[str]  # potential issues
