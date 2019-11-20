'use strict';

console.log("Starting Multiple Calendars Selector...");

let calendarListsDiv;
let allCalendars;
let tracker;

function initExtension(callbackSuccess, callbackFailure) {
    // Restore saved presets, then check for further (new) calendars
    getPresetsFromStorage(function(presets) {
        initCalendars(presets);
        (typeof(callbackSuccess)==="function") && callbackSuccess();
    }, function(err) {
        initCalendars(undefined);
        (typeof(callbackFailure)==="function") && callbackFailure();
    });
}

async function refreshAllCalendars() {
    calendarListsDiv = jQuery("div[role='complementary']:eq(0)").children();
    const {myCalendarsDiv, otherCalendarsDiv} = await shrinkDrawerHeight();
    const myCalendarsFromDiv = findCalendarsInDiv(myCalendarsDiv);
    const otherCalendarsFromDiv = findCalendarsInDiv(otherCalendarsDiv);
    allCalendars = [... myCalendarsFromDiv, ... otherCalendarsFromDiv];
    unshrinkDrawerHeight();
    return {
        myCalendarsFromDiv: myCalendarsFromDiv,
        otherCalendarsFromDiv: otherCalendarsFromDiv,
    };
}

async function initCalendars(presets) {
    let {myCalendarsFromDiv, otherCalendarsFromDiv} = await refreshAllCalendars();
    const allCalendarsNames = namesFromCalendarJQObjects(allCalendars);

    let debugMessage = "Discovered calendars' hash: " + String(allCalendarsNames).hashCode();
    tracker.sendEvent('Main', 'Debug', debugMessage);
    tracker.sendEvent('Main', 'Discovered number of calendars', allCalendars.length);
    console.log(debugMessage);

    chrome.storage.sync.set({[storageIdForAllCalendars]: allCalendarsNames}, null)

    if (typeof(presets)==="undefined" || Object.keys(presets).length == 0) {
        debugMessage = "No presets found, initialising with defaults";
        tracker.sendEvent('Main', 'Debug', debugMessage);
        console.log(debugMessage);
        let presets = {};
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

    debugMessage = "Init Calendars done with " + allCalendars.length + " calendars";
    tracker.sendEvent('Main', 'Debug', debugMessage);
    console.log(debugMessage);
    return allCalendars;
}

async function shrinkDrawerHeight() {
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

    const myCalendarsDiv = calendarListsDiv.children().eq(1).children();
    hideCalendarDiv(myCalendarsDiv);
    const otherCalendarsDiv = calendarListsDiv.children().eq(4).children();
    hideCalendarDiv(otherCalendarsDiv);

    const calendarListButtons = jQuery("div[aria-expanded='true']");
    const myCalendarsButton = calendarListButtons[1];
    const otherCalendarsButton = calendarListButtons[2];
    myCalendarsButton.click();
    otherCalendarsButton.click();

    const drawerDelay = await getDrawerDelayFromStorageAsync();
    await sleep(drawerDelay);
    myCalendarsButton.click();
    otherCalendarsButton.click();
    await sleep(drawerDelay);

    return {
        myCalendarsDiv: myCalendarsDiv,
        otherCalendarsDiv: otherCalendarsDiv,
    };
}

function hideCalendarDiv(div) {
    div.find('div[role="presentation"]').each(function(index) {
        jQuery(this).addClass('gcpTranslationYZero');
    });
    div.addClass('gcpHeightZero');
}

function unshrinkDrawerHeight() {
    const dateDrawer = jQuery('#drawerMiniMonthNavigator');
    const createButton = jQuery("[aria-label='Create']");
    const createBox = dateDrawer.parent().parent().children().first();
    const searchDrawer = jQuery('div[role="search"]');

    dateDrawer.removeAttr('style');
    createButton.removeAttr('style');
    createBox.removeAttr('style');
    searchDrawer.removeAttr('style');

    const {myCalendarsDiv, otherCalendarsDiv} = getCalendarDivs();

    for (const calendarDiv of [myCalendarsDiv, otherCalendarsDiv]) {
        calendarDiv.find('div[role="presentation"]').each(function(index) {
            jQuery(this).removeClass('gcpTranslationYZero');
        });
        calendarDiv.removeClass('gcpHeightZero');
    };
}

function getCalendarDivs() {
    return {
        myCalendarsDiv: calendarListsDiv.children().eq(1).children(),
        otherCalendarsDiv: calendarListsDiv.children().eq(4).children(),
    }
}

function findCalendarsInDiv(div) {
    let foundCalendars = [];
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

async function focusCalendars(presetId) {
    tracker.sendEvent('Main', 'Focusing done', '');
    await refreshAllCalendars();
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

async function hideAllCalendars() {
    tracker.sendEvent('Main', 'Hiding done', '');
    await refreshAllCalendars();
    setStateOnCalendars(allCalendars, "false");
}

async function showAllCalendars() {
    tracker.sendEvent('Main', 'Showing all done', '');
    await refreshAllCalendars();
    setStateOnCalendars(allCalendars, "true");
}

function main() {
    tracker = getAnalyticsTracker();
    tracker.sendAppView('MainView');
    tracker.sendEvent('Main', 'Document ready, init started', '');
    initExtension();
}

jQuery(document).ready(function() {
    main();
});
