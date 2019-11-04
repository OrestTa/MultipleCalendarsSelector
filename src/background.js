'use strict';

const googleCalendarUrl = "https://calendar.google.com/";

chrome.runtime.onInstalled.addListener(function() {
  // chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id + '/welcome.html' });
  chrome.tabs.create({ url: googleCalendarUrl });
});
