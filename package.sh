#!/bin/bash
filename="Multiple Calendars Selector/MultipleCalendarsSelector"`cat manifest.json|jq -r ".version"`".zip"
echo "Packaging as $filename"
zip -r "$filename" _locales images libs src manifest.json README.md
echo "Packaging done"
