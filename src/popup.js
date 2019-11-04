'use strict';

// Open Google Calendar if not currenty the case; only display the actual popup otherwise
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  if (tabs[0].url && !tabs[0].url.includes(googleCalendarUrl)) {
    chrome.tabs.create({url: googleCalendarUrl});
  }
});

const presetSpan = document.getElementById('presetSpan');

getPresetsFromStorage(function(presets) {
  const presetIds = Object.keys(presets);
  presetIds.forEach(function(presetId) {
    let presetFocusButton = document.createElement('button');
    presetSpan.appendChild(presetFocusButton);
    presetFocusButton.innerText = presets[presetId].name;
    presetFocusButton.className = "popup";
    presetFocusButton.onclick = function(element) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'focusCalendars("' + presetId + '")'});
      });
    };
  });
}, function(err) {
  console.log("Couldn't load presets from storage for popup: " + err);
});

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
  chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id + '/src/options.html' });
}

initCalendarsButtonButton.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'initExtension()'});
  });
};
