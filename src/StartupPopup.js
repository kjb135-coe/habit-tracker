import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import styles from './StartupPopup.css';

const StartupPopup = ({ onClose, onNameSubmit }) => {
  const [view, setView] = useState(1); // Track which view to show
  const [name, setName] = useState('');
  const [habit, setHabit] = useState('');
  const [points, setPoints] = useState(1);

  const handleNameSubmit = () => {
    onNameSubmit(name);
    setView(2);
  };

  const handleHabitSubmit = () => {
    const habitData = { habit, points };
    // Assuming onClose also handles the submission of the habit data
    onClose(habitData);
  };

  return (
    <div className={styles.StartupPopup}>
      {view === 1 && (
        <Box className={styles.popupContent}>
          <Typography variant="h4">Welcome to Trackr!</Typography>
          <TextField
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleNameSubmit}
            disabled={!name}
            style={{ marginTop: '1rem' }}
          >
            Continue
          </Button>
        </Box>
      )}
      {view === 2 && (
        <Box className={styles.popupContent}>
          <Typography variant="h5">How to Add Habits</Typography>
          <ul>
            <li>Enter the name of the habit.</li>
            <li>Select the number of points you can earn per day.</li>
            <li>Click on the cells to track your progress.</li>
          </ul>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView(3)}
            style={{ marginTop: '1rem' }}
          >
            Continue
          </Button>
        </Box>
      )}
      {view === 3 && (
        <Box className={styles.popupContent}>
          <Typography variant="h5">Add Your First Habit</Typography>
          <TextField
            label="Habit Name"
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            fullWidth
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Max Points per Day"
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value, 10))}
            inputProps={{ min: 1, max: 3 }}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleHabitSubmit}
            disabled={!habit || points < 1 || points > 3}
            style={{ marginTop: '1rem' }}
          >
            Add Habit
          </Button>
        </Box>
      )}
    </div>
  );
};

export default StartupPopup;
