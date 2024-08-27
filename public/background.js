/* global chrome */

// https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/events

// A background workers operates in the "background" between windows and/or tabs
// Used for tasks that persist beyond the lifecycle of a window or tab, i.e. maintaining a state

// SERVICE WORKERS ACCESS DOM STUFF
// NO ACCESS TO ELEMENTS
// BUT SERVICE WORKER MUST SEND REQUESTS TO BACKGROUND WORKER

// TIPS
// 1. Do not couple/nest event declarations

// New tab and change listener
chrome.tabs.onCreated.addListener(function (tab) {
  // A new tab was created, do something...
  // Get the state from storage
  // console.log('created');
  chrome.storage.sync.get(['state'], function (result) {
    // Listen for when the tab is updated
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (info.status === 'complete' && tabId === tab.id) {
        // The new tab is fully loaded, send the message
        chrome.tabs.sendMessage(tab.id, { type: 'NEW_TAB_CREATED', payload: { tabId: tab.id, state: result.state } });
        // Remove this listener
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });
});

// Reload/refresh and change listener
chrome.webNavigation.onCommitted.addListener(function (details) {
  if (details.transitionType === 'reload' || details.transitionType === 'auto_subframe') {
    // Page is being reloaded or refreshed, handle accordingly
    chrome.storage.sync.get(['state'], function (result) {
      // Listen for when the tab is updated
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === 'complete' && tabId === details.tabId) {
          // The new tab is fully loaded, send the message
          chrome.tabs.sendMessage(details.tabId, { type: 'PAGE_REFRESH_DETECTED', payload: { tabId: details.tabId, state: result.state } });
          // Remove this listener
          chrome.tabs.onUpdated.removeListener(listener);
        }
      });
    });
  }
});

let currentTabId;

chrome.tabs.onActivated.addListener(function(activeInfo) {
  if (currentTabId !== undefined) {
    // Check if the new tab is actually new
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      if (tab.url === "chrome://newtab/") {
        // This is a new tab, save the state of the previous tab
        setTimeout(function() {
          chrome.storage.sync.get(['state'], function(result) {
            // Save the state of the previous tab
            let newState = {...result.state, [currentTabId]: {/* state of the tab */}};
            chrome.storage.sync.set({state: newState}, function() {
              console.log('State saved for tab ' + currentTabId);
            });
          });
        }, 750);
      }
    });
  }

  // Update the current tab ID
  currentTabId = activeInfo.tabId;
});