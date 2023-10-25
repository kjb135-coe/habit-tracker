// background.js

// Initialize the habit data if it doesn't exist in storage
chrome.storage.sync.get(['habitData'], function(result) {
    if (!result.habitData) {
      const initialHabitData = { habits: [] };
      chrome.storage.sync.set({ habitData: initialHabitData });
    }
  });
  
  // Listen for changes in habit data from content scripts
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateHabitData') {
      const updatedHabitData = request.habitData;
  
      // Save the updated habit data to storage
      chrome.storage.sync.set({ habitData: updatedHabitData }, function() {
        console.log('Habit data updated:', updatedHabitData);
      });
    }
  });
  
  // Function to retrieve the habit data from storage
  function getHabitData(callback) {
    chrome.storage.sync.get(['habitData'], function(result) {
      callback(result.habitData || { habits: [] });
    });
  }

// Initialize user data
let userData = { name: '', habits: [] };

// Load user data from storage on extension startup
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('userData', (result) => {
    if (result.userData) {
      userData = result.userData;
    }
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get-user-data') {
    sendResponse(userData);
  } else if (request.action === 'update-user-data') {
    userData = request.data;
    // Save the updated user data to storage
    chrome.storage.sync.set({ userData });
  }
});
