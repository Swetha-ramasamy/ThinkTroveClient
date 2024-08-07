import React, { useEffect, useState, useContext } from 'react';
import { Typography, List, ListItem, ListItemText, CircularProgress, IconButton, ListItemSecondaryAction, Divider } from '@mui/material';
import { fetchDecks, deleteDeck, fetchCards, deleteCard } from '../api';
import DataContext from '../context/DataContext.js';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayIcon from '@mui/icons-material/PlayArrowOutlined';
import AddIcon from '@mui/icons-material/Add';
import AddCard from '../Card/AddCard.js';
import CardPlayer from '../Card/CardPlayer.js';
import defaulttheme from '../Template/theme.js'; // Import your theme
import UpdateDeckDialog from './UpdateDeck.js'; // Import the new dialog
import UpdateCardDialog from '../Card/UpdateCard.js';

export function DeckList({ setValues }) {
  const { userId, deckAdded, decks, setDecks, deckNo, cardNo, setUserId, setCards, cards, setToggleAddDeck } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [expandedDeckIds, setExpandedDeckIds] = useState([]);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateCardDialogOpen, setUpdateCardDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const getDecks = async () => {
      try {
        const response = await fetchDecks(userId);
        setUserId(userId);
        setDecks(response);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    getDecks();
  }, [deckAdded, userId, setDecks, setUserId]);

  const handleExpandDeck = async (deckId) => {
    if (expandedDeckIds.includes(deckId)) {
      setExpandedDeckIds(prevExpanded => prevExpanded.filter(id => id !== deckId));
    } else {
      setExpandedDeckIds(prevExpanded => [...prevExpanded, deckId]);
      const response = await fetchCards(deckId);
      setCards(prevCards => ({ ...prevCards, [deckId]: response }));
    }
  };

  const handleAddCard = (deckId) => {
    setSelectedDeckId(deckId);
    setDialogOpen(true);
  };

  const handleAddCardClose = () => {
    setDialogOpen(false);
  };

  const handlePlayCard = (deck) => {
    setToggleAddDeck(false);
    setSelectedDeck(deck);
  };

  const handleUpdate = (deckId) => {
    setSelectedDeckId(deckId);
    setUpdateDialogOpen(true);
  };

  const handleDelete = async (deckId) => {
    const obj = {
      deckId: deckId,
      userId: userId,
    };
    await deleteDeck(obj);
    setValues(deckNo - 1, cardNo);
    setDecks(prevDecks => prevDecks.filter(deck => deck._id !== deckId));
  };
  const handleUpdateCard = (card) => {
    setSelectedCard(card);
    setUpdateCardDialogOpen(true);
  };

  const handleDeleteCard = async (cardId, deckId) => {
    const obj = {
      cardId: cardId,
      userId: userId,
    };
    
    // Perform the delete operation on the server
    await deleteCard(obj);
    setValues(deckNo, cardNo - 1)
    // Update local state
    setCards(prevCards => {
      // Ensure that the state for the specific deck is an array
      if (Array.isArray(prevCards[deckId])) {
        // Filter out the deleted card
        const updatedDeckCards = prevCards[deckId].filter(card => card._id !== cardId);
        
        // Return updated state
        return {
          ...prevCards,
          [deckId]: updatedDeckCards
        };
      } else {
        // If the state for this deck is not an array, return it unchanged
        console.error("Unexpected state structure for deckId:", deckId);
        return prevCards;
      }
    });
  };
  

  const handleUpdateCardClose = () => {
    setUpdateCardDialogOpen(false);
    setSelectedCard(null);
  };
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading decks: {error.message}</Typography>;

  return (
    <>
      {selectedDeck ? (
        <CardPlayer deck={selectedDeck} onClose={() => setSelectedDeck(null)} />
      ) : (
        decks.length === 0 ? (
          <Typography variant="h6" align="center">
            Oops, no deck created yet
          </Typography>
        ) : (
          <List>
            {decks.map((deck) => (
              <React.Fragment key={deck._id}>
                <ListItem button onClick={() => handleExpandDeck(deck._id)}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: defaulttheme.palette.secondary.main }}>
                        {deck.deckName}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: defaulttheme.palette.secondary.light }}>
                        Created on: {new Date(deck.createdDate).toLocaleDateString()}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="addCard" 
                      onClick={() => handleAddCard(deck._id)}
                      sx={{ color: defaulttheme.palette.secondary.main }}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="edit" 
                      onClick={() => handleUpdate(deck._id)}
                      sx={{ color: defaulttheme.palette.secondary.main }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => handleDelete(deck._id)}
                      sx={{ color: defaulttheme.palette.error.main }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="play" 
                      onClick={() => handlePlayCard(deck)}
                      sx={{ color: defaulttheme.palette.secondary.main }}
                    >
                      <PlayIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                {expandedDeckIds.includes(deck._id) && (
                  <>
                    {cards[deck._id]?.length === 0 ? (
                      <Typography variant="body1" align="center">
                        No cards yet
                      </Typography>
                    ) : (
                      <List>
                        {cards[deck._id]?.map((card) => (
                          <ListItem key={card._id}>
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1rem', color: defaulttheme.palette.secondary.light }}>
                                  {card.cardName}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" sx={{ color: defaulttheme.palette.secondary.light }}>
                                  Hint: {card.hint}
                                </Typography>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton 
                                edge="end" 
                                aria-label="editCard" 
                                onClick={() => handleUpdateCard(card)}
                                sx={{ color: defaulttheme.palette.secondary.main }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                aria-label="deleteCard" 
                                onClick={() => handleDeleteCard(card._id, deck._id)}
                                sx={{ color: defaulttheme.palette.error.main }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </List>
        )
      )}
      <AddCard open={dialogOpen} onClose={handleAddCardClose} deckId={selectedDeckId} setValues={setValues} />
      <UpdateDeckDialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} deckId={selectedDeckId} setDecks={setDecks} />
      <UpdateCardDialog open={updateCardDialogOpen} onClose={handleUpdateCardClose} card={selectedCard} setCards={setCards} />
    </>
  );
}

export default DeckList;
