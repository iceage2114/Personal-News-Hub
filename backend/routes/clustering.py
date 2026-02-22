from fastapi import APIRouter, HTTPException
from models.schemas import Article, ClusteringRequest, ClusteringResponse
from services.deepseek import DeepseekClient

router = APIRouter(prefix="/clustering", tags=["clustering"])
deepseek = DeepseekClient()


@router.post("/cluster", response_model=ClusteringResponse)
async def cluster_articles(request: ClusteringRequest):
    """Cluster similar articles together"""
    try:
        articles_data = [
            {
                "title": article.title,
                "description": article.description,
                "url": article.url,
                "source": article.source
            }
            for article in request.articles
        ]
        
        clusters = await deepseek.cluster_articles(articles_data)
        
        # Map cluster indices back to articles
        clustered_articles = []
        for cluster in clusters:
            cluster_articles = [
                {
                    "url": articles_data[i]["url"],
                    "title": articles_data[i]["title"],
                    "source": articles_data[i]["source"]
                }
                for i in cluster if i < len(articles_data)
            ]
            if cluster_articles:
                clustered_articles.append({
                    "cluster_id": len(clustered_articles),
                    "articles": cluster_articles
                })
        
        return ClusteringResponse(clusters=clustered_articles)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
