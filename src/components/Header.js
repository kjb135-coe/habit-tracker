// src/components/Header.js
import React from 'react';
import { Typography, AppBar, Toolbar } from '@mui/material';

const Header = ({ userName }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          {userName}'s Trackr 🚀
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;