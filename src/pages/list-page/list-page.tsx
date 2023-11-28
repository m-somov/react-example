import { Button, Chip, CircularProgress, FormHelperText, Paper } from '@mui/material';
import List from '@mui/material/List';
import { capitalize, debounce } from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { MovieListItem } from './movie-list-item';
import { SearchTextField, SearchTextFieldRef } from './search-text-field';
import { Movie, useSearchMovies } from './use-search-movies';

const useStyles = makeStyles()((theme) => ({
  paper: {
    width: 400,
    margin: '0 auto',
    padding: theme.spacing(2),
    minHeight: 300,
    maxHeight: 600,
    overflow: 'auto',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(),
  },
  loader: {
    height: 64,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipList: {
    marginTop: theme.spacing(),
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  chip: {
    all: 'unset',
    cursor: 'pointer',
  },
}));

const typeFilters = ['series', 'movie'] as const;

export const ListPage = () => {
  const { classes } = useStyles();

  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedSearch = searchParams.get('search') ?? '';
  const [search, setSearch] = useState<string>(debouncedSearch);

  const [filters, setFilters] = useState<Movie['Type'][]>([]);

  const { isLoading, error, movies } = useSearchMovies(debouncedSearch);

  const setDebouncedSearchCb = useCallback(
    debounce((search) => setSearchParams(new URLSearchParams({ search })), 300),
    [],
  );

  const handleSearch = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(target.value);
    setDebouncedSearchCb(target.value);
  };

  const searchInputRef = useRef<SearchTextFieldRef | null>(null);

  const handleClear = () => {
    setSearchParams(new URLSearchParams({ search: '' }));
    setSearch('');
    setDebouncedSearchCb.cancel();
    searchInputRef.current?.focus();
  };

  const getUpdateFiltersHandler = (filter: Movie['Type']) => () =>
    setFilters((prevFilters) => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter((item) => item !== filter);
      }

      return [...prevFilters, filter];
    });

  const filteredMovies = useMemo(
    () => movies.filter((movie) => !filters.length || filters.includes(movie.Type)),
    [filters, movies],
  );

  return (
    <Paper className={classes.paper} variant="elevation">
      <main>
        <div className={classes.search}>
          <SearchTextField error={!!error} ref={searchInputRef} value={search} onChange={handleSearch} />

          <Button size="medium" variant="outlined" onClick={handleClear}>
            Clear
          </Button>
        </div>

        <div className={classes.chipList}>
          {typeFilters.map((filter) => (
            <button key={filter} className={classes.chip} onClick={getUpdateFiltersHandler(filter)}>
              <Chip
                size="medium"
                color="primary"
                variant={filters.includes(filter) ? 'filled' : 'outlined'}
                label={capitalize(filter)}
              />
            </button>
          ))}
        </div>

        {error && <FormHelperText error={!!error}>{error}</FormHelperText>}

        {isLoading && (
          <span className={classes.loader}>
            <CircularProgress />
          </span>
        )}

        {!isLoading && !error && (
          <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {filteredMovies.map(({ imdbID, Title, Poster }) => (
              <MovieListItem key={imdbID} imbdID={imdbID} title={Title} poster={Poster} />
            ))}
          </List>
        )}
      </main>
    </Paper>
  );
};
