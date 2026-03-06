'use client';

import { useState, useEffect } from 'react';
import NewsView from './NewsView';
import { get } from '@/lib/api';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  useEffect(() => {
    fetchNews();
    testBackendConnection();
  }, []);

  async function testBackendConnection() {
    try {
      const health = await get('/health');
      console.log('Backend health check:', health);
    } catch (err) {
      console.error('Backend connection failed:', err.message);
    }
  }

  async function fetchNews() {
    try {
      setLoading(true);
      
      // Fetch from all available news sources
      const [gnewsResponse, currentsResponse, newsApiResponse, mediastackResponse] = await Promise.all([
        fetch('/api/news/gnews?language=en').catch(err => {
          console.error('GNews fetch failed:', err);
          return { ok: false };
        }),
        fetch('/api/news/currents?language=en').catch(err => {
          console.error('Currents fetch failed:', err);
          return { ok: false };
        }),
        fetch('/api/news/newsapi?country=us&language=en').catch(err => {
          console.error('News API fetch failed:', err);
          return { ok: false };
        }),
        fetch('/api/news/mediastack?countries=us&languages=en&limit=25').catch(err => {
          console.error('Mediastack fetch failed:', err);
          return { ok: false };
        })
      ]);
      
      const allArticles = [];
      
      // Process GNews
      if (gnewsResponse.ok) {
        const gnewsData = await gnewsResponse.json();
        if (gnewsData.success && gnewsData.articles) {
          allArticles.push(...gnewsData.articles.map(article => ({
            ...article,
            source: 'GNews',
            sourceType: 'gnews'
          })));
        }
      }
      
      // Process Currents
      if (currentsResponse.ok) {
        const currentsData = await currentsResponse.json();
        if (currentsData.success && currentsData.articles) {
          allArticles.push(...currentsData.articles.map(article => ({
            ...article,
            source: 'Currents',
            sourceType: 'currents'
          })));
        }
      }
      
      // Process News API
      if (newsApiResponse.ok) {
        const newsApiData = await newsApiResponse.json();
        if (newsApiData.success && newsApiData.articles) {
          allArticles.push(...newsApiData.articles.map(article => ({
            ...article,
            sourceType: 'newsapi'
          })));
        }
      }
      
      // Process Mediastack
      if (mediastackResponse.ok) {
        const mediastackData = await mediastackResponse.json();
        if (mediastackData.success && mediastackData.articles) {
          allArticles.push(...mediastackData.articles.map(article => ({
            ...article,
            sourceType: 'mediastack'
          })));
        }
      }
      
      // Remove duplicates based on URL
      const uniqueArticles = allArticles.filter((article, index, self) =>
        index === self.findIndex((a) => a.url === article.url)
      );
      
      // sort by date
      uniqueArticles.sort((a, b) => {
        const dateA = new Date(a.published || a.publishedAt);
        const dateB = new Date(b.published || b.publishedAt);
        return dateB - dateA;
      });
      
      setArticles(uniqueArticles);
      
      if (uniqueArticles.length === 0) {
        setError('No articles found from any source');
      }
      
    } catch (err) {
      setError('Failed to load news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NewsView
      loading={loading}
      error={error}
      articles={articles}
      currentArticles={currentArticles}
      currentPage={currentPage}
      totalPages={totalPages}
      goToNextPage={goToNextPage}
      goToPreviousPage={goToPreviousPage}
      goToPage={goToPage}
    />
  );
}