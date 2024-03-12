// /* global chrome */

// // console.log('Hello from the content-script')
// // alert('Hello from the content-script')

// // Add listener to update each tab's state
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (sender.action === "updateState") {
//     // Update the state
//     const {
//       gridData,
//       showAddHabit,
//       newHabitName,
//       selectedWCount,
//       isDropdownVisible,
//       isAddHabitVisible,
//       isDeleteDropdownVisible,
//       scoresData,
//       currentWeek,
//       showStartupPopup,
//       userName,
//     } = sender.state;

//     // Update your React state here
//     // You might need to use some method to trigger a re-render
//     this.setState({
//       gridData,
//       showAddHabit,
//       newHabitName,
//       selectedWCount,
//       isDropdownVisible,
//       isAddHabitVisible,
//       isDeleteDropdownVisible,
//       scoresData,
//       currentWeek,
//       showStartupPopup,
//       userName,
//     });
//   }
// });

// // contentscript.js
// chrome.tabs.executeScript(null, {
//   file: "re-render.js"
// });

// // re-render.js
// document.location.reload();

// This is triggered on every tab change, not new tab
// chrome.tabs.onActivated.addListener(function(activeInfo) {
//   // Get the state of the newly activated tab
//   chrome.storage.sync.get(['state'], function(result) {
//     // Send the state to the window
//     // window.postMessage({ type: 'FROM_CONTENT_SCRIPT', payload: result.state, activeInfo }, '*');
//     console.log('FYI the tab ' + activeInfo.tabId + ' state changed: ', result.state);
//   });
// });

// Tab change listener
chrome.storage.onChanged.addListener(function(changes, namespace) {
  // console.log('Reached onChanged listener');
  if (namespace === 'sync' && changes.state) {
    // Send the new state to the window
    console.log('TAB CHANGE LISTENER FIRED')
    window.postMessage({ type: 'FROM_CONTENT_SCRIPT', payload: changes.state.newValue }, '*');
  }
});

// New tab listener
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'NEW_TAB_CREATED') {
    // Send the state to the window
    console.log('NEW TAB LISTENER FIRED')
    window.postMessage({ type: 'FROM_CONTENT_SCRIPT', payload: message.payload.state }, '*');
  }
});

// Page refresh listener
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'PAGE_REFRESH_DETECTED') {
    // Send the state to the window
    console.log('PAGE REFRESH LISTENER FIRED')
    window.postMessage({ type: 'FROM_CONTENT_SCRIPT', payload: message.payload.state }, '*');
  }
});