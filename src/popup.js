'use strict';

var tracker;

tracker = getAnalyticsTracker();
tracker.sendAppView('PopupView');
tracker.sendEvent('Popup', 'Icon tapped', '');

// Open Google Calendar if not currenty the case; only display the actual popup otherwise
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  if (tabs[0].url && !tabs[0].url.includes(googleCalendarUrl)) {
    tracker.sendEvent('Popup', 'Created calendar tab', '');
    chrome.tabs.create({url: googleCalendarUrl});
    return;
  }
});

// // Refresh extension
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.executeScript(
//       tabs[0].id,
//       {code: 'refreshExtension()'});
// });

// // Refresh calendars
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.executeScript(
//       tabs[0].id,
//       {code: 'refreshAllCalendarsField()'});
// });

// // Shrink drawer
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.executeScript(
//       tabs[0].id,
//       {code: 'shrinkDrawerHeight()'});
// });

const presetSpan = document.getElementById('presetSpan');

getPresetsFromStorage(function(presets) {
  var presetIds = Object.keys(presets);
  presetIds.sort((a, b) => {
    return presets[a].orderValue - presets[b].orderValue;
  });
  presetIds.forEach(function(presetId) {
    let presetFocusButton = document.createElement('button');
    presetSpan.appendChild(presetFocusButton);
    presetFocusButton.innerText = presets[presetId].name;
    presetFocusButton.className = "popup";
    presetFocusButton.onclick = function(element) {
      tracker.sendEvent('Popup', 'Button tapped', 'focusCalendars');
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'focusCalendars("' + presetId + '")'});
      });
    };
  });
}, function(err) {
  const errorMessage = "Couldn't load presets from storage for popup: " + err;
  tracker.sendEvent('Popup', 'Error', errorMessage);
  console.log(errorMessage);
});

let presetAllButton = document.getElementById('presetAll');
presetAllButton.innerText=chrome.i18n.getMessage("displayAllCalendars");
let presetNoneButton = document.getElementById('presetNone');
presetNoneButton.innerText=chrome.i18n.getMessage("hideAllCalendars");
let openOptionsButton = document.getElementById('openOptions');
openOptionsButton.innerText=chrome.i18n.getMessage("extensionOptions");

presetAllButton.onclick = function(element) {
  tracker.sendEvent('Popup', 'Button tapped', 'showAllCalendars');
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'showAllCalendars()'});
  });
};

presetNoneButton.onclick = function(element) {
  tracker.sendEvent('Popup', 'Button tapped', 'hideAllCalendars');
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'hideAllCalendars()'});
  });
};

openOptionsButton.onclick = function(element) {
  tracker.sendEvent('Popup', 'Button tapped', 'showOptions');
  chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id + '/src/options.html' });
}
