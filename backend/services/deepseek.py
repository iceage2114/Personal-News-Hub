import httpx
import os
from typing import Optional
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)


class DeepseekClient:
    def __init__(self):
        self.api_key = os.getenv("DEEPSEEK_API_KEY")
        self.api_url = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1")
        self.model = "deepseek-chat"
        
        if not self.api_key:
            raise ValueError("DEEPSEEK_API_KEY not set in environment variables")

    async def call_api(self, messages: list, temperature: float = 0.7) -> str:
        """Call DeepSeek API with messages"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": 1000
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.api_url}/chat/completions",
                json=payload,
                headers=headers
            )
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                detail = response.text
                raise RuntimeError(f"DeepSeek API error {response.status_code}: {detail}") from exc
            result = response.json()
            return result["choices"][0]["message"]["content"]

    async def analyze_sentiment(self, text: str) -> dict:
        """Analyze sentiment of text"""
        messages = [
            {
                "role": "system",
                "content": "You are a sentiment analysis expert. Respond with ONLY a JSON object with 'sentiment' (positive/negative/neutral) and 'confidence' (0-1)."
            },
            {
                "role": "user",
                "content": f"Analyze the sentiment of this text:\n\n{text}"
            }
        ]
        
        response = await self.call_api(messages, temperature=0.3)
        # Parse JSON response
        import json
        try:
            return json.loads(response)
        except:
            return {"sentiment": "neutral", "confidence": 0.5}

    async def cluster_articles(self, articles: list) -> list:
        """Cluster similar articles"""
        article_texts = "\n\n".join([
            f"- {article.get('title', '')}: {article.get('description', '')}"
            for article in articles
        ])
        
        messages = [
            {
                "role": "system",
                "content": "You are an expert at grouping similar news articles. Return a JSON array of clusters, where each cluster is an array of article indices."
            },
            {
                "role": "user",
                "content": f"Group these articles by topic:\n\n{article_texts}"
            }
        ]
        
        response = await self.call_api(messages)
        import json
        try:
            return json.loads(response)
        except:
            return [[i] for i in range(len(articles))]

    async def get_recommendations(self, interests: list, articles: list) -> list:
        """Get article recommendations based on user interests"""
        article_texts = "\n\n".join([
            f"{i}. {article.get('title', '')}: {article.get('description', '')}"
            for i, article in enumerate(articles)
        ])
        
        messages = [
            {
                "role": "system",
                "content": "You are a news recommender. Based on user interests, recommend the most relevant articles. Return JSON with 'recommendations' as array of article indices and 'scores'."
            },
            {
                "role": "user",
                "content": f"User interests: {', '.join(interests)}\n\nArticles:\n{article_texts}\n\nWhich articles are most relevant?"
            }
        ]
        
        response = await self.call_api(messages)
        import json
        try:
            return json.loads(response)
        except:
            return {"recommendations": list(range(len(articles))), "scores": [0.5] * len(articles)}

    async def assess_credibility(self, article: dict) -> dict:
        """Assess credibility of an article"""
        text = f"{article.get('title', '')}\n{article.get('description', '')}\n{article.get('content', '')}"
        
        messages = [
            {
                "role": "system",
                "content": "You are a fact-checking expert. Analyze articles for credibility. Return JSON with 'credibility_score' (0-1), 'bias_level' (low/medium/high), and 'flags' (array of concerns)."
            },
            {
                "role": "user",
                "content": f"Assess the credibility of this article:\n\n{text}"
            }
        ]
        
        response = await self.call_api(messages, temperature=0.2)
        import json
        try:
            return json.loads(response)
        except:
            return {
                "credibility_score": 0.5,
                "bias_level": "medium",
                "flags": []
            }
