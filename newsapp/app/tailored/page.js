'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { getRecommendations } from '@/lib/llm-api';

export default function TailoredPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const savedTopics = localStorage.getItem('userPreferences');
    if (savedTopics) {
      try {
        setTopics(JSON.parse(savedTopics));
      } catch (err) {
        console.error('Failed to load preferences:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && topics.length > 0 && articles.length > 0) {
      fetchRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, topics, articles]);

  async function fetchNews() {
    try {
      setLoading(true);

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

      if (newsApiResponse.ok) {
        const newsApiData = await newsApiResponse.json();
        if (newsApiData.success && newsApiData.articles) {
          allArticles.push(...newsApiData.articles.map(article => ({
            ...article,
            sourceType: 'newsapi'
          })));
        }
      }

      if (mediastackResponse.ok) {
        const mediastackData = await mediastackResponse.json();
        if (mediastackData.success && mediastackData.articles) {
          allArticles.push(...mediastackData.articles.map(article => ({
            ...article,
            sourceType: 'mediastack'
          })));
        }
      }

      const uniqueArticles = allArticles.filter((article, index, self) =>
        index === self.findIndex((a) => a.url === article.url)
      );

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

  async function fetchRecommendations() {
    try {
      const recData = await getRecommendations(topics, articles);
      if (!recData || !recData.recommendations) {
        setError('No recommendations available');
        return;
      }
      setRecommendations(recData.recommendations);
    } catch (err) {
      console.error('Recommendations failed:', err);
      setError('Failed to get recommendations');
    }
  }

  const hasPreferences = topics.length > 0;
  const hasResults = recommendations.length > 0;

  const normalizedRecommendations = useMemo(() => {
    if (recommendations.length === 0) return [];
    const byUrl = new Map(articles.map((article) => [article.url, article]));

    const scoreArticle = (article) => {
      if (topics.length === 0) return 0;
      const text = [
        article.title,
        article.description,
        article.content
      ].filter(Boolean).join(' ').toLowerCase();
      if (!text) return 0;
      return topics.reduce((score, term) => {
        const t = term.trim().toLowerCase();
        if (!t) return score;
        return score + (text.includes(t) ? 1 : 0);
      }, 0);
    };

    const merged = recommendations.map((rec) => {
      const original = rec.url ? byUrl.get(rec.url) : null;
      const mergedArticle = {
        ...original,
        ...rec,
        title: original?.title || rec.title,
        description: original?.description || rec.description,
        published: original?.published || original?.publishedAt || rec.published || rec.publishedAt,
        source: original?.source || rec.source || original?.sourceType
      };
      return {
        ...mergedArticle,
        keywordScore: scoreArticle(mergedArticle)
      };
    });

    if (topics.length === 0) return merged;

    return merged
      .filter((article) => article.keywordScore > 0)
      .sort((a, b) => b.keywordScore - a.keywordScore);
  }, [recommendations, articles, topics]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tailored Articles</h1>

      <div className={styles.buttonContainer}>
        <button
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          Back to Home
        </button>

        <button
          onClick={() => router.push('/tailored/preferences')}
          className={styles.preferencesButton}
        >
          Tailor Articles
        </button>

        <button
          onClick={() => router.push('/advanced_search')}
          className={styles.advancedSearchButton}
        >
          Advanced Search
        </button>
      </div>

      {!hasPreferences && (
        <p className={styles.helperText}>
          Add topics in Preferences to generate personalized recommendations.
        </p>
      )}

      {loading && (
        <div className={styles.centerContainer}>
          <p>Loading tailored articles...</p>
        </div>
      )}

      {!loading && error && (
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && hasPreferences && !hasResults && (
        <p className={styles.noResults}>No tailored articles yet.</p>
      )}

      {!loading && !error && hasResults && (
        <div className={styles.articlesGrid}>
          {normalizedRecommendations.map((article, index) => (
            <div key={article.url || index} className={styles.articleCard}>
              {(article.image || article.urlToImage) && (
                <img
                  src={article.image || article.urlToImage}
                  alt={article.title}
                  className={styles.articleImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}

              <h2 className={styles.articleTitle}>{article.title}</h2>
              <p className={styles.articleDescription}>
                {article.description || 'No description available'}
              </p>

              <div className={styles.articleFooter}>
                <span className={styles.articleMeta}>
                  {article.source || article.sourceType || 'Unknown'} • {article.published ? new Date(article.published).toLocaleDateString() : 'Unknown date'}
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.readMoreLink}
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
