
import { useState, useEffect } from 'react';
import { Podcast, getLatestPodcasts } from '@/services/podcastService';

export const usePodcastData = (limit = 4) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true);
      try {
        const data = await getLatestPodcasts(limit);
        setPodcasts(data);
        setError(null);
      } catch (err) {
        console.error("Fehler beim Laden der Podcasts:", err);
        setError("Podcasts konnten nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, [limit]);

  return { podcasts, isLoading, error };
};
