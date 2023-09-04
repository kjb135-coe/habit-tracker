import './App.css';
import React, { useState, useRef } from 'react';

const App = () => {
  const [gridData, setGridData] = useState([
    { habit: 'Sleep 7.5+ Hours', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'Journal', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'Exercise', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'TODO List', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'Calendar', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'Read 10 Pages', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'ST <3.5 Hours', days: [0, 0, 0, 0, 0, 0, 0] },
  ]);

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedWCount, setSelectedWCount] = useState(1);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isAddHabitVisible, setIsAddHabitVisible] = useState(false);


  // Click event handler for each cell
  const handleCellClick = (habitIndex, dayIndex) => {
    const newGridData = [...gridData];
    const currentValue = newGridData[habitIndex].days[dayIndex];

    if (habitIndex === 2 || habitIndex === 3 || habitIndex === 6 || habitIndex === 7) {
      if (currentValue === 0) newGridData[habitIndex].days[dayIndex] = 1;        // 1 green W
      else if (currentValue === 1) newGridData[habitIndex].days[dayIndex] = 2;   // 2 green W
      else if (currentValue === 2) newGridData[habitIndex].days[dayIndex] = 3;   // 3 green W
      else if (currentValue === 3) newGridData[habitIndex].days[dayIndex] = -1;   // 1 red L
      else newGridData[habitIndex].days[dayIndex] = 0;                          // Reset to blank
    }

    else {
      if (currentValue === 0) newGridData[habitIndex].days[dayIndex] = 1;        // 1 green W
      else if (currentValue === 1) newGridData[habitIndex].days[dayIndex] = -1;   // 1 red L
      else newGridData[habitIndex].days[dayIndex] = 0;                          // Reset to blank
    }

    setGridData(newGridData);
  };

  const calculateScore = () => {
    let score = 0;
    gridData.forEach((habit) => {
      habit.days.forEach((value) => {
        if(value != -1) score += value;
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

  
  const addNewHabit = () => {
    if (!newHabitName || selectedWCount === 'Enter Possible W\'s') {
      alert('Please enter a habit name and select the number of W\'s.');
      return;
    }
  
    const newHabit = {
      habit: newHabitName,
      days: Array(7).fill(0),
    };
  
    for (let i = 0; i < parseInt(selectedWCount); i++) {
      newHabit.days[i] = 1;
    }
  
    setGridData([...gridData, newHabit]);
    setNewHabitName('');
    setSelectedWCount('Enter Possible W\'s');
  };

  const handleAddHabitClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
    if(isDropdownVisible) setShowAddHabit(true);
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
    };

    for (let i = 0; i < selectedWCount; i++) {
      newHabit.days[i] = 1;
    }

    setGridData([...gridData, newHabit]);
    setShowAddHabit(false);
    setNewHabitName('');
    setSelectedWCount(1);
    setIsAddHabitVisible(false);
  };

  const toggleAddHabit = () => {
    setIsAddHabitVisible(!isAddHabitVisible);
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
            <button>Delete Habit</button>
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
            <option disabled>Enter Possible W's</option>
            <option value="1">1 W</option>
            <option value="2">2 W's</option>
            <option value="3">3 W's</option>
          </select>
          <button onClick={handleAddNewHabit}>Add Habit +</button>
        </div>
      )}
    </div>
  );
};

export default App;