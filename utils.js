// console.log("Installing Google Calendar Presets: Utils...");

const storageIdForPresets = 'presets';

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

function getAndDeserialisePresetsFromStorage(callback) {
    chrome.storage.sync.get(storageIdForPresets, function(data) {
      const presetsFromStorage = data[storageIdForPresets];
      var presets = {};
      const presetIds = Object.keys(presetsFromStorage);
      presetIds.forEach(function(presetId) {
        const calendars = new Set(presetsFromStorage[presetId]);
        presets[presetId] = calendars;
      })
      callback(presets);
    });
}
