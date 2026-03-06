import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('API Key:', process.env.CURRENTS_API_KEY);

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const language = searchParams.get('language') || 'en';
    const category = searchParams.get('category') || '';
    const domain = searchParams.get('domain') || '';
    
    const apiKey = process.env.CURRENTS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Currents API key not configured' },
        { status: 500 }
      );
    }
    
    let apiUrl;
    
    if (query) {
      apiUrl = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&language=${language}`;
      
      if (domain) {
        apiUrl += `&domain=${domain}`;
      }
    } else {
      apiUrl = `https://api.currentsapi.services/v1/latest-news?language=${language}`;
      
      if (category) {
        apiUrl += `&category=${category}`;
      }
    }
    
    // request to Currents API
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': apiKey,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Currents API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // return news data
    return NextResponse.json({
      success: true,
      source: 'currents',
      articles: data.news || [],
      totalResults: data.news?.length || 0,
    });
    
  } catch (error) {
    console.error('Currents API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch news from Currents API',
        message: error.message 
      },
      { status: 500 }
    );
  }
}