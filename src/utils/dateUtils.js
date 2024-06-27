// src/utils/dateUtils.js

export const getCurrentWeekDates = (startDate) => {
    const monday = getMonday(startDate);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date.toLocaleDateString('en-US', { weekday: 'long', month: 'numeric', day: 'numeric' }));
    }
    return weekDates;
  };
  
  export const getMonday = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };
  
  export const calculateWeekDate = (startDate, i) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() - i * 7);
    const weekStart = getMonday(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return `${weekStart.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}`;
  };