console.log("Installing Google Calendar Presets...");

var allCalendars;
var calendarsSet1;
var calendarsSet2;

const myCalendarsLabel = "My calendars";
const otherCalendarsLabel = "Other calendars";

function initCalendars() { // TODO: doesn't take long (lazy) lists into consideration before manual scrolling, automate this
    allCalendars = new Set();
    calendarsSet1 = new Set();
    calendarsSet2 = new Set();

    const myCalendarsDiv = jQuery( "[aria-label='" + myCalendarsLabel + "']" )
    const otherCalendarsDiv = jQuery( "[aria-label='" + otherCalendarsLabel + "']" )

    calendarsSet1 = findCalendarsInDiv(myCalendarsDiv);
    calendarsSet2 = findCalendarsInDiv(otherCalendarsDiv);
    calendarsSet1.forEach(item => allCalendars.add(item));
    calendarsSet2.forEach(item => allCalendars.add(item));
    
    console.log("Initialised Google Calendar Presets with " + allCalendars.size + " calendars");

    return allCalendars;
}

function findCalendarsInDiv(div) {
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

function focusCalendars(calendars) {
    const calendarsToHide = new Set([...allCalendars].filter(x => !calendars.has(x)));
    setStateOnCalendars(calendarsToHide, "false");
    setStateOnCalendars(calendars, "true");
}

$( document ).ready(function() {
    initCalendars()    
});
