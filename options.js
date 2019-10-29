javascript:(function(e,s){e.src=s;e.onload=function(){jQuery.noConflict();console.log('jQuery injected')};document.head.appendChild(e);})(document.createElement('script'),'libs/jquery-latest.min.js');

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
    inputPreset1.setAttribute('preset', 1);
    inputPreset1.setAttribute('calendar', calendar);

    slash.textContent = "/";

    inputPreset2.type = "checkbox";
    inputPreset2.setAttribute('preset', 2);
    inputPreset2.setAttribute('calendar', calendar);

    span.textContent = calendar;

    div.appendChild(inputPreset1);
    div.appendChild(slash);
    div.appendChild(inputPreset2);
    div.appendChild(span);
    presetForm.prepend(div);
  }

  presetFormSubmitButton.addEventListener('click', function() {
    formToPresets();
    // chrome.storage.sync.set({preset1: item}, function() {
    //   console.log('Persisting presets: ' + item);
    // })
  });
}

function formToPresets(presetForm) {
  var calendarsPreset1 = new Set();
  var calendarsPreset2 = new Set();

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

  return {
    calendarsPreset1: calendarsPreset1, 
    calendarsPreset1: calendarsPreset2
  };
}

function presetsToForm(preset1, preset2) {

}

constructOptions(calendars);
