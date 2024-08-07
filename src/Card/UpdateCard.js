import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { updateCard } from '../api';

const UpdateCardDialog = ({ open, onClose, card, setCards }) => {
  const [cardName, setCardName] = useState('');
  const [hint, setHint] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (card) {
      setCardName(card.cardName);
      setHint(card.hint);
      setAnswer(card.ans);
    }
  }, [card]);

  const handleSave = async () => {
    const updatedCard = { ...card, cardName, hint, answer };
    await updateCard(updatedCard);
    setCards(prevCards => ({
      ...prevCards,
      [card.deckId]: prevCards[card.deckId].map(c => c._id === updatedCard._id ? updatedCard : c)
    }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Card</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Card Name"
          fullWidth
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Hint"
          fullWidth
          value={hint}
          onChange={(e) => setHint(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Answer"
          fullWidth
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCardDialog;
