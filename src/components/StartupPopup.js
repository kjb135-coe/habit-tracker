import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Typography, Snackbar, Alert, Box, DialogContent } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import './StartupPopup.css';
import { styled } from '@mui/system';
import lottie from 'lottie-web';
import checkmarkAnimation from '../animations/checkmark_lottie.json';
import xmarkAnimation from '../animations/xmark_lottie.json';

//#region Animations
const LottieCheckmark = () => {
  const animationContainer = useRef(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: checkmarkAnimation
      });

      return () => anim.destroy();
    }
  }, []);

  return <div ref={animationContainer} style={{ width: '22px', height: '22px', display: 'inline-block' }}></div>;
};

const LottieXmark = () => {
  const animationContainer = useRef(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: xmarkAnimation
      });

      return () => anim.destroy();
    }
  }, []);

  return <div ref={animationContainer} style={{ width: '40px', height: '40px', display: 'inline-block' }}></div>;
};

//#endregion

const CellExample = styled(Box)({
  display: 'inline-flex',
  width: '40px',
  height: '40px',
  border: '2px solid #ccc',
  borderRadius: '4px',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '20px',
  marginRight: '12px',
  backgroundColor: '#f5f5f5',
});

const StartupPopup = ({ onClose, onNameSubmit, snackbar, setSnackbar }) => {
  const [view, setView] = useState(0);
  const [name, setName] = useState('');
  const [habit, setHabit] = useState('');

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
            <DialogContent sx={{ padding: '24px' }}>
              <Typography variant="h5" gutterBottom sx={{ marginBottom: '24px' }}>How to Use Trackr</Typography>
              <Typography gutterBottom sx={{ marginBottom: '12px' }}>Add habits, delete habits, and set weekly goals!</Typography>
              <Typography gutterBottom sx={{ marginBottom: '12px' }}>Click on the cells to track your progress:</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <CellExample></CellExample>
                  <Typography>Not completed</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <CellExample>
                    <LottieCheckmark />
                  </CellExample>
                  <Typography>Completed</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CellExample>
                    <LottieXmark />
                  </CellExample>
                  <Typography>Missed</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ marginTop: '12px' }}>
                Clicking cycles through: blank → completed → missed → blank
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
              inputProps={{ maxLength: 30 }}
              helperText={`${habit.length}/30`}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!habit}
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