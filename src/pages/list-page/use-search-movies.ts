import { useEffect, useState } from 'react';

export type Movie = {
  Poster: string;
  Title: string;
  Type: 'series' | 'movie';
  Year: string;
  imdbID: string;
};

type MoviesResponse =
  | {
      Search: Movie[];
    }
  | { Error: string };

export const useSearchMovies = (search: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!search) {
      setMovies([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      setIsLoading(true);

      try {
        const searchParams = new URLSearchParams({ s: search, apikey: 'a55e2c56', page: '1' });
        const response = await fetch(`https://www.omdbapi.com?${searchParams}`, { signal });

        const responseData: MoviesResponse = await response.json();

        if ('Error' in responseData) {
          setError(responseData.Error);
          setMovies([]);
        } else {
          setError(null);
          setMovies(responseData.Search);
        }

        setIsLoading(false);
      } catch (error) {
        if (!signal.aborted) setError('Unexpected error');
      }
    })();

    return () => {
      controller.abort();
      setIsLoading(false);
    };
  }, [search]);

  return { movies, error, isLoading };
};
