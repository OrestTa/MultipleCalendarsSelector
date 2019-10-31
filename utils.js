// Google Calendar Presets: Utils

// Storage

const storageIdForPresets = 'presets';
const storageIdForAllCalendars = 'allCalendars';

function storePresets(presets) {
    chrome.storage.sync.set({[storageIdForPresets]: serialisePresetsForStorage(presets)}, null)
}

function serialisePresetsForStorage(presets) {
    var serialisedPresets = {};
    const presetIds = Object.keys(presets);
    presetIds.forEach(function (presetId) {
        serialisedPresets[presetId] = [...presets[presetId]];
    });
    return serialisedPresets;
}

function getAndDeserialisePresetsFromStorage(callbackSuccess, callbackFailure) {
    chrome.storage.sync.get(storageIdForPresets, function(data) {
      const presetsFromStorage = data[storageIdForPresets];
      if (typeof(presetsFromStorage)==="undefined") {
          return callbackFailure("No presets found in local storage");
      }
      var presets = {};
      const presetIds = Object.keys(presetsFromStorage);
      presetIds.forEach(function(presetId) {
        const calendars = new Set(presetsFromStorage[presetId]);
        presets[presetId] = calendars;
      })
      return callbackSuccess(presets);
    });
}

// Object helpers

const calendarNameStringsToStrip = ['Loading...', //g, //g]; // TODO

function namesFromCalendarJQObjects(calendarJQObjects) {
    return [...calendarJQObjects].reverse().map(calendarJQObject => { // TODO: Add explicit ordering
        var calendarName = calendarJQObject.text();
        for (i = 0; i < calendarNameStringsToStrip.length; i++) {
            calendarName = calendarName.replace(calendarNameStringsToStrip[i], '');
        }
        return calendarName;
    });
}

function calendarJQObjectsFromNames(calendarNames, allCalendars) {
    return new Set([...allCalendars].filter(calendar => new RegExp([...calendarNames].join('|')).test(calendar.text())));
}
