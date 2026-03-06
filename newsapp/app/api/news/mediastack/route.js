import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get('keywords') || searchParams.get('q') || '';
    const countries = searchParams.get('countries') || searchParams.get('country') || 'us';
    const languages = searchParams.get('languages') || searchParams.get('language') || 'en';
    const categories = searchParams.get('categories') || searchParams.get('category') || '';
    const sources = searchParams.get('sources') || '';
    const date = searchParams.get('date') || '';
    const sort = searchParams.get('sort') || 'published_desc';
    const limit = searchParams.get('limit') || '25';
    const offset = searchParams.get('offset') || '0';
    
    const apiKey = process.env.MEDIASTACK_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Mediastack API key not configured' },
        { status: 500 }
      );
    }

    const baseUrl = 'https://api.mediastack.com/v1/news';
    const urlParams = new URLSearchParams({
      access_key: apiKey,
    });
    
    if (keywords) urlParams.append('keywords', keywords);
    if (countries) urlParams.append('countries', countries);
    if (languages) urlParams.append('languages', languages);
    if (categories) urlParams.append('categories', categories);
    if (sources) urlParams.append('sources', sources);
    if (date) urlParams.append('date', date);
    if (sort) urlParams.append('sort', sort);
    if (limit) urlParams.append('limit', limit);
    if (offset) urlParams.append('offset', offset);
    
    const apiUrl = `${baseUrl}?${urlParams.toString()}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Mediastack API responded with status: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    const articles = data.data ? data.data.map(item => ({
      title: item.title || '',
      description: item.description || '',
      url: item.url || '',
      urlToImage: item.image || null,
      publishedAt: item.published_at || '',
      author: item.author || null,
      source: 'Mediastack',
      sourceName: item.source || 'Mediastack',
      category: item.category || null,
      language: item.language || null,
      country: item.country || null,
    })) : [];
    
    return NextResponse.json({
      success: true,
      source: 'mediastack',
      articles: articles,
      totalResults: data.pagination?.total || articles.length,
      pagination: data.pagination || null,
    });
    
  } catch (error) {
    console.error('Mediastack API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch news from Mediastack',
        message: error.message 
      },
      { status: 500 }
    );
  }
}