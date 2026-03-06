'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PreferencesView from './PreferencesView';

export default function PreferencesPage() {
  const router = useRouter();
  const [topics, setTopics] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);

  // load topics from local storage
  useEffect(() => {
    const savedTopics = localStorage.getItem('userPreferences');
    if (savedTopics) {
      try {
        setTopics(JSON.parse(savedTopics));
      } catch (err) {
        console.error('Failed to load preferences:', err);
      }
    }
    setLoading(false);
  }, []);

  // save topics to local storage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('userPreferences', JSON.stringify(topics));
    }
  }, [topics, loading]);

  const handleAddTopic = (e) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    
    if (!trimmedInput) return;
    
    // avoid duplicates
    if (topics.some(topic => topic.toLowerCase() === trimmedInput.toLowerCase())) {
      return;
    }
    
    setTopics([...topics, trimmedInput]);
    setInputValue('');
  };

  const handleDeleteTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  return (
    <PreferencesView
      topics={topics}
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleAddTopic={handleAddTopic}
      handleDeleteTopic={handleDeleteTopic}
      router={router}
    />
  );
}