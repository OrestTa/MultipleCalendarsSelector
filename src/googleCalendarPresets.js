console.log("Starting Google Calendar Presets...");

const myCalendarsLabel = chrome.i18n.getMessage("myCalendarsLabel") // TODO: Put in options for user-implemented i18n
const otherCalendarsLabel = chrome.i18n.getMessage("otherCalendarsLabel") ; // TODO: Put in options for user-implemented i18n

var allCalendars;

var tracker;

function refreshExtension() {
    // Restore saved presets, then check for further (new) calendars
    getPresetsFromStorage(function(presets) {
        refreshCalendars(presets);
    }, function(err) {
        refreshCalendars(undefined);
    });
}

async function refreshCalendars(presets) {
    const myCalendarsDiv = jQuery("[aria-label='" + myCalendarsLabel + "']")
    const otherCalendarsDiv = jQuery("[aria-label='" + otherCalendarsLabel + "']")
    const { myCalendarsFromDiv, otherCalendarsFromDiv } = await shrinkDrawerHeightAndFindCalendars([myCalendarsDiv, otherCalendarsDiv]);

    allCalendars = [... myCalendarsFromDiv, ... otherCalendarsFromDiv];
    const allCalendarsNames = namesFromCalendarJQObjects(allCalendars);

    var debugMessage = "Discovered calendars' hash: " + String(allCalendarsNames).hashCode();
    tracker.sendEvent('Main', 'Debug', debugMessage);
    tracker.sendEvent('Main', 'Discovered number of calendars', allCalendars.length);
    console.log(debugMessage);

    chrome.storage.sync.set({[storageIdForAllCalendars]: allCalendarsNames}, null)

    if (typeof(presets)==="undefined" || Object.keys(presets).length == 0) {
        debugMessage = "No presets found, initialising with defaults";
        tracker.sendEvent('Main', 'Debug', debugMessage);
        console.log(debugMessage);
        var presets = {};
        presets[generateId()] = {
            name: "Preset 1",
            calendars: namesFromCalendarJQObjects(myCalendarsFromDiv),
            orderValue: 1,
        };
        presets[generateId()] = {
            name: "Preset 2",
            calendars: namesFromCalendarJQObjects(otherCalendarsFromDiv),
            orderValue: 2,
        };
        storePresets(presets);
    }

    debugMessage = "Refreshed Google Calendar Presets with " + allCalendars.length + " calendars";
    tracker.sendEvent('Main', 'Debug', debugMessage);
    console.log(debugMessage);
    return allCalendars;
}

async function shrinkDrawerHeightAndFindCalendars(elements) {
    const invisibleZeroHeightCss = {
        "height": "0px", 
        "visibility": "hidden",
    };

    const dateDrawer = jQuery('#drawerMiniMonthNavigator');
    dateDrawer.css(invisibleZeroHeightCss);

    const createButton = jQuery("[aria-label='Create']");
    createButton.css(invisibleZeroHeightCss);

    const createBox = dateDrawer.parent().parent().children().first();
    createBox.css(invisibleZeroHeightCss);

    const searchDrawer = jQuery('div[role="search"]');
    searchDrawer.css(invisibleZeroHeightCss);

    for (element of elements) {
        element.find('div[role="presentation"]').each(function(index) {
            jQuery(this).addClass('gcpTranslationYZero');
        });
        element.addClass('gcpHeightZero');
    };

    const calendarListButtons = jQuery("div[aria-expanded='true']");
    const myCalendarsButton = calendarListButtons[1];
    const otherCalendarsButton = calendarListButtons[2];
    myCalendarsButton.click();
    otherCalendarsButton.click();
    await sleep(300); // TODO: Options
    myCalendarsButton.click();
    otherCalendarsButton.click();
    await sleep(300); // TODO: Options

    const myCalendarsFromDiv = findCalendarsInDiv(elements[0]);
    const otherCalendarsFromDiv = findCalendarsInDiv(elements[1]);

    // Restore styling
    dateDrawer.removeAttr('style');
    createButton.removeAttr('style');
    createBox.removeAttr('style');
    searchDrawer.removeAttr('style');

    for (element of elements) {
        element.find('div[role="presentation"]').each(function(index) {
            jQuery(this).removeClass('gcpTranslationYZero');
        });
        element.removeClass('gcpHeightZero');
    };

    return {
        myCalendarsFromDiv: myCalendarsFromDiv,
        otherCalendarsFromDiv: otherCalendarsFromDiv,
    }
}

function findCalendarsInDiv(div) {
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
        const calendarJQObjects = calendarJQObjectsFromNames(presets[presetId].calendars, allCalendars)
        const calendarsToHide = [...allCalendars].filter(x => !calendarJQObjects.includes(x));
        setStateOnCalendars(calendarsToHide, "false");
        setStateOnCalendars(calendarJQObjects, "true");
    }, function(err) {
        const errorMessage = "Couldn't load presets from storage to focus: " + err;
        tracker.sendEvent('Main', 'Error', errorMessage);
        console.log(errorMessage);
    });
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
    tracker = getAnalyticsTracker();
    tracker.sendAppView('MainView');
    tracker.sendEvent('Main', 'Document ready, init started', '');

    refreshExtension();
});
