// src/utils/scoreUtils.js

export const calculateScore = (gridData) => {
    let score = 0;
    gridData.forEach((habit) => {
      habit.days.forEach((value) => {
        if (value !== -1) score += value;
      });
    });
    return score;
  };
  
  export const clearGridData = (gridData) => {
    return gridData.map(habit => ({
      ...habit,
      days: new Array(7).fill(0)
    }));
  };