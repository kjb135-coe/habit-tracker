/* global chrome */

import './App.css';
import React, { useState, useEffect } from 'react';
import LineChart from './LineChart';
import StartupPopup from './StartupPopup';

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
    { habit: 'Click the edit icon and "Add Habit".', days: [0, 0, 0, 0, 0, 0, 0] },
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

  //#endregion

  //#region Hooks
  // Communcation for background/content workers
  // Triggerred whenever any of the states listed are changed
  // Chrome only allows 120 requests per minute, so this is a workaround
  useEffect(() => {
    const interval = setInterval(() => {
      // Store the state in memory using chrome.storage.sync
      chrome.storage.sync.set({
        state: {
          gridData,
          showAddHabit,
          newHabitName,
          selectedWCount,
          isDropdownVisible,
          isAddHabitVisible,
          isDeleteDropdownVisible,
          scoresData,
          weekDates,
          showStartupPopup,
          userName,
          weekDatesTable,
          displayedScores,
          prevDay
        }
      });
    }, 660);
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [
    gridData,
    showAddHabit,
    newHabitName,
    selectedWCount,
    isDropdownVisible,
    isAddHabitVisible,
    isDeleteDropdownVisible,
    scoresData,
    weekDates,
    showStartupPopup,
    userName,
    weekDatesTable,
    displayedScores,
    prevDay
  ]);

  // Listen for messages from the content script
  useEffect(() => {
    function handleMessage(event) {
      // Only trust messages from the same frame
      if (event.source !== window) return;

      const message = event.data;

      // Make sure the message has the correct format
      if (typeof message === 'object' && message !== null && message.type === 'FROM_CONTENT_SCRIPT') {
        const payload = message.payload;

        // Check the payload type
        if (payload && (payload.type === 'NEW_TAB_CREATED' || payload.type === 'PAGE_REFRESH_DETECTED')) {
          // A new tab was created, update the state
          setGridData(payload.gridData);
          setShowAddHabit(payload.showAddHabit);
          setNewHabitName(payload.newHabitName);
          setSelectedWCount(payload.selectedWCount);
          setIsDropdownVisible(payload.isDropdownVisible);
          setIsAddHabitVisible(payload.isAddHabitVisible);
          setIsDeleteDropdownVisible(payload.isDeleteDropdownVisible);
          setScoresData(payload.scoresData);
          setWeekDates(payload.weekDates);
          setShowStartupPopup(payload.showStartupPopup);
          setUserName(payload.userName);
          setWeekDatesTable(payload.weekDatesTable);
          setDisplayedScores(payload.displayedScores);
          setPrevDay(payload.prevDay);
        } else if (payload) {
          // Handle other messages
          setGridData(payload.gridData);
          setShowAddHabit(payload.showAddHabit);
          setNewHabitName(payload.newHabitName);
          setSelectedWCount(payload.selectedWCount);
          setIsDropdownVisible(payload.isDropdownVisible);
          setIsAddHabitVisible(payload.isAddHabitVisible);
          setIsDeleteDropdownVisible(payload.isDeleteDropdownVisible);
          setScoresData(payload.scoresData);
          setWeekDates(payload.weekDates);
          setShowStartupPopup(payload.showStartupPopup);
          setUserName(payload.userName);
          setWeekDatesTable(payload.weekDatesTable);
          setDisplayedScores(payload.displayedScores);
          setPrevDay(payload.prevDay);
        }
      }
    }

    // Add event listener for messages
    window.addEventListener('message', handleMessage);

    // Make sure to clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Check for new week
  useEffect(() => {
    const now = new Date();
    const currentDay = now.getDay();
  
    // Check if today is Monday and the previous day was Sunday
    if (currentDay === 1 && prevDay === 0) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + 7);
  
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
        [weekDatesTable[1], displayedScores[1][1]],
        [weekDatesTable[2], displayedScores[2][1]],
        [weekDatesTable[3], displayedScores[3][1]],
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
      if (selectedWCount === 'Enter Max Points') alert('enter max points.');
      else alert('undefined.');
      alert('Please add a habit or select the max number of points for this habit.');
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
      [weekDatesTable[1], displayedScores[0][1]],
      [weekDatesTable[2], displayedScores[1][1]],
      [weekDatesTable[3], displayedScores[2][1]],
    ]);

    setGridData(newGridData);
    updateScoresData();
    setShowAddHabit(false);
    setIsAddHabitVisible(false);
  };

  const handleAddHabitClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
    if (isDropdownVisible) setShowAddHabit(true);
    else setShowAddHabit(false);
  };

  const handleAddNewHabit = () => {
    if (newHabitName.trim() === '') {
      alert('Please enter a habit name.');
      return;
    }

    if (gridData.length >= 6) {
      alert('Research shows that it is harder to form many habits at once. Please limit your habits to 6 or less');
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
  };

  const toggleAddHabit = () => {
    setIsAddHabitVisible(!isAddHabitVisible);
  };

  const handleDeleteHabitClick = () => {
    setIsDeleteDropdownVisible(!isDeleteDropdownVisible);
  };

  const handleHabitDelete = (habitIndex) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      const updatedGridData = [...gridData];
      updatedGridData.splice(habitIndex, 1); // Remove the habit at the specified index
      setGridData(updatedGridData);
      setIsDeleteDropdownVisible(false);
    }
  };

  const handleNameSubmit = (name) => {
    // Set the user's name when it's submitted
    setUserName(name);

    // Close the startup popup
    setShowStartupPopup(false);
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
    <div className="App">
      {showStartupPopup && ( // Render the popup if showStartupPopup is true
        <StartupPopup onClose={() => setShowStartupPopup(false)} onNameSubmit={handleNameSubmit} />
      )}
      <div className="EditButtonContainer">
        <button className="EditButton" onClick={handleAddHabitClick}>
          <img src="editButton.png" alt="" />
        </button>
        {showAddHabit && (
          <div className="Dropdown">
            <button onClick={toggleAddHabit}>Add Habit</button>
            <button className="DeleteButton" onClick={handleDeleteHabitClick}>
              Delete Habit
            </button>
            {isDeleteDropdownVisible && (
              <div className="DeleteDropdown">
                {gridData.map((habit, habitIndex) => (
                  <button
                    className="DeleteHabitButton"
                    key={habitIndex}
                    onClick={() => handleHabitDelete(habitIndex)}
                  >
                    {habit.habit}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="GridContainer">
        <header className="App-header">
          <h1 className="App-title">{showStartupPopup ? 'Trackr' : `${userName}'s Trackr 🚀`}</h1>
        </header>
        <table>
          <thead>
            <tr>
              <th></th>
              {weekDates.map((date, dayIndex) => (
                <th key={dayIndex}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridData.map((habit, habitIndex) => (
              <tr key={habitIndex}>
                <td>{habit.habit}</td>
                {habit.days.map((value, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={
                      value >= 1 && value <= 3 ? 'green' : value === -1 ? 'red' : 'middle'
                    }
                    onClick={() => handleCellClick(habitIndex, dayIndex)}
                  >
                    {value >= 1 && value <= 3
                      ? Array.from({ length: value }, (v, i) => (
                        <span key={i} className="green-emoji">
                          ✅
                        </span>
                      ))
                      : value === -1
                        ? <span className="red-emoji">❌</span>
                        : ''}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Score</td>
              <td colSpan="7">
                <b>{calculateScore()} </b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="Footer">
        <SubmittedScoresTable displayedScores={displayedScores} weekDatesTable={weekDatesTable} />
        {isAddHabitVisible && (
          <div className="AddHabit">
            <input
              type="text"
              placeholder="New Habit Name"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
            />
            <select
              value={selectedWCount}
              onChange={(e) => setSelectedWCount(e.target.value)}
            >
              <option disabled>Enter Max Points</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <button onClick={handleAddNewHabit}>Add</button>
          </div>
        )}
        <p>&copy; 2024 Trackr v1.0.0</p>
        {/* <LineChart /> */}
      </div>
    </div>
  );
  //#endregion
};

export default App;