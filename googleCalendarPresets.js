console.log("Installing Google Calendar Presets...");

const myCalendarsLabel = "My calendars"; // TODO
const otherCalendarsLabel = "Other calendars"; // TODO
const calendarNameStringsToStrip = ['Loading...', //g, //g]; // TODO

const preset1Id = '1'; // TODO
const preset2Id = '2'; // TODO

var presets = {};
var allCalendars;

function initCalendars() {
    // Restore saved presets, then check for further (new) calendars
    allCalendars = new Set();
    calendarsPreset1 = new Set();
    calendarsPreset2 = new Set();

    getAndDeserialisePresetsFromStorage(function(presetsFromStorage) {
        presets = presetsFromStorage;

        const myCalendarsDiv = jQuery( "[aria-label='" + myCalendarsLabel + "']" )
        const otherCalendarsDiv = jQuery( "[aria-label='" + otherCalendarsLabel + "']" )

        const myCalendarsFromDiv = findCalendarsInDiv(myCalendarsDiv);
        const otherCalendarsFromDiv = findCalendarsInDiv(otherCalendarsDiv);

        allCalendars = new Set([... myCalendarsFromDiv, ... otherCalendarsFromDiv]);
        const allCalendarsSerialised = [...allCalendars].reverse().map(calendar => { // TODO: Add explicit ordering
            var calendarName = calendar.text();
            for (i = 0; i < calendarNameStringsToStrip.length; i++) {
                calendarName = calendarName.replace(calendarNameStringsToStrip[i], '');
            }
            return calendarName;
        });
        console.log("Found calendars: " + allCalendarsSerialised);

        chrome.storage.sync.set({[storageIdForAllCalendars]: allCalendarsSerialised}, null)

        if (Object.keys(presets).length == 0) {
            // No presets found, initialising with defaults
            presets[preset1Id] = myCalendarsFromDiv;
            presets[preset2Id] = otherCalendarsFromDiv;
            storePresets(presets);
        }

        console.log("Initialised Google Calendar Presets with " + allCalendars.size + " calendars");
        return allCalendars;
    });
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

function getCalendarJQObjectsFromNames(calendarNames) {
    return new Set([...allCalendars].filter(calendar => new RegExp([...calendarNames].join('|')).test(calendar.text())));
}

function focusCalendars(presetId) {
    const calendarJQObjects = getCalendarJQObjectsFromNames(presets[presetId])
    const calendarsToHide = new Set([...allCalendars].filter(x => !calendarJQObjects.has(x)));
    setStateOnCalendars(calendarsToHide, "false");
    setStateOnCalendars(calendarJQObjects, "true");
}

function hideAllCalendars() {
    setStateOnCalendars(allCalendars, "false");
}

function showAllCalendars() {
    setStateOnCalendars(allCalendars, "true");
}

jQuery(document).ready(function() {
    initCalendars()    
});
