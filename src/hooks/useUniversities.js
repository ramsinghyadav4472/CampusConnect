import { useState, useEffect } from 'react';

export const useUniversities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        // Check cache first
        const cached = sessionStorage.getItem('cc_api_universities');
        if (cached) {
          setUniversities(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const response = await fetch('http://universities.hipolabs.com/search?country=India');
        if (!response.ok) throw new Error('Failed to fetch universities');
        
        const data = await response.json();
        
        // Extract unique names and sort them alphabetically
        const uniqueNames = [...new Set(data.map(uni => uni.name))].sort();
        
        setUniversities(uniqueNames);
        sessionStorage.setItem('cc_api_universities', JSON.stringify(uniqueNames));
      } catch (err) {
        console.error('Error fetching universities:', err);
        setError('Failed to load universities. Please type manually or try again.');
        // Fallback to empty array
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  return { universities, loading, error };
};
