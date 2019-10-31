console.log("Installing Google Calendar Presets...");

const myCalendarsLabel = "My calendars"; // TODO
const otherCalendarsLabel = "Other calendars"; // TODO

const preset1Id = '1'; // TODO
const preset2Id = '2'; // TODO

var presets= {};
var allCalendars;

function initCalendars() {
    // Restore saved presets, then check for further (new) calendars
    allCalendars = new Set();
    calendarsPreset1 = new Set();
    calendarsPreset2 = new Set();

    getAndDeserialisePresetsFromStorage(function(presetsFromStorage) {
        const myCalendarsFromDiv = findCalendarsInDiv(myCalendarsDiv);
        const otherCalendarsFromDiv = findCalendarsInDiv(otherCalendarsDiv);

        const presetIds = Object.keys(presetsFromStorage);
        presetIds.forEach(function(presetId) {
            console.log(presetsFromStorage [presetId]);
        })
    });

    const myCalendarsDiv = jQuery( "[aria-label='" + myCalendarsLabel + "']" )
    const otherCalendarsDiv = jQuery( "[aria-label='" + otherCalendarsLabel + "']" )

    presets[preset1Id] = findCalendarsInDiv(myCalendarsDiv);
    presets[preset2Id] = findCalendarsInDiv(otherCalendarsDiv);
    presets[preset1Id].forEach(item => allCalendars.add(item));
    presets[preset2Id].forEach(item => allCalendars.add(item));
    
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
    const calendarsToHide = new Set([...allCalendars].filter(x => !presets[presetId].has(x)));
    setStateOnCalendars(calendarsToHide, "false");
    setStateOnCalendars(presets[presetId], "true");
}

jQuery(document).ready(function() {
    initCalendars()    
});
