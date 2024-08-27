/* global chrome */

// Tab change listener
chrome.storage.onChanged.addListener(function(changes, namespace) {
  // console.log('Reached onChanged listener');
  if (namespace === 'sync' && changes.state) {
    // Send the new state to the window
    // console.log('TAB CHANGE LISTENER FIRED')
    window.postMessage({ type: 'FROM_CONTENT_SCRIPT', payload: changes.state.newValue }, '*');
  }
});

// New tab listener
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'NEW_TAB_CREATED') {
    // Send the state to the window
    // console.log('NEW TAB LISTENER FIRED')
    window.postMessage({ type: 'FROM_CONTENT_SCRIPT', payload: message.payload.state }, '*');
  }
});

// Page refresh listener
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'PAGE_REFRESH_DETECTED') {
    // Send the state to the window
    // console.log('PAGE REFRESH LISTENER FIRED')
    window.postMessage({ type: 'FROM_CONTENT_SCRIPT', payload: message.payload.state }, '*');
  }
});