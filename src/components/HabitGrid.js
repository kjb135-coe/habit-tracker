// src/components/HabitGrid.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const HabitGrid = ({ gridData, weekDates, onCellClick }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Habit</TableCell>
            {weekDates.map((date, index) => (
              <TableCell key={index}>{date}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {gridData.map((habit, habitIndex) => (
            <TableRow key={habitIndex}>
              <TableCell>{habit.habit}</TableCell>
              {habit.days.map((value, dayIndex) => (
                <TableCell 
                  key={dayIndex} 
                  onClick={() => onCellClick(habitIndex, dayIndex)}
                  style={{cursor: 'pointer'}}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HabitGrid;