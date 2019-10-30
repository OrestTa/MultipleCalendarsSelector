javascript:(function(e,s){e.src=s;e.onload=function(){jQuery.noConflict();init()};document.head.appendChild(e);})(document.createElement('script'),'libs/jquery-latest.min.js');

'use strict';

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
    chrome.storage.sync.set({presets: presets}, function() {
      console.log('Persisting presets');
    })
  });
}

function formToPresets() {
  var calendarsPreset1 = [];
  var calendarsPreset2 = [];

  const inputs = jQuery("#presetForm :input[type='checkbox']");

  inputs.each(function() {
    const preset = jQuery(this).attr('preset');
    const calendar = jQuery(this).attr('calendar');
    const checked = jQuery(this).is(':checked');
    if (checked) {
      if (preset === "1") {
        calendarsPreset1.push(calendar);
      };
      if (preset === "2") {
        calendarsPreset2.push(calendar);
      }
    }
  });

  return {
    calendarsPreset1: calendarsPreset1, 
    calendarsPreset2: calendarsPreset2,
  };
}

function presetsToForm() {
  chrome.storage.sync.get('presets', function(data) {
    const calendarsPreset1 = data.presets.calendarsPreset1;
    const calendarsPreset2 = data.presets.calendarsPreset2;

    const inputs = jQuery("#presetForm :input[type='checkbox']");

    inputs.each(function() {
      const calendar = jQuery(this).attr('calendar');
      if (calendarsPreset1.includes(calendar)) {
        if (jQuery(this).attr('preset') === "1") {
          jQuery(this).attr("checked", true);
        }
      }
      if (calendarsPreset2.includes(calendar)) {
        if (jQuery(this).attr('preset') === "2") {
          jQuery(this).attr("checked", true);
        }
      }
    });
  });
}

function init() {
  constructOptions(calendars);
  presetsToForm();
}
