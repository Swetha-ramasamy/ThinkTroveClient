import React, { useState, useEffect, useContext } from 'react';
import { Typography, IconButton, Box, Card, CardContent, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { fetchCards, changeRating } from '../api'; 
import { useTheme } from '@mui/material/styles';
import DataContext from '../context/DataContext.js';

const CardPlayer = ({ deck, onClose }) => {
  const { setToggleAddDeck } = useContext(DataContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const getCards = async () => {
      try {
        const response = await fetchCards(deck._id); 
        setCards(response);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    getCards();
  }, [deck._id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        event.preventDefault();
        if (showAnswer) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
          setShowAnswer(false);
        } else {
          setShowAnswer(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAnswer, cards.length]);

  const handleClose = () => {
    setToggleAddDeck(true);
    onClose();
    navigate('/home');
  };

  const handleRating = async (rating) => {
    console.log(`Rated ${rating} for card ${currentIndex + 1}`);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    try {
      const response = await changeRating(cards[currentIndex]._id, rating);
      if (response === "ratingChanged") {
        console.log("Rating changed successfully");
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
      } else {
        setError(`Failed to change rating: ${response}`);
      }
    } catch (error) {
      console.error("There was an error changing the rating!", error);
      setError("There was an error changing the rating.");
    }
    setShowAnswer(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading cards: {error.message}</Typography>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      sx={{ backgroundColor: theme.palette.background.default, padding: 10, position: 'relative' }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: theme.palette.primary.main,
          zIndex: 1000, // Ensure the button is above other elements
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box mb={2} flexDirection="column"
        alignItems="center"
        justifyContent="center">
        <Typography variant="h6" color={theme.palette.primary.main}>
          {currentIndex + 1}/{cards.length}

        </Typography>
      </Box>

      <Card
        sx={{
          minWidth: 275,
          maxWidth: 600,
          width: '100%',
          height: '100%',
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 15,
          position: 'relative', // Ensure card's content doesn't affect positioning of close button
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>
            <span style={{ fontSize: '1.5rem' }}> {cards[currentIndex].hint}</span>
          </Typography>

          {showAnswer && (
            <Typography variant="h6" sx={{ color: theme.palette.secondary.main, fontWeight: 'bold', marginTop: '20px' }}>
              <span style={{ fontSize: '1.5rem' }}> {cards[currentIndex].ans}</span>
            </Typography>
          )}
        </CardContent>
        
      </Card>
      <Typography variant="body2" color={theme.palette.text.secondary} padding={2} >
          Press Space bar to reveal answer
        </Typography>
      {showAnswer && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
          <Typography variant="h6" color={theme.palette.primary.main} mb={2}>
            How well did you know this?
          </Typography>
          <Box display="flex" justifyContent="center" width="100%">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant="contained"
                color="secondary"
                sx={{ mx: 1 }}
                onClick={() => handleRating(rating)}
              >
                {rating}
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CardPlayer;
