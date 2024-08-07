import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { updateDeck } from '../api';
import { useTheme } from '@mui/material/styles';

export default function UpdateDeckDialog({ open, onClose, deckId, setDecks }) {
  const [deckName, setDeckName] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  const resetForm = () => {
    setDeckName('');
    setError('');
  };

  const handleUpdateClick = async () => {
    setError('');

    if (!deckName) {
      setError('Deck name is required.');
      return;
    }

    try {
      const response = await updateDeck({ deckId, deckName });
      if (response.status === "deckUpdated") {
        setDecks(prevDecks => prevDecks.map(deck => deck._id === deckId ? { ...deck, deckName, updatedDate: new Date() } : deck));
        onClose();
        resetForm();
      } else {
        setError(`Failed to update deck: ${response.status}`);
      }
    } catch (error) {
      console.error("There was an error updating the deck!", error);
      setError("There was an error updating the deck.");
    }
  };

  return (
    <Dialog open={open} onClose={() => {
      resetForm();
      onClose();
    }}>
      <DialogTitle sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>
        Update Deck
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
          id="deck-name"
          label="Deck Name"
          type="text"
          fullWidth
          variant="outlined"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
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
          onClick={handleUpdateClick}
          sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main, '&:hover': { borderColor: theme.palette.primary.dark, backgroundColor: theme.palette.action.hover, color: theme.palette.primary.dark } }}
        >
          Update Deck
        </Button>
      </DialogActions>
    </Dialog>
  );
}
