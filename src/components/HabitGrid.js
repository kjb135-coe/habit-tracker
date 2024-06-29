import React, { useRef, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import lottie from 'lottie-web';
import checkmarkAnimation from '../animations/checkmark_lottie.json';
import xmarkAnimation from '../animations/xmark_lottie.json';

const LottieCheckmark = () => {
  const animationContainer = useRef(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: checkmarkAnimation // Ensure this path is correct
      });

      return () => anim.destroy();
    }
  }, []);

  return <div ref={animationContainer} style={{ width: '22px', height: '22px', display: 'inline-block' }}></div>;
};

const LottieXmark = () => {
  const animationContainer = useRef(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: xmarkAnimation // Ensure this path is correct
      });

      return () => anim.destroy();
    }
  }, []);

  return <div ref={animationContainer} style={{ width: '40px', height: '40px', display: 'inline-block' }}></div>;
};

const HabitGrid = ({ gridData, weekDates, onCellClick, calculateScore }) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '12.5%' }}></TableCell>
            {weekDates.map((date, index) => (
              <TableCell key={index} align="center" sx={{ width: '12.5%' }}>{date}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {gridData.map((habit, habitIndex) => (
            <TableRow key={habitIndex}>
              <TableCell component="th" scope="row">{habit.habit}</TableCell>
              {habit.days.map((value, dayIndex) => (
                <TableCell 
                  key={dayIndex} 
                  align="center"
                  onClick={() => onCellClick(habitIndex, dayIndex)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: value >= 1 && value <= 3 ? '#aaffaa' : value === -1 ? '#ffaaaa' : 'inherit',
                    '&:hover': {
                      backgroundColor: value >= 1 && value <= 3 ? '#88dd88' : value === -1 ? '#dd8888' : '#e0e0e0',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px' }}>
                    {value >= 1 && value <= 3
                      ? Array.from({ length: value }, (_, i) => <LottieCheckmark key={i} />)
                      : value === -1
                        ? <LottieXmark />
                        : null}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell component="th" scope="row">Score</TableCell>
            <TableCell colSpan={7} align="center">
              <strong>{calculateScore()}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HabitGrid;