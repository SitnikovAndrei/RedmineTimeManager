chrome.runtime.onInstalled.addListener(function() {
    chrome.runtime.openOptionsPage();
});

const width = 260;
const height = 500;
const left = (screen.width - width) / 2;
const top = (screen.height - height) / 2;

chrome.browserAction.onClicked.addListener(function() {
  chrome.windows.create({
    url: chrome.runtime.getURL("../popup.html"),
    type: "popup",
    width,
    height,
    left,
    top,
  });
});