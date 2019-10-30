javascript:(function(e,s){e.src=s;e.onload=function(){jQuery.noConflict();init()};document.head.appendChild(e);})(document.createElement('script'),'libs/jquery-latest.min.js');

'use strict';

const storageIdForPresets = 'presets';

let presetForm = document.getElementById('presetForm');
let presetFormSubmitButton = document.getElementById('presetFormSubmitButton');

var calendars = ['private', 'doc'];

function constructOptions(calendars) {
  for (let calendar of calendars) {
    let div = document.createElement('div');
    let inputPreset1 = document.createElement('input');
    let slash = document.createElement('span')
    let inputPreset2 = document.createElement('input');
    let span = document.createElement('span');

    inputPreset1.type = "checkbox";
    inputPreset1.setAttribute('preset', "1");
    inputPreset1.setAttribute('calendar', calendar);

    slash.textContent = "/";

    inputPreset2.type = "checkbox";
    inputPreset2.setAttribute('preset', "2");
    inputPreset2.setAttribute('calendar', calendar);

    span.textContent = calendar;

    div.appendChild(inputPreset1);
    div.appendChild(slash);
    div.appendChild(inputPreset2);
    div.appendChild(span);
    presetForm.prepend(div);
  }

  presetFormSubmitButton.addEventListener('click', function() {
    const presets = formToPresets();
    chrome.storage.sync.set(
      {
        [storageIdForPresets]: serialisePresetsForStorage(presets)
      }, 
      function() {
        console.log('Persisting presets');
      }
    )
  });
}

function formToPresets() {
  var calendarsPreset1 = new Set();
  var calendarsPreset2 = new Set();
  var presets = new Set();
  presets.add(calendarsPreset1);
  presets.add(calendarsPreset2);

  const inputs = jQuery("#presetForm :input[type='checkbox']");

  inputs.each(function() {
    const preset = jQuery(this).attr('preset');
    const calendar = jQuery(this).attr('calendar');
    const checked = jQuery(this).is(':checked');
    if (checked) {
      if (preset === "1") {
        calendarsPreset1.add(calendar);
      };
      if (preset === "2") {
        calendarsPreset2.add(calendar);
      }
    }
  });

  return presets;
}

function serialisePresetsForStorage(presets) {
  var serialisedPresets = [];
  presets.forEach(function (preset) {
    serialisedPresets.push([...preset]);
  });
  return serialisedPresets;
}

function deserialisePresetsFromStorage(callback) {
  chrome.storage.sync.get(storageIdForPresets, function(data) {
    const presetsFromStorage = data[storageIdForPresets];
    var presets = new Set();
    presetsFromStorage.forEach(function(preset) {
      const calendars = new Set(preset);
      presets.add(calendars);
    })
    callback(presets);
  });
}

function restorePresetsOntoForm() {
  deserialisePresetsFromStorage(function(presets) {
    const temporaryPresetsArray = [...presets];
  
    const inputs = jQuery("#presetForm :input[type='checkbox']");
  
    inputs.each(function() {
      const calendar = jQuery(this).attr('calendar');
      if ([...temporaryPresetsArray[0]].includes(calendar)) {
        if (jQuery(this).attr('preset') === "1") {
          jQuery(this).attr("checked", true);
        }
      }
      if ([...temporaryPresetsArray[1]].includes(calendar)) {
        if (jQuery(this).attr('preset') === "2") {
          jQuery(this).attr("checked", true);
        }
      }
    });
  });
}

function init() {
  constructOptions(calendars);
  restorePresetsOntoForm();
}
