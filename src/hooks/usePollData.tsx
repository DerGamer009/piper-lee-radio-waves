
import { useState, useEffect } from 'react';
import { Poll, getActivePolls } from '@/services/pollService';

export const usePollData = (limit = 2) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true);
      try {
        const data = await getActivePolls(limit);
        setPolls(data);
        setError(null);
      } catch (err) {
        console.error("Fehler beim Laden der Umfragen:", err);
        setError("Umfragen konnten nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, [limit]);

  return { polls, isLoading, error };
};
