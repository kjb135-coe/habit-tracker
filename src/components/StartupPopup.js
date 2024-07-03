import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import './StartupPopup.css';

const StartupPopup = ({ onClose, onNameSubmit }) => {
  const [view, setView] = useState(0);
  const [name, setName] = useState('');
  const [habit, setHabit] = useState('');
  const [points, setPoints] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setView(1);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const renderView = (currentView) => {
    switch (currentView) {
      case 0:
        return (
          <Typography variant="h1" style={{ fontFamily: 'Noto Serif, serif', fontSize: '48px' }}>
            Trackr
          </Typography>
        );
      case 1:
        return (
          <form onSubmit={handleNameSubmit}>
            <Typography variant="h5">Welcome to Trackr!</Typography>
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
          </form>
        );
      case 2:
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            setView(3);
          }}>
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
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleHabitSubmit}>
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
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="fullScreenOverlay"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="popupContainer">
        <div className="StartupPopup">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              {renderView(view)}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StartupPopup;