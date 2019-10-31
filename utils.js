// console.log("Installing Google Calendar Presets: Utils...");

const storageIdForPresets = 'presets';

function storePresets(presets) {
    chrome.storage.sync.set({[storageIdForPresets]: serialisePresetsForStorage(presets)}, null)
}

function serialisePresetsForStorage(presets) {
    var serialisedPresets = [];
    presets.forEach(function (preset) {
        serialisedPresets.push([...preset]);
    });
    return serialisedPresets;
}

function deserialisePresetsFromStorage(callback) {
    chrome.storage.sync.get(storageIdForPresets, function(data) {
      const presetsFromStorage = data[storageIdForPresets];
      var presets = new Set();
      presetsFromStorage.forEach(function(preset) {
        const calendars = new Set(preset);
        presets.add(calendars);
      })
      callback(presets);
    });
}
  