console.log("Installing Google Calendar Presets...");

const myCalendarsLabel = chrome.i18n.getMessage("myCalendarsLabel") // TODO: Put in options for user-implemented i18n
const otherCalendarsLabel = chrome.i18n.getMessage("otherCalendarsLabel") ; // TODO: Put in options for user-implemented i18n

var allCalendars;

var tracker;

function initExtension() {
    tracker = getAnalyticsTracker();
    tracker.sendAppView('MainView');
    tracker.sendEvent('Main', 'Init done', '');
    // Restore saved presets, then check for further (new) calendars
    getPresetsFromStorage(function(presets) {
        initCalendars(presets);
    }, function(err) {
        initCalendars(undefined);
    });
}

function initCalendars(presets) {
    const myCalendarsDiv = jQuery( "[aria-label='" + myCalendarsLabel + "']" )
    const otherCalendarsDiv = jQuery( "[aria-label='" + otherCalendarsLabel + "']" )

    const myCalendarsFromDiv = findCalendarsInDiv(myCalendarsDiv);
    const otherCalendarsFromDiv = findCalendarsInDiv(otherCalendarsDiv);

    allCalendars = [... myCalendarsFromDiv, ... otherCalendarsFromDiv];
    const allCalendarsNames = namesFromCalendarJQObjects(allCalendars);
    console.log("Found calendars: " + allCalendarsNames);

    chrome.storage.sync.set({[storageIdForAllCalendars]: allCalendarsNames}, null)

    if (typeof(presets)==="undefined" || Object.keys(presets).length == 0) {
        console.log("No presets found, initialising with defaults");
        var presets = {};
        presets[generateId()] = {
            name: "Preset 1",
            calendars: namesFromCalendarJQObjects(myCalendarsFromDiv)
        };
        presets[generateId()] = {
            name: "Preset 2",
            calendars: namesFromCalendarJQObjects(otherCalendarsFromDiv)
        };
        storePresets(presets);
    }

    console.log("Initialised Google Calendar Presets with " + allCalendars.length + " calendars");
    return allCalendars;
}

function findCalendarsInDiv(div) {
    // TODO: doesn't take long (lazy) lists into consideration; manual scrolling down needed first — automate this
    var foundCalendars = [];
    div.find("span:not([class])").each(function(index) {
        foundCalendars.push(jQuery(this).parent().parent());
    });

    return foundCalendars;
}

function getState(calendar) {
    const calendarState = calendar.children().first().children().first().children().first().attr('aria-checked');
    return calendarState;
}

function setState(calendar, state) {
    const calendarState = getState(calendar);
    if (calendarState!==state) {
        calendar.click();
    };
}

function setStateOnCalendars(calendars, state) {
    calendars.forEach(function(calendar) {
        setState(calendar, state);
    });
}

function focusCalendars(presetId) {
    tracker.sendEvent('Main', 'Focusing done', '');
    getPresetsFromStorage(function(presets) {
        const calendarJQObjects = calendarJQObjectsFromNames(presets[presetId], allCalendars)
        const calendarsToHide = [...allCalendars].filter(x => !calendarJQObjects.has(x));
        setStateOnCalendars(calendarsToHide, "false");
        setStateOnCalendars(calendarJQObjects, "true");
    }, function(err) {
        console.log("Couldn't focus calendars: " + err);
    })
}

function hideAllCalendars() {
    tracker.sendEvent('Main', 'Hiding done', '');
    setStateOnCalendars(allCalendars, "false");
}

function showAllCalendars() {
    tracker.sendEvent('Main', 'Showing all done', '');
    setStateOnCalendars(allCalendars, "true");
}

jQuery(document).ready(function() {
    initExtension();
});
