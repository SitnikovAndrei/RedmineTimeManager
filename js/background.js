chrome.runtime.onInstalled.addListener(function() {
    chrome.runtime.openOptionsPage();
});

let width = 260;
let height = 500;
let wd = screen.width/2 - width/2;
let tp = screen.height/2 - height/2;

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.windows.create({
    url: chrome.runtime.getURL("../popup.html"),
    type: "popup",
    width: width,
    height: height,
    left:  wd,
    top: tp
  });
});