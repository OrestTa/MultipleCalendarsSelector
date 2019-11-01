'use strict';

let presetTable = document.getElementById('presetTable');
let presetFormSubmitButton = document.getElementById('presetFormSubmitButton');

var tracker;

function constructOptions(calendars) {
  for (let calendar of [...calendars]) {
    let tr = document.createElement('tr');

    let td1 = document.createElement('td');
    let inputPreset1 = document.createElement('input');
    tr.appendChild(td1);

    let td2 = document.createElement('td');
    let inputPreset2 = document.createElement('input');
    tr.appendChild(td2);

    let tdName = document.createElement('td');
    let spanName = document.createElement('span');
    tr.appendChild(tdName);

    inputPreset1.type = "checkbox";
    inputPreset1.setAttribute('preset', preset1Id);
    inputPreset1.setAttribute('calendar', calendar);
    td1.appendChild(inputPreset1);

    inputPreset2.type = "checkbox";
    inputPreset2.setAttribute('preset', preset2Id);
    inputPreset2.setAttribute('calendar', calendar);
    td2.appendChild(inputPreset2);

    spanName.textContent = calendar;
    tdName.appendChild(spanName);

    presetTable.appendChild(tr);
  }

  presetFormSubmitButton.addEventListener('click', function() {
    storePresets(formToPresets());
  });
}

function formToPresets() {
  var presets = {};

  const inputs = jQuery("#presetForm :input[type='checkbox']");

  inputs.each(function() {
    const preset = jQuery(this).attr('preset');
    const calendar = jQuery(this).attr('calendar');
    const checked = jQuery(this).is(':checked');
    if (checked) {
      if (typeof(presets[preset]) === "undefined") {
        presets[preset] = new Set();
      }
      presets[preset].add(calendar);
    }
  });
  
  return presets;
}

function restorePresetsOntoForm() {
  getAndDeserialisePresetsFromStorage(function(presets) {
    const inputs = jQuery("#presetForm :input[type='checkbox']");
    inputs.each(function() {
      const currentInput = jQuery(this);
      const calendar = currentInput.attr('calendar');
      const presetIds = Object.keys(presets);
      presetIds.forEach(function(presetId) {
        if (presets[presetId] && (presets[presetId]).has(calendar)) {
          if (currentInput.attr('preset') === presetId) {
            currentInput.attr("checked", true);
          };
        };
      });
    });
  }, function(err) {
    console.log("Couldn't restore presets onto form: " + err);
  });
}

function initAnalyticsConfig(config) {
  document.getElementById('settings-loading').hidden = true;
  document.getElementById('settings-loaded').hidden = false;

  var checkbox = document.getElementById('tracking-permitted');
  checkbox.checked = config.isTrackingPermitted();
  checkbox.onchange = function() {
    config.setTrackingPermitted(checkbox.checked);
  };
}

function init() {
  chrome.storage.sync.get(storageIdForAllCalendars, function(data) {
    var allCalendars = data[storageIdForAllCalendars];
    if (typeof(allCalendars)==="undefined") {
      allCalendars = new Set();
    }
    constructOptions(allCalendars);
    restorePresetsOntoForm();
    getAnalyticsService().getConfig().addCallback(initAnalyticsConfig);
    tracker = getAnalyticsTracker();
    tracker.sendAppView('OptionsView');
    tracker.sendEvent('Options', 'Init done', '');
  });
}

init();
