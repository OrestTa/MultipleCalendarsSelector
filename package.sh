#!/bin/bash
filename="Google Calendar Presets/GoogleCalendarPresets"`cat manifest.json|jq -r ".version"`".zip"
echo "Packaging as $filename"
zip -r "$filename" _locales images libs src manifest.json README.md
echo "Packaging done"
