import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const WeeklyProgressBar = ({ currentScore, weeklyGoal }) => {
  const progress = weeklyGoal > 0 ? (currentScore / weeklyGoal) * 100 : 0;
  const isGoalAchieved = currentScore >= weeklyGoal;

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Weekly Progress: {currentScore} / {weeklyGoal}
        </Typography>
        <Typography variant="body2" color={isGoalAchieved ? 'success.main' : 'text.secondary'}>
          {progress.toFixed(0)}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress > 100 ? 100 : progress} 
        sx={{
          height: 10,
          borderRadius: 5,
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            backgroundColor: isGoalAchieved ? 'success.main' : 'primary.main',
          },
        }}
      />
    </Box>
  );
};

export default WeeklyProgressBar;