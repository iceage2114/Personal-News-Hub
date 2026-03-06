import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const language = searchParams.get('language') || 'en';
    const category = searchParams.get('category') || '';
    const country = searchParams.get('country') || 'us';
    const sources = searchParams.get('sources') || '';
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'News API key not configured' },
        { status: 500 }
      );
    }
    
    let apiUrl;
    
    if (query) {
      apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${language}&sortBy=${sortBy}`;
      if (from) apiUrl += `&from=${from}`;
      if (to) apiUrl += `&to=${to}`;
      if (sources) apiUrl += `&sources=${sources}`;
    } else if (sources) {
      apiUrl = `https://newsapi.org/v2/top-headlines?sources=${sources}`;
    } else {
      apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&language=${language}`;
      if (category) apiUrl += `&category=${category}`;
    }
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Api-Key': apiKey,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`News API responded with status: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    // transform articles for proper source format
    const articles = data.articles ? data.articles.map(article => ({
      ...article,
      source: 'News API',
      sourceName: article.source?.name || 'News API'
    })) : [];
    
    return NextResponse.json({
      success: true,
      source: 'newsapi',
      articles: articles,
      totalResults: data.totalResults || 0,
      status: data.status,
    });
    
  } catch (error) {
    console.error('News API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch news from News API',
        message: error.message 
      },
      { status: 500 }
    );
  }
}