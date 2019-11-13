'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({ url: googleCalendarUrl });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostContains: ''},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

var tracker = getAnalyticsTracker();
tracker.sendAppView('BackgroundView');
tracker.sendEvent('Background', 'Extension version', '1.5');
