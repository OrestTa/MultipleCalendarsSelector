'use strict';

let presetTable = document.getElementById('presetTable');
let addNewPresetButton = document.getElementById('addNewPreset');

let tracker;

function addNewPreset() {
  tracker.sendEvent('Options', 'Button tapped', 'addNewPreset');
  persistPresets();
  getPresetsFromStorage(function(presets) {
    const newPresetId = generateId();
    const newPreset = {
        name: "New Preset",
        calendars: [],
        orderValue: 999,
    };
    presets[newPresetId] = newPreset;
    storePresets(presets, () => {
      window.location.reload()
    });
  }, function(err) {
    const errorMessage = "Couldn't load presets for adding a new one: " + err;
    tracker.sendEvent('Options', 'Error', errorMessage);
    console.log(errorMessage);
  });
}

function removePreset(presetId) {
  tracker.sendEvent('Options', 'Button tapped', 'removePreset');
  const debugMessage = "Deleting preset with ID " + presetId;
  console.log(debugMessage);
  jQuery('.' + presetId).remove();
  persistPresets();
}

function constructOptions(presets, calendars) {
  let trHeader = document.createElement('tr');
  const presetIds = Object.keys(presets);
  presetIds.sort((a, b) => {
    return presets[a].orderValue - presets[b].orderValue;
  });

  presetIds.forEach(function(presetId) {
    let th = document.createElement('th');
    th.className = presetId;
    trHeader.appendChild(th);
    let presetNameInput = document.createElement('input');
    presetNameInput.type = "text";
    presetNameInput.setAttribute("presetId", presetId);
    presetNameInput.value = presets[presetId].name;
    presetNameInput.onchange = persistPresets;
    let removeButton = document.createElement('button');
    let removeIcon = document.createElement('img');
    removeIcon.classList = "removeIcon";
    removeIcon.src = "../images/remove.png";
    removeButton.appendChild(removeIcon);
    removeButton.className = "removeButton";
    removeButton.type = "button";
    removeButton.onclick = () => { if (window.confirm("Are you sure you want to remove this preset?")) removePreset(presetId); };
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
      input.onchange = persistPresets;
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
}

function persistPresets() {
  tracker.sendEvent('Options', 'Presets persisted');
  storePresets(formToPresets());
}

function formToPresets() {
  let presets = {};
  
  const presetNames = jQuery("#presetForm :input[type='text']");
  const checkboxes = jQuery("#presetForm :input[type='checkbox']");
  let orderValue = 0;

  presetNames.each(function() {
    presets[jQuery(this).attr('presetId')] = {
      "name": jQuery(this).val(),
      "calendars": [],
      "orderValue": orderValue,
    };
    orderValue++;
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

  let checkbox = document.getElementById('tracking-permitted');
  checkbox.checked = config.isTrackingPermitted();
  checkbox.onchange = function() {
    if (checkbox.checked) {
      config.setTrackingPermitted(checkbox.checked);
      tracker.sendEvent('Options', 'Button tapped', 'analyticsEnable');
    } else {
      tracker.sendEvent('Options', 'Button tapped', 'analyticsDisable');
      config.setTrackingPermitted(checkbox.checked);
    }
  };
}

function init() {
  tracker = getAnalyticsTracker();
  addNewPresetButton.onclick = addNewPreset;
  getPresetsFromStorage(function(presets) {
    chrome.storage.sync.get(storageIdForAllCalendars, function(data) {
      let allCalendars = data[storageIdForAllCalendars];
      if (typeof(allCalendars)==="undefined") {
        allCalendars = [];
      }
      constructOptions(presets, allCalendars);
      restorePresetsOntoForm(presets);
      getAnalyticsService().getConfig().addCallback(initAnalyticsConfig);
      tracker.sendAppView('OptionsView');
      tracker.sendEvent('Options', 'Init done', '');
    });
  }, function(err) {
    const errorMessage = "Couldn't load presets for options: " + err;
    tracker.sendEvent('Options', 'Error', errorMessage);
    console.log(errorMessage);
  });
}

init();
