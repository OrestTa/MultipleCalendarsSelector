'use strict'

importScripts("utils.js")

const currentPackageVersion = chrome.runtime.getManifest().version
const storageIdForLastSeenPackageVersion = 'lastSeenPackageVersion'

function main() {
    chrome.runtime.onInstalled.addListener(function () {
        chrome.tabs.create({ url: googleCalendarUrl })
        chrome.declarativeContent.onPageChanged.removeRules(
            undefined,
            function () {
                chrome.declarativeContent.onPageChanged.addRules([
                    {
                        conditions: [
                            new chrome.declarativeContent.PageStateMatcher({
                                pageUrl: { hostContains: '' },
                            }),
                        ],
                        actions: [
                            new chrome.declarativeContent.ShowPageAction(),
                        ],
                    },
                ])
            }
        )
    })

    checkForVersionUpgrade()
}

function persistPackageVersion(versionToPersist, callback) {
    console.log('Persisting version ' + versionToPersist)
    chrome.storage.sync.set(
        { [storageIdForLastSeenPackageVersion]: versionToPersist },
        callback
    )
}

function checkForVersionUpgrade() {
    chrome.storage.sync.get(
        storageIdForLastSeenPackageVersion,
        function (data) {
            const lastSeenPackageVersion =
                data[storageIdForLastSeenPackageVersion]
            if (lastSeenPackageVersion !== currentPackageVersion) {
                persistPackageVersion(currentPackageVersion)
            }
        }
    )
}

main()
