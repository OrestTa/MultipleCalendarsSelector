'use strict';

let presetTable = document.getElementById('presetTable');
let presetFormSubmitButton = document.getElementById('presetFormSubmitButton');
let addNewPresetButton = document.getElementById('addNewPreset');

var tracker;

function addNewPreset() {
  getPresetsFromStorage(function(presets) {
    const newPresetId = generateId();
    const newPreset = {
        name: "New Preset",
        calendars: [],
    };
    presets[newPresetId] = newPreset;
    storePresets(presets, () => {
      window.location.reload()
    });
  }, function(err) {
    console.log("Couldn't load presets for adding a new one: " + err);
  });
}

addNewPresetButton.onclick = addNewPreset;

function removePreset(presetId) {
  console.log("Deleting preset with ID " + presetId);
  jQuery('.' + presetId).remove();
}

function constructOptions(presets, calendars) {
  let trHeader = document.createElement('tr');
  const presetIds = Object.keys(presets);
  
  presetIds.forEach(function(presetId) {
    let th = document.createElement('th');
    th.className = presetId;
    trHeader.appendChild(th);
    let presetNameInput = document.createElement('input');
    presetNameInput.type = "text";
    presetNameInput.setAttribute("presetId", presetId);
    presetNameInput.value = presets[presetId].name;
    let removeButton = document.createElement('button');
    let removeIcon = document.createElement('img');
    removeIcon.classList = "removeIcon";
    removeIcon.src = "../images/remove.png";
    removeButton.appendChild(removeIcon);
    removeButton.className = "removeButton";
    removeButton.type = "button";
    removeButton.onclick = () => { removePreset(presetId); };
    th.appendChild(presetNameInput);
    th.appendChild(removeButton);
  });
  let thCalendarNameHeader = document.createElement('th');
  thCalendarNameHeader.className = "calendarName"
  let spanCalendarNameHeader = document.createElement('span');
  spanCalendarNameHeader.textContent = "Calendar Name"; // TODO: i18n
  thCalendarNameHeader.appendChild(spanCalendarNameHeader);
  trHeader.appendChild(thCalendarNameHeader);
  presetTable.appendChild(trHeader);

  for (let calendar of [...calendars]) {
    let tr = document.createElement('tr');

    presetIds.forEach(function(presetId) {
      let td = document.createElement('td');
      td.className = presetId;
      let input = document.createElement('input');
      tr.appendChild(td);
      input.type = "checkbox";
      input.setAttribute('presetId', presetId);
      input.setAttribute('calendar', calendar);
      td.appendChild(input);
    });

    let tdName = document.createElement('td');
    tdName.className = "calendarName";
    let spanName = document.createElement('span');
    tr.appendChild(tdName);

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
  
  const presetNames = jQuery("#presetForm :input[type='text']");
  const checkboxes = jQuery("#presetForm :input[type='checkbox']");

  presetNames.each(function() {
    presets[jQuery(this).attr('presetId')] = {
      "name": jQuery(this).val(),
      "calendars": [],
    };
  });

  checkboxes.each(function() {
    const presetId = jQuery(this).attr('presetId');
    const calendar = jQuery(this).attr('calendar');
    const checked = jQuery(this).is(':checked');
    if (checked) {
      presets[presetId].calendars.push(calendar);
    }
  });
  
  return presets;
}

function restorePresetsOntoForm(presets) {
  const inputs = jQuery("#presetForm :input[type='checkbox']");
  inputs.each(function() {
    const currentInput = jQuery(this);
    const calendar = currentInput.attr('calendar');
    const presetIds = Object.keys(presets);
    presetIds.forEach(function(presetId) {
      if (presets[presetId] && presets[presetId].calendars.includes(calendar)) {
        if (currentInput.attr('presetId') === presetId) {
          currentInput.attr("checked", true);
        };
      };
    });
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
  getPresetsFromStorage(function(presets) {
    chrome.storage.sync.get(storageIdForAllCalendars, function(data) {
      var allCalendars = data[storageIdForAllCalendars];
      if (typeof(allCalendars)==="undefined") {
        allCalendars = [];
      }
      constructOptions(presets, allCalendars);
      restorePresetsOntoForm(presets);
      getAnalyticsService().getConfig().addCallback(initAnalyticsConfig);
      tracker = getAnalyticsTracker();
      tracker.sendAppView('OptionsView');
      tracker.sendEvent('Options', 'Init done', '');
    });
  }, function(err) {
    console.log("Couldn't load presets for options: " + err);
  });
}

init();
