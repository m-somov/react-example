import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

export const MovieListItem = memo(({ imbdID, poster, title }: { imbdID: string; poster: string; title: string }) => {
  const navigate = useNavigate();

  const navigateToMovieCard = () => {
    console.log(`/movies/${imbdID}`);
    navigate(`/movies/${imbdID}`);
  };

  return (
    <ListItem disablePadding onClick={navigateToMovieCard}>
      <ListItemButton>
        <ListItemAvatar>
          <Avatar src={poster} />
        </ListItemAvatar>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
});
