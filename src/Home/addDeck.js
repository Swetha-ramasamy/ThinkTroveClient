import React, { useContext, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { addDeck } from '../api';
import DataContext from "../context/DataContext.js";
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export default function AddDeckDialog({ open, onClose, setValues }) {
  const [deckName, setDeckName] = useState('');
  const [error, setError] = useState('');
  const { userId, deckNo, cardNo, setDecks, setDeckAdded } = useContext(DataContext);
  const theme = useTheme();

  const resetForm = () => {
    setDeckName('');
    setError('');
  };

  const handleAddClick = async () => {
    setError('');

    if (!deckName) {
      setError('Deck Name is required.');
      return;
    }

    const obj = {
      userId: userId,
      deckName: deckName
    };

    try {
      let response = await addDeck(obj);

      if (response.status === "deckAdded") {
        setDeckAdded(true);
        setDecks(prevDecks => [...prevDecks, response.deck]);
        setValues(deckNo + 1, cardNo);
        console.log("Deck added successfully");
      } else {
        setError(`Failed to add deck: ${response.status}`);
      }
    } catch (error) {
      console.error("There was an error adding the deck!", error);
      setError("There was an error adding the deck.");
    }

    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => {
      resetForm();
      onClose();
    }}>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          position: 'relative',
          padding: theme.spacing(2),
          margin: 0,
          width: '100%', // Make the title fit the entire width
         
        }}
      >
        Add New Deck
        <Button
          onClick={() => {
            resetForm();
            onClose();
          }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.secondary.contrastText,
            '&:hover': { backgroundColor: theme.palette.secondary.dark }
          }}
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
          sx={{
           
            '& .MuiOutlinedInput-root': { borderColor: theme.palette.secondary.main }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            resetForm();
            onClose();
          }}
          sx={{
            color: theme.palette.secondary.main,
            '&:hover': { backgroundColor: theme.palette.secondary.light }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddClick}
          sx={{
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.primary.dark
            }
          }}
        >
          Add Deck
        </Button>
      </DialogActions>
    </Dialog>
  );
}
