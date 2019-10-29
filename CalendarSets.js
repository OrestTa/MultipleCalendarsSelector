
javascript:(function(e,s){e.src=s;e.onload=function(){jQuery.noConflict();console.log('jQuery injected')};document.head.appendChild(e);})(document.createElement('script'),'//code.jquery.com/jquery-latest.min.js');

var allCalendarNames = new Set();

var calendarNames1 = new Set(
    "Private",
    "Birthdays",
);

var calendarNames2 = new Set(
    "Holidays in Poland",
);

const myCalendarsLabel = "My calendars";
const otherCalendarsLabel = "Other calendars";

function findAndSetDefaultCalendarNames() { // caveat: doesn't take long (lazy) lists into consideration before manual scrolling
    const myCalendarsDiv = jQuery( "[aria-label='" + myCalendarsLabel + "']" )
    const otherCalendarsDiv = jQuery( "[aria-label='" + otherCalendarsLabel + "']" )

    calendarNames1 = findCalendarNamesInDiv(myCalendarsDiv);
    calendarNames2 = findCalendarNamesInDiv(otherCalendarsDiv);

    calendarNames1.forEach(item => allCalendarNames.add(item));
    calendarNames2.forEach(item => allCalendarNames.add(item));

    return allCalendarNames;
}

function findCalendarNamesInDiv(div) {
    var foundCalendarNames = new Set();

    div.find("span:not([class])").each(function(index) {
        foundCalendarNames.add(jQuery(this).text());
    });

    return foundCalendarNames;
}

function getState(calendarName) {
    const calendarSpan = jQuery('span:contains("'+calendarName+'")').first();
    const calendarState = calendarSpan.parent().parent().children().first().children().first().children().first().attr('aria-checked');
    return calendarState;
}

function setState(calendarName, state) {
    const calendarSpan = jQuery('span:contains("'+calendarName+'")').first();
    const calendarState = getState(calendarName);
    if (calendarState!==state) {
        calendarSpan.click();
    };
}

function setStateOnCalendars(calendarNames, state) {
    calendarNames.forEach(function(calendarName) {
        setState(calendarName, state);
    });
}

function focusCalendarNames(calendarNames) {
    const calendarNamesToBeDeselected = new Set([...allCalendarNames].filter(x => !calendarNames.has(x)));
    setStateOnCalendars(calendarNamesToBeDeselected, "false");
    setStateOnCalendars(calendarNames, "true");
}

// testing
// findAndSetDefaultCalendarNames();
// focusCalendarNames(calendarNames1);
// focusCalendarNames(calendarNames2);
// focusCalendarNames(allCalendarNames);
