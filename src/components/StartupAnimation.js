// src/components/StartupAnimation.js

import React from 'react';
import { motion } from 'framer-motion';
import './StartupAnimation.css';
import { Typography } from '@mui/material';

const StartupAnimation = ({ animationState }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    visible: { opacity: 1 },
    exiting: { opacity: 0 },
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exiting: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      className="startup-animation"
      variants={containerVariants}
      initial="initial"
      animate={animationState === 'exiting' ? 'exiting' : 'visible'}
      exit="exiting"
      transition={{ duration: 1 }}
    >
      <motion.h1
        variants={textVariants}
        initial="initial"
        animate={animationState === 'exiting' ? 'exiting' : 'visible'}
        exit="exiting"
        transition={{ duration: 1 }}
      >
        <Typography variant='h1'> Trackr </Typography>
      </motion.h1>
    </motion.div>
  );
};

export default StartupAnimation;