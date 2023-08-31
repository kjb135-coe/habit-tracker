import './App.css';
import React, { useState, useRef } from 'react';

const App = () => {
  const [gridData, setGridData] = useState([
    { habit: 'Sleep 7.5+ Hours', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'Journal', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'Exercise', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'TODO List', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'Calendar', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'No Substances', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'Read 10 Pages', days: [0, 0, 0, 0, 0, 0, 0] },
    { habit: 'ST <3.5 Hours', days: [0, 0, 0, 0, 0, 0, 0] },
  ]);

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

  const getCurrentDate = (dayOffset) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + dayOffset);
    return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' });
  };
  
  const getMondayDate = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const daysUntilMonday = currentDay === 0 ? 6 : currentDay - 1;
    currentDate.setDate(currentDate.getDate() - daysUntilMonday);
    return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' });
  };

  return (
    <div className="App">     
      <div className="GridContainer">
        <header className="App-header">
          <h1 className="App-title">Habit Tracker</h1>
        </header>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{getMondayDate()}</th>
              {[...Array(6)].map((_, dayIndex) => (
                <th key={dayIndex}>{getCurrentDate(dayIndex - 1)}</th>
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
    </div>
  );
};

export default App;
