// LLM API integration with FastAPI backend

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

function getSourceName(article) {
  if (!article) return 'Unknown';
  const src = article.source;
  if (typeof src === 'string') return src;
  if (src && typeof src === 'object') return src.name || src.id || article.sourceType || 'Unknown';
  return article.sourceType || 'Unknown';
}

// Sentiment Analysis
export async function analyzeSentiment(articles) {
  try {
    const response = await fetch(`${BACKEND_URL}/sentiment/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articles: articles.map(article => ({
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: getSourceName(article)
        }))
      })
    });

    if (!response.ok) throw new Error('Sentiment analysis failed');
    return await response.json();
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return null;
  }
}

// Article Clustering
export async function clusterArticles(articles) {
  try {
    const response = await fetch(`${BACKEND_URL}/clustering/cluster`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articles: articles.map(article => ({
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: getSourceName(article)
        }))
      })
    });

    if (!response.ok) throw new Error('Clustering failed');
    return await response.json();
  } catch (error) {
    console.error('Clustering error:', error);
    return null;
  }
}

// Get Recommendations
export async function getRecommendations(userInterests, articles) {
  try {
    const response = await fetch(`${BACKEND_URL}/recommendations/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_interests: userInterests,
        articles: articles.map(article => ({
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: getSourceName(article)
        }))
      })
    });

    if (!response.ok) throw new Error('Recommendations failed');
    return await response.json();
  } catch (error) {
    console.error('Recommendations error:', error);
    return null;
  }
}

// Assess Credibility
export async function assessCredibility(article) {
  try {
    const response = await fetch(`${BACKEND_URL}/credibility/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        article: {
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: getSourceName(article)
        }
      })
    });

    if (!response.ok) throw new Error('Credibility assessment failed');
    return await response.json();
  } catch (error) {
    console.error('Credibility assessment error:', error);
    return null;
  }
}
