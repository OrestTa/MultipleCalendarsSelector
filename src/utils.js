// MultipleCalendarsSelector: Utils


// General

const googleCalendarUrl = "https://calendar.google.com/";

function isDevMode() {
    return !('update_url' in chrome.runtime.getManifest());
}

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

 String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

function sleep(ms){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    })
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
    return analytics.getService('multipleCalendarsSelectorExtension');
}

function getAnalyticsTracker() {
    var tracker;
    if (isDevMode()) {
        tracker = getAnalyticsService().getTracker('DEBUG_DUMMY_TRACKER');
    } else {
        tracker = getAnalyticsService().getTracker('UA-151273087-1');
    }
    return tracker;
}
