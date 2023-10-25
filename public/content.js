// content.js

// Function to request user data from the background script
const requestUserData = () => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'get-user-data' }, (response) => {
        resolve(response);
      });
    });
  };
  
  // Function to update user data in the background script
  const updateUserData = (newData) => {
    chrome.runtime.sendMessage({ action: 'update-user-data', data: newData });
  };
  
  // Main logic for your content script
  (async () => {
    // Retrieve user data from the background script
    const user = await requestUserData();
  
    // Use the user data in your extension
    // For example, update the page with the user's name and habits
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('habits-list').textContent = user.habits.join(', ');
  
    // Update user data if needed
    user.habits.push('New Habit');
    updateUserData(user);
  })();
  