import React, { useContext, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { TextField, Grid, Typography } from '@mui/material';
import { addCard } from '../api.js';
import DataContext from "../context/DataContext.js";
import { useTheme } from '@mui/material/styles';

export default function AddCard({ open, onClose, deckId, setValues }) {
  const [cardName, setCardName] = useState('');
  const [cardHint, setCardHint] = useState('');
  const [cardAns, setCardAns] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');
  const { setCards, userId, cardNo, deckNo } = useContext(DataContext);
  const theme = useTheme();

  const resetForm = () => {
    setCardName('');
    setCardHint('');
    setCardAns('');
    setRating('');
    setError('');
  };

  const handleAddClick = async () => {
    setError('');

    // Basic validation
    if (!cardName || !cardHint || !cardAns || !rating) {
      setError('All fields are required.');
      return;
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      setError('Rating must be a number between 1 and 5.');
      return;
    }

    const obj = {
      userId: userId,
      deckId: deckId,
      cardName: cardName,
      hint: cardHint,
      ans: cardAns,
      rating: parseInt(rating, 10),
    };

    try {
      let response = await addCard(obj);
      if (response.status === "cardAdded") {
        setCards(prevCards => Array.isArray(prevCards) ? [...prevCards, response.card] : [response.card]);
        setValues(deckNo, cardNo + 1);
        onClose();
        resetForm();
      } else {
        setError(`Failed to add card: ${response.status}`);
      }
    } catch (error) {
      console.error("There was an error adding the card!", error);
      setError("There was an error adding the card.");
    }
  };

  return (
    <Dialog open={open} onClose={() => {
      resetForm();
      onClose();
    }}>
      <DialogTitle sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>
        Add New Card
        <Button
          onClick={() => {
            resetForm();
            onClose();
          }}
          sx={{ position: 'absolute', right: 8, top: 8, color: theme.palette.secondary.contrastText }}
        >
          ×
        </Button>
      </DialogTitle>
      <DialogContent>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <TextField
          autoFocus
          margin="dense"
          id="card-name"
          label="Card Name"
          type="text"
          fullWidth
          variant="outlined"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderColor: theme.palette.secondary.main } }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Hint"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={cardHint}
              onChange={(e) => setCardHint(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderColor: theme.palette.secondary.main } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Answer"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={cardAns}
              onChange={(e) => setCardAns(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderColor: theme.palette.secondary.main } }}
            />
          </Grid>
        </Grid>
        <TextField
          autoFocus
          margin="dense"
          id="rating"
          label="Rating"
          type="text"
          placeholder="1 to 5"
          fullWidth
          variant="outlined"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderColor: theme.palette.secondary.main } }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            resetForm();
            onClose();
          }}
          sx={{ color: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.secondary.light } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddClick}
          sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main, '&:hover': { borderColor: theme.palette.primary.dark, backgroundColor: theme.palette.action.hover, color: theme.palette.primary.dark } }}
        >
          Add Card
        </Button>
      </DialogActions>
    </Dialog>
  );
}
