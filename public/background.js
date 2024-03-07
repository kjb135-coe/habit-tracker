// https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/events

// A background workers operates in the "background" between windows and/or tabs
// Used for tasks that persist beyond the lifecycle of a window or tab, i.e. maintaining a state

// SERVICE WORKERS ACCESS DOM STUFF
// NO ACCESS TO ELEMENTS
// BUT SERVICE WORKER MUST SEND REQUESTS TO BACKGROUND WORKER

// TIPS
// 1. Do not couple/nest event declarations

// Let us see how many tabs are created 
chrome.tabs.onCreated.addListener(function (tab) {
    console.log('Tab created: ', tab.id);
});

// Username: listens to App.js, sends to content service worker 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if request action regards submitted name
    if (request.action === "nameSubmitted") {
        const name = request.name;

        // Send message regarding username submission to all open tabs
        chrome.tabs.query({}, (tabs) => {
            for(let i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, { action: "updateName", name: name });
            }
        });
    }
});