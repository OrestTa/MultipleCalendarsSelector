// Google Calendar Presets: Utils

// General

const googleCalendarUrl = "https://calendar.google.com/";

function generateId() {
    const length = 32;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

// Storage

const storageIdForPresets = 'presets';
const storageIdForAllCalendars = 'allCalendars';

function storePresets(presets, callback) {
    chrome.storage.sync.set({[storageIdForPresets]: presets}, callback)
}

function getPresetsFromStorage(callbackSuccess, callbackFailure) {
    chrome.storage.sync.get(storageIdForPresets, function(data) {
      const presets = data[storageIdForPresets];
      if (typeof(presets)==="undefined") {
          return callbackFailure("No presets found in local storage");
      }
      return callbackSuccess(presets);
    });
}

// Object helpers

const calendarNameStringsToStrip = ['Loading...', //g, //g]; // TODO: Put in options for user-implemented i18n

function namesFromCalendarJQObjects(calendarJQObjects) {
    return [...calendarJQObjects].map(calendarJQObject => {
        var calendarName = calendarJQObject.text();
        for (i = 0; i < calendarNameStringsToStrip.length; i++) {
            calendarName = calendarName.replace(calendarNameStringsToStrip[i], '');
        }
        return calendarName;
    });
}

function calendarJQObjectsFromNames(calendarNames, allCalendars) {
    return [...allCalendars].filter(calendar => new RegExp([...calendarNames].join('|')).test(calendar.text()));
}

// Analytics

function getAnalyticsService() {
    return analytics.getService('googleCalendarPresetsExtension');
}

function getAnalyticsTracker() {
    return getAnalyticsService().getTracker('UA-151273087-1');
}
