import styles from './page.module.css';

export default function PreferencesView({
  topics,
  inputValue,
  setInputValue,
  handleAddTopic,
  handleDeleteTopic,
  router
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Preference Management</h1>
      
      <form onSubmit={handleAddTopic} className={styles.form}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a topic you're interested in."
            className={styles.input}
          />
          <button type="submit" className={styles.addButton}>
            Add Topic
          </button>
        </div>
      </form>

      <div className={styles.topicsSection}>
        <h2 className={styles.sectionTitle}>Your Topics</h2>
        
        {topics.length === 0 ? (
          <p className={styles.noTopics}>No topics added yet. Start by adding your first topic!</p>
        ) : (
          <div className={styles.topicsList}>
            {topics.map((topic, index) => (
              <div key={index} className={styles.topicItem}>
                <span className={styles.topicText}>{topic}</span>
                <button
                  onClick={() => handleDeleteTopic(index)}
                  className={styles.deleteButton}
                  title="Delete topic"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <button
          onClick={() => router.back()}
          className={styles.backButton}
        >
          Back
        </button>
        <button
          onClick={() => router.push('/tailored')}
          className={styles.viewButton}
        >
          View Tailored Articles
        </button>
      </div>
    </div>
  );
}