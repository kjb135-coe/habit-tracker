/* global chrome */

// Helper function to safely get state
const getSafeState = async () => {
  try {
    const result = await chrome.storage.sync.get(['state']);
    return result.state || {};
  } catch (error) {
    console.error('Error getting state:', error);
    return {};
  }
};

// Helper function to safely send message
const sendSafeMessage = async (tabId, message) => {
  try {
    await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// New tab listener with improved error handling
chrome.tabs.onCreated.addListener(async (tab) => {
  const state = await getSafeState();
  
  const listener = async (tabId, info) => {
    if (info.status === 'complete' && tabId === tab.id) {
      await sendSafeMessage(tab.id, {
        type: 'NEW_TAB_CREATED',
        payload: { tabId: tab.id, state }
      });
      chrome.tabs.onUpdated.removeListener(listener);
    }
  };

  chrome.tabs.onUpdated.addListener(listener);
});

// Reload/refresh listener with improved error handling
chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.transitionType === 'reload' || details.transitionType === 'auto_subframe') {
    const state = await getSafeState();
    
    const listener = async (tabId, info) => {
      if (info.status === 'complete' && tabId === details.tabId) {
        await sendSafeMessage(details.tabId, {
          type: 'PAGE_REFRESH_DETECTED',
          payload: { tabId: details.tabId, state }
        });
        chrome.tabs.onUpdated.removeListener(listener);
      }
    };

    chrome.tabs.onUpdated.addListener(listener);
  }
});