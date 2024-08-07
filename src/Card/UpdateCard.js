import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { updateCard } from '../api';
import DataContext from '../context/DataContext';

const UpdateCardDialog = ({ open, onClose, card, setCards }) => {
  const [cardName, setCardName] = useState('');
  const [hint, setHint] = useState('');
  const [answer, setAnswer] = useState('');
  const { 
    setAlertMessage,
    setAlertSeverity,
    setShowAlert } = useContext(DataContext);

  useEffect(() => {
    if (card) {
      setCardName(card.cardName);
      setHint(card.hint);
      setAnswer(card.ans);
    }
  }, [card]);

  const handleSave = async () => {
    try {
      const obj = {
        cardId: card._id,
        ...(cardName !== card.cardName && { cardName }),
        ...(hint !== card.hint && { hint }),
        ...(answer !== card.ans && { ans: answer })
      };

      const response = await updateCard(obj);
      if(response.status=="cardUpdated"){
        const updatedCard = { ...card, ...obj };

        setCards(prevCards => ({
          ...prevCards,
          [card.deckId]: prevCards[card.deckId].map(c => c._id === updatedCard._id ? updatedCard : c)
        }));
  
        onClose();
        setAlertMessage("Successfully Updated");
        setAlertSeverity("success");
        setShowAlert(true);
      }
     
    } catch (e) {
      console.error(e);
      setAlertMessage("Update Failed");
      setAlertSeverity("error");
      setShowAlert(true);
    }
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
