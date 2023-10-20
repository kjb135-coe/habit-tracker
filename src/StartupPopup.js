// StartupPopup.js
import React, { useState } from 'react';
import './StartupPopup.css';

const StartupPopup = ({ onClose, onNameSubmit }) => {
  const [name, setName] = useState('');
  
  const handleSubmit = () => {
    if (name) {
      onNameSubmit(name);
      onClose();
    }
  };

  return (
    <div className="startup-popup">
      <h2>Welcome to Trackr! 😄</h2>
      <p>Get started by entering your name:</p>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setName(e.target.value);
            handleSubmit();
          }
        }}
      />
        <button className="StartTrackingButton" onClick={handleSubmit}>
          Start Tracking
        </button>
    </div>
  );
};

export default StartupPopup;
