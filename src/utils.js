// MultipleCalendarsSelector: Utils


// General

const googleCalendarUrl = "https://calendar.google.com/";

function isDevMode() {
    return !('update_url' in chrome.runtime.getManifest());
}

function generateId() {
    const length = 32;
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 String.prototype.hashCode = function() {
    let hash = 0, i, chr;
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
const storageIdForDrawerDelay = 'drawerDelay';

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

function storeDrawerDelay(drawerDelay, callback) {
    chrome.storage.sync.set({[storageIdForDrawerDelay]: drawerDelay}, callback);
  }
  
function getDrawerDelayFromStorage(callback) {
    chrome.storage.sync.get(storageIdForDrawerDelay, function(data) {
        let drawerDelay = data[storageIdForDrawerDelay];
        if (typeof(drawerDelay)==="undefined") {
            drawerDelay = 300; // default delay, in ms
            storeDrawerDelay(drawerDelay);
        }
        callback(drawerDelay);
    });
}

async function getDrawerDelayFromStorageAsync() {
    let promise = await new Promise((resolve) => {
        getDrawerDelayFromStorage(drawerDelay => {
            resolve(drawerDelay);
        })
    })
    .catch(err => {throw err});

    return promise;
}


// Object helpers

const calendarNameStringsToStrip = ['Loading...', //g, //g];

function namesFromCalendarJQObjects(calendarJQObjects) {
    return [...calendarJQObjects].map(calendarJQObject => {
        let calendarName = calendarJQObject.text();
        for (i = 0; i < calendarNameStringsToStrip.length; i++) {
            calendarName = calendarName.replace(calendarNameStringsToStrip[i], '');
        }
        return calendarName;
    });
}

function calendarJQObjectsFromNames(calendarNames, allCalendarObjects) {
    return [...allCalendarObjects].filter(calendarJQObject => {
        let calendarName = calendarJQObject.text();
        for (i = 0; i < calendarNameStringsToStrip.length; i++) {
            calendarName = calendarName.replace(calendarNameStringsToStrip[i], '');
        }
        return calendarNames.includes(calendarName);
    })
}


// Analytics

function getAnalyticsService() {
    return analytics.getService('multipleCalendarsSelectorExtension');
}

function getAnalyticsTracker() {
    let tracker;
    if (isDevMode()) {
        tracker = getAnalyticsService().getTracker('DEBUG_DUMMY_TRACKER');
    } else {
        tracker = getAnalyticsService().getTracker('UA-151273087-1');
    }
    return tracker;
}
