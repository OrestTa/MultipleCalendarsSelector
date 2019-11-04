'use strict';

let preset1Button = document.getElementById('preset1');
preset1Button.innerText=chrome.i18n.getMessage("preset") + " 1";
let preset2Button = document.getElementById('preset2');
preset2Button.innerText=chrome.i18n.getMessage("preset") + " 2";
let presetAllButton = document.getElementById('presetAll');
presetAllButton.innerText=chrome.i18n.getMessage("displayAllCalendars");
let presetNoneButton = document.getElementById('presetNone');
presetNoneButton.innerText=chrome.i18n.getMessage("hideAllCalendars");
let openOptionsButton = document.getElementById('openOptions');
openOptionsButton.innerText=chrome.i18n.getMessage("extensionOptions");
let initCalendarsButtonButton = document.getElementById('initCalendars');
initCalendarsButtonButton.innerText=chrome.i18n.getMessage("refreshCalendars");

var tracker;

tracker = getAnalyticsTracker();
tracker.sendAppView('PopupView');
tracker.sendEvent('Popup', 'Render done', '');

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  if (tabs[0].url && !tabs[0].url.includes(googleCalendarUrl)) {
    chrome.tabs.create({url: googleCalendarUrl});
  }
});

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
  chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id + '/options.html' });
}

initCalendarsButtonButton.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'initCalendars()'});
  });
};
