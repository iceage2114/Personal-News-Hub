import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function NewsView({
  loading,
  error,
  articles,
  currentArticles,
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
  goToPage
}) {
  const router = useRouter();
  
  // get badge class based on source type
  const getBadgeClass = (sourceType) => {
    switch(sourceType) {
      case 'gnews':
        return styles.gnewsBadge;
      case 'currents':
        return styles.currentsBadge;
      case 'newsapi':
        return styles.newsapiBadge;
      case 'mediastack':
        return styles.mediastackBadge;
      default:
        return styles.defaultBadge;
    }
  };

  if (loading) {
    return (
      <div className={styles.centerContainer}>
        <p>Loading news from multiple sources</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Latest News</h1>
      <button 
        id="tailor"
        onClick={() => router.push('/tailored')}
      >
        Tailored Articles
      </button>
      <p className={styles.subtitle}>
        Showing articles from GNews, Currents, News API, and Mediastack ({articles.length} total articles)
      </p>
      
      <div className={styles.articlesGrid}>
        {currentArticles.map((article, index) => (
          <div key={article.id || article.url || index} className={styles.articleCard}>
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
            
            <div className={`${styles.sourceBadge} ${getBadgeClass(article.sourceType)}`}>
              {article.source}
            </div>
            
            <h2 className={styles.articleTitle}>
              {article.title}
            </h2>
            
            <p className={styles.articleDescription}>
              {article.description || 'No description available'}
            </p>
            
            <div className={styles.articleFooter}>
              <span className={styles.articleMeta}>
                {article.author || article.source?.name || 'Unknown'} • {new Date(article.published || article.publishedAt).toLocaleDateString()}
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
      
      {articles.length === 0 && (
        <p className={styles.noArticles}>
          No articles found
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
          >
            ← Previous
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`${styles.pageNumber} ${currentPage === pageNumber ? styles.active : ''}`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          >
            Next →
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <p className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  );
}