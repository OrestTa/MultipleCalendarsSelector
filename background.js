'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({ 'url': 'chrome-extension://' + chrome.runtime.id + '/welcome.html' });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'calendar.google.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  
});
