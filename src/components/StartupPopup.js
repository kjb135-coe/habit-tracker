import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Snackbar, Alert, Box, DialogContent } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import './StartupPopup.css';
import { styled } from '@mui/system';

const StyledListItem = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
  '&:before': {
    content: '"•"',
    marginRight: '10px',
    fontSize: '20px',
  },
});

const CellExample = styled(Box)({
  display: 'inline-block',
  width: '30px',
  height: '30px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  textAlign: 'center',
  lineHeight: '30px',
  marginRight: '10px',
  cursor: 'pointer',
});

const StartupPopup = ({ onClose, onNameSubmit }) => {
  const [view, setView] = useState(0);
  const [name, setName] = useState('');
  const [habit, setHabit] = useState('');
  const [points, setPoints] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'warning' });


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

  const handleHabitChange = (e) => {
    const newHabit = e.target.value;
    if (newHabit.length <= 25) {
      setHabit(newHabit);
    } else {
      setSnackbar({
        open: true,
        message: 'Habit name must be 25 characters or less',
        severity: 'warning'
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
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
            <Typography variant="h5" gutterBottom>How to Use Trackr</Typography>
            <DialogContent>
              <StyledListItem>Enter the name of your habit.</StyledListItem>
              <StyledListItem>Select the number of points you can earn per day (1-3).</StyledListItem>
              <StyledListItem>Click on the cells to track your progress:</StyledListItem>
              <Box ml={4} mb={2}>
                <Typography variant="body2">
                  <CellExample>·</CellExample> Not completed
                </Typography>
                <Typography variant="body2">
                  <CellExample>1</CellExample> <CellExample>2</CellExample> <CellExample>3</CellExample> Points earned
                </Typography>
                <Typography variant="body2">
                  <CellExample>X</CellExample> Completed (max points)
                </Typography>
              </Box>
              <Typography variant="body2" gutterBottom>
                Clicking cycles through: blank → 1 → 2 → 3 → X → blank
              </Typography>
            </DialogContent>
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
            <Typography variant="h5" gutterBottom>Add Your First Habit</Typography>
            <TextField
              label="Habit Name"
              variant="outlined"
              value={habit}
              onChange={handleHabitChange}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 25 }}
              helperText={`${habit.length}/25`}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default StartupPopup;