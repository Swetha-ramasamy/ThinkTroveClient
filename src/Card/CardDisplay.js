import React from 'react';
import { Typography, Box } from '@mui/material';

const CardDisplay = ({ card, showAnswer }) => {
  return (
    <Box textAlign="center">
      <Typography variant="h4">
        {showAnswer ? card.ans : card.hint}
      </Typography>
    </Box>
  );
};

export default CardDisplay;
