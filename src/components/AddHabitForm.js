// src/components/AddHabitForm.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const AddHabitForm = ({ onAddHabit }) => {
  const [habitName, setHabitName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit({ habit: habitName, days: [0, 0, 0, 0, 0, 0, 0] });
      setHabitName('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        label="New Habit"
        variant="outlined"
        size="small"
      />
      <Button type="submit" variant="contained" sx={{ ml: 1 }}>
        Add Habit
      </Button>
    </Box>
  );
};

export default AddHabitForm;