
javascript:(function(e,s){e.src=s;e.onload=function(){jQuery.noConflict();console.log('jQuery injected, initialising...');initCalendars()};document.head.appendChild(e);})(document.createElement('script'),'//code.jquery.com/jquery-latest.min.js');

var allCalendars = new Set();
var calendarsSet1 = new Set();
var calendarsSet2 = new Set();

const myCalendarsLabel = "My calendars";
const otherCalendarsLabel = "Other calendars";

function initCalendars() { // TODO: doesn't take long (lazy) lists into consideration before manual scrolling, automate this
    const myCalendarsDiv = jQuery( "[aria-label='" + myCalendarsLabel + "']" )
    const otherCalendarsDiv = jQuery( "[aria-label='" + otherCalendarsLabel + "']" )

    calendarsSet1 = findCalendarsInDiv(myCalendarsDiv);
    calendarsSet2 = findCalendarsInDiv(otherCalendarsDiv);
    calendarsSet1.forEach(item => allCalendars.add(item));
    calendarsSet2.forEach(item => allCalendars.add(item));

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

// testing
// focusCalendars(calendarsSet1);
// focusCalendars(calendarsSet2);
// focusCalendars(allCalendars);
