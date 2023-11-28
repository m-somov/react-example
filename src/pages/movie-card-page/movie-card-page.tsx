import { Chip, CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from 'tss-react/mui';
const useStyles = makeStyles()((theme) => ({
  card: {
    width: 400,
    minHeight: 300,
    maxHeight: 700,
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 64,
  },
  chip: {
    all: 'unset',
    cursor: 'pointer',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  genres: {
    marginLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  plot: {
    marginBottom: theme.spacing(2),
  },
}));

type Movie = {
  Title: string;
  Actors: string;
  Genre: string;
  Plot: string;
  Poster: string;
  Released: string;
  Type: string;
  imdbRating: string;
};

export const MovieCardPage = () => {
  const { classes } = useStyles();

  const { imbdID } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!imbdID) return;
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      setIsLoading(true);

      try {
        const searchParams = new URLSearchParams({ apikey: 'a55e2c56', i: imbdID });
        const response = await fetch(`https://www.omdbapi.com?${searchParams}`, { signal });

        const responseData: Movie = await response.json();

        if ('Error' in responseData) {
          setMovie(null);
        } else {
          setMovie(responseData);
        }

        setIsLoading(false);
      } catch (error) {
        /* empty */
      }
    })();

    return () => {
      controller.abort();
      setIsLoading(false);
    };
  }, [imbdID]);

  console.log(movie);

  return (
    <Card className={classes.card}>
      {isLoading && (
        <span className={classes.loader}>
          <CircularProgress />
        </span>
      )}

      {!isLoading && movie && (
        <>
          <CardMedia sx={{ height: 280 }} image={movie.Poster} />

          <div className={classes.genres}>
            {movie.Genre.split(',').map((genre) => (
              <Chip key={genre} size="medium" color="primary" variant="outlined" label={genre} />
            ))}
          </div>

          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {movie.Title}
            </Typography>

            <Typography className={classes.plot} variant="body2" color="text.secondary">
              {movie.Plot}
            </Typography>

            <div className={classes.row}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                Type:
              </Typography>

              {movie.Type}
            </div>

            <div className={classes.row}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                Actors:
              </Typography>

              {movie.Actors}
            </div>

            <div className={classes.row}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                Released:
              </Typography>

              {movie.Released}
            </div>

            <div className={classes.row}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                Rating:
              </Typography>

              {movie.imdbRating}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};
