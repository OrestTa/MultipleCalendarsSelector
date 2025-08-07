'use strict'


async function focusCalendars(presetId) {
    await refreshAllCalendars()
    getPresetsFromStorage(
        function (presets) {
            const calendarJQObjects = calendarJQObjectsFromNames(
                presets[presetId].calendars,
                allCalendars
            )
            const calendarsToHide = [...allCalendars].filter(
                (x) => !calendarJQObjects.includes(x)
            )
            setStateOnCalendars(calendarsToHide, false)
            setStateOnCalendars(calendarJQObjects, true)
        },
        function (err) {
            const errorMessage =
                "Couldn't load presets from storage to focus: " + err
            console.log(errorMessage)
        }
    )
}


async function hideAllCalendars() {
    await refreshAllCalendars()
    setStateOnCalendars(allCalendars, false)
}

async function showAllCalendars() {
    await refreshAllCalendars()
    setStateOnCalendars(allCalendars, true)
}
function main() {
    // Open Google Calendar if not currenty active; only display the actual popup if active
    chrome.tabs.query(
        { active: true, currentWindow: true },
        function (tabsActive) {
            if (
                tabsActive[0].url &&
                tabsActive[0].url.includes(googleCalendarUrl)
            ) {
                buildPopup()
            } else {
                chrome.tabs.query(
                    { active: false, currentWindow: true },
                    function (tabs) {
                        for (const tab of tabs) {
                            if (
                                tab.url &&
                                tab.url.includes(googleCalendarUrl)
                            ) {
                                chrome.tabs.highlight({ tabs: tab.index })
                                return
                            }
                        }
                        chrome.tabs.create({ url: googleCalendarUrl })
                    }
                )
            }
        }
    )
}

function buildPopup() {
    const presetSpan = document.getElementById('presetSpan')

    getPresetsFromStorage(
        function (presets) {
            let presetIds = Object.keys(presets)
            presetIds.sort((a, b) => {
                return presets[a].orderValue - presets[b].orderValue
            })
            presetIds.forEach(function (presetId) {
                let presetFocusButton = document.createElement('button')
                presetSpan.appendChild(presetFocusButton)
                presetFocusButton.innerText = presets[presetId].name
                presetFocusButton.className = 'popup'
                presetFocusButton.onclick = function (element) {
                    chrome.tabs.query(
                        { active: true, currentWindow: true },
                        function (tabs) {
                            chrome.scripting.executeScript({
                                target: {tabId: tabs[0].id},
                                func:focusCalendars,
                                args: [presetId]
                            })
                        }
                    )
                }
            })
        },
        function (err) {
            const errorMessage =
                "Couldn't load presets from storage for popup: " + err
            console.log(errorMessage)
        }
    )

    let presetAllButton = document.getElementById('presetAll')
    presetAllButton.innerText = chrome.i18n.getMessage('displayAllCalendars')
    let presetNoneButton = document.getElementById('presetNone')
    presetNoneButton.innerText = chrome.i18n.getMessage('hideAllCalendars')
    let openOptionsButton = document.getElementById('openOptions')
    openOptionsButton.innerText = chrome.i18n.getMessage('extensionOptions')

    presetAllButton.onclick = function (element) {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func:showAllCalendars
                })
            }
        )
    }

    presetNoneButton.onclick = function (element) {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func:hideAllCalendars
                })
            }
        )
    }

    openOptionsButton.onclick = function (element) {
        chrome.tabs.create({
            url:
                'chrome-extension://' + chrome.runtime.id + '/src/options.html',
        })
    }
}

main()
