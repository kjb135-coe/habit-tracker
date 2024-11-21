/* global chrome */

// Helper function to safely send message to window
const sendMessageToWindow = (message) => {
  try {
    window.postMessage(message, '*');
  } catch (error) {
    console.error('Error sending message to window:', error);
  }
};

// Storage change listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.state) {
    console.log('Storage changed:', changes.state.newValue);
    sendMessageToWindow({
      type: 'FROM_CONTENT_SCRIPT',
      payload: changes.state.newValue
    });
  }
});

// Message listeners with improved error handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  
  if (message.type === 'NEW_TAB_CREATED' || message.type === 'PAGE_REFRESH_DETECTED') {
    sendMessageToWindow({
      type: 'FROM_CONTENT_SCRIPT',
      payload: message.payload.state
    });
  }
});