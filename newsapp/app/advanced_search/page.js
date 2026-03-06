'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdvancedSearchPage() {
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement advanced search functionality
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => router.back()}
        className={styles.backButton}
      >
        Back
      </button>

      <h1 className={styles.title}>Advanced Search</h1>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.formGroup}>
          <label htmlFor="keyword">Keyword</label>
          <input
            type="text"
            id="keyword"
            placeholder="Enter search keyword"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="source">Source</label>
          <select id="source" className={styles.select}>
            <option value="">Any Source</option>
            <option value="gnews">GNews</option>
            <option value="currents">Currents</option>
            <option value="newsapi">News API</option>
            <option value="mediastack">Mediastack</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="topic">Topic/Industry</label>
          <select id="topic" className={styles.select}>
            <option value="">Any Topic</option>
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="health">Health</option>
            <option value="sports">Sports</option>
            <option value="entertainment">Entertainment</option>
            <option value="science">Science</option>
            <option value="politics">Politics</option>
          </select>
        </div>

        <div className={styles.dateRangeGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="dateAfter">Date After</label>
            <input
              type="date"
              id="dateAfter"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dateBefore">Date Before</label>
            <input
              type="date"
              id="dateBefore"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="country">Country</label>
          <select id="country" className={styles.select}>
            <option value="">Any Country</option>
            <option value="us">United States</option>
            <option value="gb">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="jp">Japan</option>
            <option value="in">India</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Search
        </button>
      </form>
    </div>
  );
}
