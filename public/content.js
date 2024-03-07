/* global chrome */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateName") {
    const name = request.name;
    // Handle the new name
    // This could involve updating the DOM, storing the name somewhere, etc.

    // Find an element with the ID 'userName' and update its text content
    // const usernameElement = document.getElementById('userName');
    // if (usernameElement) {
    //   usernameElement.textContent = name;
    // }
  }
});