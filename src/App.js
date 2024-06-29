/* global chrome */

import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem as SelectMenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HabitGrid from './components/HabitGrid';
import StartupPopup from './components/StartupPopup';
import extensionIcon from './extensionIcon.png';
import lottie from 'lottie-web';

const theme = createTheme({
  palette: {
    background: {
      default: '#faf3e0', // Light beige background
    },
  },
});


// #region Animations
// Lottie checkmark animation
const LottieCheckmark = () => {
  const animationContainer = useRef(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        style: { height: '22px', width: '22px' },
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
        path: 'C:/Users/keega/React/habit-tracker/src/checkmark_lottie.json' // Ensure the path is correct and accessible
      });

      return () => anim.destroy();
    }
  }, []);

  return <div ref={animationContainer} ></div>;
};

// Lottie xmark animation
const LottieXmark = () => {
  const animationContainer = useRef(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        style: { height: '22px', width: '22px' },
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
        path: 'C:/Users/keega/React/habit-tracker/src/xmark_lottie.json' // Ensure the path is correct and accessible
      });

      return () => anim.destroy();
    }
  }, []);

  return <div ref={animationContainer}></div>;
};
// #endregion

const App = () => {

  const [startDate, setStartDate] = useState(new Date());

  // Function to get the Monday of the current week
  const getMonday = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  const getCurrentWeekDates = (startDate) => {
    const monday = getMonday(startDate);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' }));
    }
    return weekDates;
  };

  //#region Variables
  const calculateWeekDate = (startDate, i) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() - i * 7);
    const weekStart = getMonday(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return `${weekStart.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}`;
  };

  const currentDate = new Date(startDate);
  const [weekDatesTable, setWeekDatesTable] = useState([
    calculateWeekDate(currentDate, 0),
    calculateWeekDate(currentDate, 1),
    calculateWeekDate(currentDate, 2),
    calculateWeekDate(currentDate, 3)
  ]);

  const [gridData, setGridData] = useState([
    { habit: '', days: [0, 0, 0, 0, 0, 0, 0], streak: 0 },
  ]);

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedWCount, setSelectedWCount] = useState(1);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isAddHabitVisible, setIsAddHabitVisible] = useState(false);
  const [isDeleteDropdownVisible, setIsDeleteDropdownVisible] = useState(false); // New state for delete dropdown
  const [scoresData, setScoresData] = useState([]);
  const [weekDates, setWeekDates] = useState(getCurrentWeekDates(startDate));
  const [showStartupPopup, setShowStartupPopup] = useState(true);
  const [userName, setUserName] = useState('');
  const [displayedScores, setDisplayedScores] = useState([
    [weekDatesTable[0], 0],
    [weekDatesTable[1], 0],
    [weekDatesTable[2], 0],
    [weekDatesTable[3], 0]
  ]);
  const [prevDay, setPrevDay] = useState(new Date().getDay());
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, habitIndex: null });

  //#endregion

  //#region Hooks
  // useEffect(() => {
  //   chrome.storage.sync.get(['userName', 'userHabit'], (result) => {
  //     if (result.userName) {
  //       setUserName(result.userName);
  //       setShowStartupPopup(false);
  //     }
  //     if (result.userHabit) {
  //       setUserHabit(result.userHabit);
  //     }
  //   });
  // }, []);

  // Communcation for background/content workers
  // Triggerred whenever any of the states listed are changed
  // Chrome only allows 120 requests per minute, so this is a workaround
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // Store the state in memory using chrome.storage.sync
  //     chrome.storage.sync.set({
  //       state: {
  //         gridData,
  //         showAddHabit,
  //         newHabitName,
  //         selectedWCount,
  //         isDropdownVisible,
  //         isAddHabitVisible,
  //         isDeleteDropdownVisible,
  //         scoresData,
  //         weekDates,
  //         showStartupPopup,
  //         userName,
  //         weekDatesTable,
  //         displayedScores,
  //         prevDay
  //       }
  //     });
  //   }, 660);
  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, [
  //   gridData,
  //   showAddHabit,
  //   newHabitName,
  //   selectedWCount,
  //   isDropdownVisible,
  //   isAddHabitVisible,
  //   isDeleteDropdownVisible,
  //   scoresData,
  //   weekDates,
  //   showStartupPopup,
  //   userName,
  //   weekDatesTable,
  //   displayedScores,
  //   prevDay
  // ]);

  // // Listen for messages from the content script
  // useEffect(() => {
  //   function handleMessage(event) {
  //     // Only trust messages from the same frame
  //     if (event.source !== window) return;

  //     const message = event.data;

  //     // Make sure the message has the correct format
  //     if (typeof message === 'object' && message !== null && message.type === 'FROM_CONTENT_SCRIPT') {
  //       const payload = message.payload;

  //       // Check the payload type
  //       if (payload && (payload.type === 'NEW_TAB_CREATED' || payload.type === 'PAGE_REFRESH_DETECTED')) {
  //         // A new tab was created, update the state
  //         setGridData(payload.gridData);
  //         setShowAddHabit(payload.showAddHabit);
  //         setNewHabitName(payload.newHabitName);
  //         setSelectedWCount(payload.selectedWCount);
  //         setIsDropdownVisible(payload.isDropdownVisible);
  //         setIsAddHabitVisible(payload.isAddHabitVisible);
  //         setIsDeleteDropdownVisible(payload.isDeleteDropdownVisible);
  //         setScoresData(payload.scoresData);
  //         setWeekDates(payload.weekDates);
  //         setShowStartupPopup(payload.showStartupPopup);
  //         setUserName(payload.userName);
  //         setWeekDatesTable(payload.weekDatesTable);
  //         setDisplayedScores(payload.displayedScores);
  //         setPrevDay(payload.prevDay);
  //       } else if (payload) {
  //         // Handle other messages
  //         setGridData(payload.gridData);
  //         setShowAddHabit(payload.showAddHabit);
  //         setNewHabitName(payload.newHabitName);
  //         setSelectedWCount(payload.selectedWCount);
  //         setIsDropdownVisible(payload.isDropdownVisible);
  //         setIsAddHabitVisible(payload.isAddHabitVisible);
  //         setIsDeleteDropdownVisible(payload.isDeleteDropdownVisible);
  //         setScoresData(payload.scoresData);
  //         setWeekDates(payload.weekDates);
  //         setShowStartupPopup(payload.showStartupPopup);
  //         setUserName(payload.userName);
  //         setWeekDatesTable(payload.weekDatesTable);
  //         setDisplayedScores(payload.displayedScores);
  //         setPrevDay(payload.prevDay);
  //       }
  //     }
  //   }

  //   // Add event listener for messages
  //   window.addEventListener('message', handleMessage);

  //   // Make sure to clean up event listeners when the component unmounts
  //   return () => {
  //     window.removeEventListener('message', handleMessage);
  //   };
  // }, []);

  // Check for new week
  useEffect(() => {
    const now = new Date();
    const currentDay = now.getDay();

    // Check if today is Monday and the previous day was Sunday
    if (currentDay === 1 && prevDay === 0) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate());

      const currentWeek = weekDates[0];
      const newScoresData = [{ week: currentWeek, score: 0 }, ...scoresData];

      setWeekDatesTable([
        calculateWeekDate(newDate, 0),
        calculateWeekDate(newDate, 1),
        calculateWeekDate(newDate, 2),
        calculateWeekDate(newDate, 3),
      ]);

      setDisplayedScores([
        [weekDatesTable[0], 0],
        [weekDatesTable[1], displayedScores[0][1]],
        [weekDatesTable[2], displayedScores[1][1]],
        [weekDatesTable[3], displayedScores[2][1]],
      ]);

      setScoresData(newScoresData);
      setWeekDates(getCurrentWeekDates(newDate));
      clearGridData(gridData);
      setStartDate(newDate);
    }

    // Update the previous day to current day for the next check
    setPrevDay(currentDay);
  }, [prevDay, startDate, weekDates, scoresData, displayedScores, gridData, weekDatesTable]);

  //#endregion

  //#region Handlers
  // Click event handler for each cell
  const handleCellClick = (habitIndex, dayIndex) => {
    const newGridData = [...gridData];
    const currentValue = newGridData[habitIndex].days[dayIndex];
    const selectedWCount = newGridData[habitIndex].selectedWCount; // Get selectedWCount for the habit

    if (selectedWCount === undefined || selectedWCount === 'Enter Max Points') {
      // Handle when selectedWCount is not defined or set to 'Enter Max Points'
      if (selectedWCount === 'Enter Max Points') alert('Please add a habit or select the max number of points for this habit.');

      return;
    }

    if (currentValue >= 0 && currentValue < selectedWCount) {
      // Increment the cell value within the selectedWCount limit
      newGridData[habitIndex].days[dayIndex] = currentValue + 1;
    }
    else if (currentValue === selectedWCount) {
      newGridData[habitIndex].days[dayIndex] = -1; // Set to -1 if it reaches selectedWCount
    }
    else {
      // Reset to blank if it exceeds selectedWCount
      newGridData[habitIndex].days[dayIndex] = 0;
    }

    setDisplayedScores([
      [weekDatesTable[0], calculateScore()],
      [weekDatesTable[1], displayedScores[1][1]],
      [weekDatesTable[2], displayedScores[2][1]],
      [weekDatesTable[3], displayedScores[3][1]],
    ]);

    // Calculate streak
    let streak = 0;
    for (let i = dayIndex; i >= 0; i--) {
      if (newGridData[habitIndex].days[i] > 0) {
        streak++;
      } else {
        break;
      }
    }
    newGridData[habitIndex].streak = streak;

    setGridData(newGridData);
    updateScoresData();
    setShowAddHabit(false);
    setIsAddHabitVisible(false);
  };

  const handleAddNewHabit = () => {
    if (gridData.length >= 6) {
      showSnackbar('Research shows that it is harder to form many habits at once. Please limit your habits to 6 or less.', 'info');
      setShowAddHabit(false);
      setIsAddHabitVisible(false);
      return;
    }

    const newHabit = {
      habit: newHabitName,
      days: new Array(7).fill(0),
      selectedWCount: parseInt(selectedWCount),
    };

    // Replace the initial "Click the edit icon!" habit with the new habit
    if (gridData.length === 1 && gridData[0].habit === 'Click the edit icon and "Add Habit".') {
      setGridData([newHabit]);
    } else {
      setGridData([...gridData, newHabit]);
    }

    setShowAddHabit(false);
    setNewHabitName('');
    setSelectedWCount(selectedWCount);
    setIsAddHabitVisible(false);
    showSnackbar('Habit added successfully.', 'success');
  };

  const handleNameSubmit = (name) => {
    // Set the user's name when it's submitted
    setUserName(name);
  };

  const handlePopupClose = (habitData) => {
    setGridData([habitData]);
    setShowStartupPopup(false);
    // chrome.storage.sync.set({ userHabit: habitData });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleConfirmDelete = (habitIndex) => {
    setConfirmDelete({ open: true, habitIndex });
  };

  const handleDeleteConfirmed = () => {
    const updatedGridData = [...gridData];
    updatedGridData.splice(confirmDelete.habitIndex, 1);
    setGridData(updatedGridData);
    setIsDeleteDropdownVisible(false);
    setConfirmDelete({ open: false, habitIndex: null });
    showSnackbar('Habit deleted successfully.', 'success');
  };

  //#endregion

  //#region Helper Functions
  const updateScoresData = () => {
    const newScoresData = [];

    gridData.forEach((habit) => {
      const habitScore = habit.days.reduce((acc, value) => {
        if (value >= 1 && value <= 3) {
          acc += value;
        }
        return acc;
      }, 0);


      newScoresData.push({
        habit: habit.habit,
        scores: habit.days,
        totalScore: habitScore,
      });
    });

    setScoresData([...newScoresData]);
  };

  const calculateScore = () => {
    let score = 0;
    gridData.forEach((habit) => {
      habit.days.forEach((value) => {
        if (value != -1) score += value;
      });
    });
    return score;
  };

  // Function to clear the grid data for new week
  const clearGridData = (gridData) => {
    const clearedGridData = gridData.map(habit => ({
      ...habit,
      days: new Array(7).fill(0)
    }));

    setGridData(clearedGridData);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Component to display the submitted scores
  const SubmittedScoresTable = ({ displayedScores, weekDatesTable }) => {

    return (
      <div className="SubmittedScores">
        <table>
          <thead>
            <tr>
              <th>Week</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{weekDatesTable[0]}</td>
              <td>{displayedScores[0][1]}</td>
            </tr>
            <tr>
              <td>{weekDatesTable[1]}</td>
              <td>{displayedScores[1][1]}</td>
            </tr>
            <tr>
              <td>{weekDatesTable[2]}</td>
              <td>{displayedScores[2][1]}</td>
            </tr>
            <tr>
              <td>{weekDatesTable[3]}</td>
              <td>{displayedScores[3][1]}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  //#endregion

  //#region Render (HTML)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <img
              src={extensionIcon}
              alt="Trackr Icon"
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                width: '48px',
                height: '48px',
                zIndex: 1000,
              }}
            />
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
              {userName}'s Trackr 
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              aria-label="menu"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { handleMenuClose(); setIsAddHabitVisible(true); }}>Add Habit</MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); setIsDeleteDropdownVisible(true); }}>Delete Habit</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '70%' }}>
            <HabitGrid
              gridData={gridData}
              weekDates={weekDates}
              onCellClick={handleCellClick}
              calculateScore={calculateScore}
            />
          </Box>
        </Box>


        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto' }}>
          <Container maxWidth="sm">
            <Typography variant="body2" color="text.secondary" align="center">
              © 2024 Trackr v1.0.0
            </Typography>
          </Container>
        </Box>

        <Dialog open={isAddHabitVisible} onClose={() => setIsAddHabitVisible(false)}>
          <DialogTitle>Add New Habit</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="habit-name"
              label="Habit Name"
              type="text"
              fullWidth
              variant="standard"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
            />
            <Select
              value={selectedWCount}
              onChange={(e) => setSelectedWCount(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            >
              <SelectMenuItem value={1}>1 point</SelectMenuItem>
              <SelectMenuItem value={2}>2 points</SelectMenuItem>
              <SelectMenuItem value={3}>3 points</SelectMenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddHabitVisible(false)}>Cancel</Button>
            <Button onClick={handleAddNewHabit} disabled={!newHabitName}>Add</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isDeleteDropdownVisible}
          onClose={() => setIsDeleteDropdownVisible(false)}
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        >
          <DialogTitle sx={{
            fontSize: '1.5rem',
            paddingBottom: '16px',
          }}>
            Delete Habit
          </DialogTitle>
          <Divider />
          <List sx={{
            width: '100%',
            minWidth: 250,
            bgcolor: 'background.paper'
          }}>
            {gridData.map((habit, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleConfirmDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemText
                  primary={habit.habit}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItem>
            ))}
          </List>
        </Dialog>
        <Dialog
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, habitIndex: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this habit?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete({ open: false, habitIndex: null })}>Cancel</Button>
            <Button onClick={handleDeleteConfirmed} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        {showStartupPopup && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#faf3e0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}>
            <StartupPopup onClose={handlePopupClose} onNameSubmit={handleNameSubmit} />
          </Box>
        )}

        <Box sx={{ position: 'fixed', left: 20, bottom: 20 }}>
          <SubmittedScoresTable displayedScores={displayedScores} weekDatesTable={weekDatesTable} />
        </Box>
      </Box>
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
    </ThemeProvider>
  );
};

export default App;