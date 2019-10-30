'use strict';

let initCalendarsButtonButton = document.getElementById('initCalendars');
let preset1Button = document.getElementById('preset1');
let preset2Button = document.getElementById('preset2');
let presetAllButton = document.getElementById('presetAll');
let presetNoneButton = document.getElementById('presetNone');

// chrome.storage.sync.get('calendarsSet1', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//   let color = element.target.value;
// };

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
        {code: 'focusCalendars(calendarsPreset1)'});
  });
};

preset2Button.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'focusCalendars(calendarsPreset2)'});
  });
};

presetAllButton.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'focusCalendars(allCalendars)'});
  });
};

presetNoneButton.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'focusCalendars(new Set())'});
  });
};