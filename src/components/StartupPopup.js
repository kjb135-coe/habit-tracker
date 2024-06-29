import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import './StartupPopup.css';

const StartupPopup = ({ onClose, onNameSubmit }) => {
  const [view, setView] = useState(1);
  const [name, setName] = useState('');
  const [habit, setHabit] = useState('');
  const [points, setPoints] = useState(1);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    onNameSubmit(name);
    setView(2);
  };

  const handleHabitSubmit = (e) => {
    e.preventDefault();
    const newHabit = {
      habit: habit,
      days: new Array(7).fill(0),
      selectedWCount: points,
    };
    onClose(newHabit);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  const renderView = (currentView) => {
    switch (currentView) {
      case 1:
        return (
          <motion.form
            key={1}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            onSubmit={handleNameSubmit}
          >
            <Typography variant="h4">Welcome to Trackr!</Typography>
            <TextField
              label="Your Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!name}
              fullWidth
            >
              Continue
            </Button>
          </motion.form>
        );
      case 2:
        return (
          <motion.form
            key={2}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            onSubmit={(e) => {
              e.preventDefault();
              setView(3);
            }}
          >
            <Typography variant="h5">How to Add Habits</Typography>
            <ul>
              <li>Enter the name of the habit.</li>
              <li>Select the number of points you can earn per day.</li>
              <li>Click on the cells to track your progress.</li>
            </ul>
            <Button
              type="submit"
              variant="contained"
              fullWidth
            >
              Continue
            </Button>
          </motion.form>
        );
      case 3:
        return (
          <motion.form
            key={3}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            onSubmit={handleHabitSubmit}
          >
            <Typography variant="h5">Add Your First Habit</Typography>
            <TextField
              label="Habit Name"
              variant="outlined"
              value={habit}
              onChange={(e) => setHabit(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Max Points per Day"
              variant="outlined"
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value, 10))}
              inputProps={{ min: 1, max: 3 }}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!habit || points < 1 || points > 3}
              fullWidth
            >
              Add Habit
            </Button>
          </motion.form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fullScreenOverlay">
      <div className="popupContainer">
        <div className="StartupPopup">
          <AnimatePresence mode="wait">
            {renderView(view)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StartupPopup;