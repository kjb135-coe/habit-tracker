// src/components/ScoresTable.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ScoresTable = ({ displayedScores, weekDatesTable }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Week</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedScores.map((score, index) => (
            <TableRow key={index}>
              <TableCell>{weekDatesTable[index]}</TableCell>
              <TableCell>{score[1]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScoresTable;