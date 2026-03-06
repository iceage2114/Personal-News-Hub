import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('API Key:', process.env.GNEWS_API_KEY);

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const language = searchParams.get('language') || 'en';
    const category = searchParams.get('category') || '';
    const country = searchParams.get('country') || '';
    const max = searchParams.get('max') || '10';
    
    const apiKey = process.env.GNEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GNews API key not configured' },
        { status: 500 }
      );
    }
    
    let apiUrl;
    
    if (query) {
      apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${language}&max=${max}&apikey=${apiKey}`;
      
      if (country) {
        apiUrl += `&country=${country}`;
      }
    } else {
      apiUrl = `https://gnews.io/api/v4/top-headlines?lang=${language}&max=${max}&apikey=${apiKey}`;
      
      if (category) {
        apiUrl += `&category=${category}`;
      }
      
      if (country) {
        apiUrl += `&country=${country}`;
      }
    }
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`GNews API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // return news data
    return NextResponse.json({
      success: true,
      source: 'gnews',
      articles: data.articles || [],
      totalResults: data.totalArticles || 0,
    });
    
  } catch (error) {
    console.error('GNews API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch news from GNews API',
        message: error.message 
      },
      { status: 500 }
    );
  }
}