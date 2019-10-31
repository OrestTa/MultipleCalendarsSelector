'use strict';

let initCalendarsButtonButton = document.getElementById('initCalendars');
let preset1Button = document.getElementById('preset1');
let preset2Button = document.getElementById('preset2');
let presetAllButton = document.getElementById('presetAll');
let presetNoneButton = document.getElementById('presetNone');
let openOptionsButton = document.getElementById('openOptions');

initCalendarsButtonButton.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'initCalendars()'});
  });
};

preset1Button.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'focusCalendars("1")'});
  });
};

preset2Button.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'focusCalendars("2")'});
  });
};

presetAllButton.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'showAllCalendars()'});
  });
};

presetNoneButton.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'hideAllCalendars()'});
  });
};

openOptionsButton.onclick = function(element) {
  chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
}
