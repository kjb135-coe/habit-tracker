/* global chrome */

// https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/events

// A background workers operates in the "background" between windows and/or tabs
// Used for tasks that persist beyond the lifecycle of a window or tab, i.e. maintaining a state

// SERVICE WORKERS ACCESS DOM STUFF
// NO ACCESS TO ELEMENTS
// BUT SERVICE WORKER MUST SEND REQUESTS TO BACKGROUND WORKER

// TIPS
// 1. Do not couple/nest event declarations

// Let us see how many tabs are created 
// chrome.tabs.onCreated.addListener(function (tab) {
//     console.log('Tab created: ', tab.id);
// });

// Define state
// let state = {};

// Add listener for state change
// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   if (namespace === 'sync' && changes.state) {
//     chrome.tabs.query({}, function(tabs) {
//       for (let tab of tabs) {
//         chrome.tabs.sendMessage(tab.id, { state: changes.state.newValue });
//         // console.log('FYI the state changed: ', tab.id);
//       }
//     });
//   }
// });

// Add listener for state change
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (sender.action === "stateChanged") {
//     // Update the state
//     state = sender.state;

//     // Broadcast the new state to all open tabs
//     chrome.tabs.query({}, (tabs) => {
//       for (let i = 0; i < tabs.length; i++) {
//         chrome.tabs.sendMessage(tabs[i].id, { action: "updateState", state });
//       }
//     });
//   }
// });

chrome.tabs.onCreated.addListener(function(tab) {
  // A new tab was created, do something...
  // Get the state from storage
  chrome.storage.sync.get(['state'], function(result) {
    // Listen for when the tab is updated
    chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
      if (info.status === 'complete' && tabId === tab.id) {
        console.log('Tab reloaded');
        // The new tab is fully loaded, send the message
        chrome.tabs.sendMessage(tab.id, { type: 'NEW_TAB_CREATED', payload: { tabId: tab.id, state: result.state } });
        // Remove this listener
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });
});