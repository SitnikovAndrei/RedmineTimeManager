chrome.runtime.onInstalled.addListener(function() {
    chrome.runtime.openOptionsPage();
});


// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.windows.create({
//     url: chrome.runtime.getURL("../popup.html"),
//     type: "popup"
//   });
// });