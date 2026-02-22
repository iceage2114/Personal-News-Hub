from fastapi import APIRouter, HTTPException
from models.schemas import Article, RecommendationRequest, RecommendationResponse
from services.deepseek import DeepseekClient

router = APIRouter(prefix="/recommendations", tags=["recommendations"])
deepseek = DeepseekClient()


@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """Get personalized article recommendations based on user interests"""
    try:
        articles_data = [
            {
                "title": article.title,
                "description": article.description,
                "content": article.content,
                "url": article.url,
                "source": article.source
            }
            for article in request.articles
        ]

        def score_article(article: dict, interests: list) -> float:
            text = " ".join(
                filter(
                    None,
                    [
                        article.get("title", ""),
                        article.get("description", ""),
                        article.get("content", "")
                    ]
                )
            ).lower()
            if not text:
                return 0.0
            score = 0.0
            for term in interests:
                t = term.strip().lower()
                if not t:
                    continue
                occurrences = text.count(t)
                if occurrences > 0:
                    score += 1.0 + (occurrences - 1) * 0.25
            return score

        local_scores = [score_article(a, request.user_interests) for a in articles_data]
        
        rec_data = await deepseek.get_recommendations(
            request.user_interests,
            articles_data
        )

        rec_indices = rec_data.get("recommendations", []) if isinstance(rec_data, dict) else []
        rec_scores = rec_data.get("scores", []) if isinstance(rec_data, dict) else []

        # If LLM returns empty or everything, fall back to local ranking
        use_local_only = len(rec_indices) == 0 or len(rec_indices) >= len(articles_data)

        recommendations = []
        if not use_local_only:
            for i, idx in enumerate(rec_indices):
                if idx < len(articles_data):
                    llm_score = rec_scores[i] if i < len(rec_scores) else 0.5
                    combined_score = llm_score + local_scores[idx]
                    recommendations.append({
                        "url": articles_data[idx]["url"],
                        "title": articles_data[idx]["title"],
                        "source": articles_data[idx]["source"],
                        "relevance_score": combined_score
                    })

        if use_local_only or len(recommendations) == 0:
            ranked = sorted(
                enumerate(articles_data),
                key=lambda x: local_scores[x[0]],
                reverse=True
            )
            for idx, article in ranked:
                recommendations.append({
                    "url": article["url"],
                    "title": article["title"],
                    "source": article["source"],
                    "relevance_score": local_scores[idx]
                })

        # Drop clearly unrelated articles when we have preferences
        if request.user_interests:
            recommendations = [r for r in recommendations if r.get("relevance_score", 0) > 0]

        return RecommendationResponse(recommendations=recommendations)
    except Exception as e:
        # Fallback: return a basic ranked list instead of 500
        recommendations = [
            {
                "url": article.url,
                "title": article.title,
                "source": article.source,
                "relevance_score": 0.5
            }
            for article in request.articles
        ]
        return RecommendationResponse(recommendations=recommendations)
