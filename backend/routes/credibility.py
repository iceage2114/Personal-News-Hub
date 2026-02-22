from fastapi import APIRouter, HTTPException
from models.schemas import Article, CredibilityRequest, CredibilityResponse
from services.deepseek import DeepseekClient

router = APIRouter(prefix="/credibility", tags=["credibility"])
deepseek = DeepseekClient()


@router.post("/assess", response_model=CredibilityResponse)
async def assess_credibility(request: CredibilityRequest):
    """Assess the credibility of an article"""
    try:
        article_data = {
            "title": request.article.title,
            "description": request.article.description,
            "content": request.article.content,
            "source": request.article.source
        }
        
        credibility = await deepseek.assess_credibility(article_data)
        
        return CredibilityResponse(
            credibility_score=credibility.get("credibility_score", 0.5),
            bias_level=credibility.get("bias_level", "medium"),
            flags=credibility.get("flags", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
