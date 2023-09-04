import './App.css';
import React, { useState, useRef } from 'react';

const App = () => {
  const [gridData, setGridData] = useState([
    { habit: 'Click the edit icon!', days: [0, 0, 0, 0, 0, 0, 0] },
  ]);

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedWCount, setSelectedWCount] = useState(1);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isAddHabitVisible, setIsAddHabitVisible] = useState(false);
  const [isDeleteDropdownVisible, setIsDeleteDropdownVisible] = useState(false); // New state for delete dropdown
  const [habitToDelete, setHabitToDelete] = useState(null); // New state to store the habit to delete


  // Click event handler for each cell
  const handleCellClick = (habitIndex, dayIndex) => {
    const newGridData = [...gridData];
    const currentValue = newGridData[habitIndex].days[dayIndex];
    const selectedWCount = newGridData[habitIndex].selectedWCount; // Get selectedWCount for the habit

    if (selectedWCount === undefined || selectedWCount === 'Enter Max Points') {
      // Handle when selectedWCount is not defined or set to 'Enter Max Points'
      alert('Please select the max number of points for this habit.');
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

    setGridData(newGridData);
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

  const getCurrentWeekDates = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday

    // Calculate the number of days to subtract to get to the start of the week (Monday)
    const daysUntilMonday = currentDay === 0 ? 6 : currentDay - 1;

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - daysUntilMonday + i);
      weekDates.push(date.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' }));
    }

    return weekDates;
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

    const newHabit = {
      habit: newHabitName,
      days: new Array(7).fill(0),
      selectedWCount: parseInt(selectedWCount),
    };

    // Replace the initial "Click the edit icon!" habit with the new habit
    if (gridData.length === 1 && gridData[0].habit === 'Click the edit icon!') {
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

  return (
    <div className="App">
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
            <button>Reset</button>
          </div>
        )}
      </div>
      <div className="GridContainer">
        <header className="App-header">
          <h1 className="App-title">Habit Tracker</h1>
        </header>
        <table>
          <thead>
            <tr>
              <th></th>
              {getCurrentWeekDates().map((date, dayIndex) => (
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
                    {value >= 1 && value <= 3 ? 'W'.repeat(value) : value === -1 ? 'L' : ''}
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
          <button onClick={handleAddNewHabit}>Add Habit +</button>
        </div>
      )}
    </div>
  );
};

export default App;