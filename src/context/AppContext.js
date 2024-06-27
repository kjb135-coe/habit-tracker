// src/context/AppContext.js

import React, { createContext, useReducer } from 'react';
import { getCurrentWeekDates, getMonday, calculateWeekDate } from '../utils/dateUtils';

const initialState = {
  userName: '',
  showStartupPopup: true,
  gridData: [
    { habit: 'Click the edit icon and "Add Habit".', days: [0, 0, 0, 0, 0, 0, 0] },
  ],
  weekDates: getCurrentWeekDates(new Date()),
  weekDatesTable: [
    calculateWeekDate(new Date(), 0),
    calculateWeekDate(new Date(), 1),
    calculateWeekDate(new Date(), 2),
    calculateWeekDate(new Date(), 3)
  ],
  displayedScores: [
    [calculateWeekDate(new Date(), 0), 0],
    [calculateWeekDate(new Date(), 1), 0],
    [calculateWeekDate(new Date(), 2), 0],
    [calculateWeekDate(new Date(), 3), 0]
  ],
  prevDay: new Date().getDay(),
  startDate: new Date(),
  scoresData: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };
    case 'CLOSE_STARTUP_POPUP':
      return { ...state, showStartupPopup: false };
    case 'UPDATE_GRID_DATA':
      return { ...state, gridData: action.payload };
    case 'UPDATE_WEEK_DATA':
      return { ...state, ...action.payload };
    case 'SET_PREV_DAY':
      return { ...state, prevDay: action.payload };
    case 'ADD_HABIT':
      return { ...state, gridData: [...state.gridData, action.payload] };
    case 'DELETE_HABIT':
      return { ...state, gridData: state.gridData.filter((_, index) => index !== action.payload) };
    case 'UPDATE_CELL':
      const newGridData = [...state.gridData];
      newGridData[action.payload.habitIndex].days[action.payload.dayIndex] = action.payload.value;
      return { ...state, gridData: newGridData };
    default:
      return state;
  }
}

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};