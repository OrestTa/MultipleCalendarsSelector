console.log("Installing Google Calendar Presets...");

const myCalendarsLabel = "My calendars"; // TODO: Put in options for user-implemented i18n
const otherCalendarsLabel = "Other calendars"; // TODO: Put in options for user-implemented i18n

var allCalendars;

function initExtension() {
    initAnalytics();
    tracker.sendAppView('MainView');
    tracker.sendEvent('Main', 'Init done', '');
    // Restore saved presets, then check for further (new) calendars
    getAndDeserialisePresetsFromStorage(function(presets) {
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

    allCalendars = new Set([... myCalendarsFromDiv, ... otherCalendarsFromDiv]);
    const allCalendarsNames = namesFromCalendarJQObjects(allCalendars);
    console.log("Found calendars: " + allCalendarsNames);

    chrome.storage.sync.set({[storageIdForAllCalendars]: allCalendarsNames}, null)

    if (typeof(presets)==="undefined" || Object.keys(presets).length == 0) {
        console.log("No presets found, initialising with defaults");
        var presets = {};
        presets[preset1Id] = namesFromCalendarJQObjects(myCalendarsFromDiv);
        presets[preset2Id] = namesFromCalendarJQObjects(otherCalendarsFromDiv);
        storePresets(presets);
    }

    console.log("Initialised Google Calendar Presets with " + allCalendars.size + " calendars");
    return allCalendars;
}

function findCalendarsInDiv(div) {
    // TODO: doesn't take long (lazy) lists into consideration; manual scrolling down needed first — automate this
    var foundCalendars = new Set();
    div.find("span:not([class])").each(function(index) {
        foundCalendars.add(jQuery(this).parent().parent());
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
    getAndDeserialisePresetsFromStorage(function(presets) {
        const calendarJQObjects = calendarJQObjectsFromNames(presets[presetId], allCalendars)
        const calendarsToHide = new Set([...allCalendars].filter(x => !calendarJQObjects.has(x)));
        setStateOnCalendars(calendarsToHide, "false");
        setStateOnCalendars(calendarJQObjects, "true");
    }, function(err) {
        console.log("Couldn't focus calendars: " + err);
    })
}

function hideAllCalendars() {
    setStateOnCalendars(allCalendars, "false");
}

function showAllCalendars() {
    setStateOnCalendars(allCalendars, "true");
}

jQuery(document).ready(function() {
    initExtension();
});
