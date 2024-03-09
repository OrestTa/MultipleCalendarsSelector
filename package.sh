#!/bin/bash
TARGET='Multiple Calendars Selector'
mkdir -p "$TARGET"
FILENAME="$TARGET/MultipleCalendarsSelector"$(cat manifest.json | jq -r ".version")".zip"
echo "Packaging as $FILENAME"
zip -r "$FILENAME" _locales images libs src manifest.json
echo "Packaging done"
