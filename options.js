'use strict';

let presetForm = document.getElementById('presetForm');
let presetFormSubmitButton = document.getElementById('presetFormSubmitButton');

const preset1Id = '1'; // TODO
const preset2Id = '2'; // TODO

var calendars = ['private', 'work']; // TODO

function constructOptions(calendars) {
  for (let calendar of calendars) {
    let div = document.createElement('div');
    let inputPreset1 = document.createElement('input');
    let slash = document.createElement('span')
    let inputPreset2 = document.createElement('input');
    let span = document.createElement('span');

    inputPreset1.type = "checkbox";
    inputPreset1.setAttribute('preset', preset1Id);
    inputPreset1.setAttribute('calendar', calendar);

    slash.textContent = "/";

    inputPreset2.type = "checkbox";
    inputPreset2.setAttribute('preset', preset2Id);
    inputPreset2.setAttribute('calendar', calendar);

    span.textContent = calendar;

    div.appendChild(inputPreset1);
    div.appendChild(slash);
    div.appendChild(inputPreset2);
    div.appendChild(span);
    presetForm.prepend(div);
  }

  presetFormSubmitButton.addEventListener('click', function() {
    storePresets(formToPresets());
  });
}

function formToPresets() {
  var presets = {};

  const inputs = jQuery("#presetForm :input[type='checkbox']");

  inputs.each(function() {
    const preset = jQuery(this).attr('preset');
    const calendar = jQuery(this).attr('calendar');
    const checked = jQuery(this).is(':checked');
    if (checked) {
      if (typeof(presets[preset]) === "undefined") {
        presets[preset] = new Set();
      }
      presets[preset].add(calendar);
    }
  });
  
  return presets;
}

function restorePresetsOntoForm() {
  getAndDeserialisePresetsFromStorage(function(presets) {
    const inputs = jQuery("#presetForm :input[type='checkbox']");
    inputs.each(function() {
      const currentInput = jQuery(this);
      const calendar = currentInput.attr('calendar');
      const presetIds = Object.keys(presets);
      presetIds.forEach(function(presetId) {
        if (presets[presetId] && (presets[presetId]).has(calendar)) {
          if (currentInput.attr('preset') === presetId) {
            currentInput.attr("checked", true);
          };
        };
      });
    });
  });
}

function injectScript(pathToScript, callback) {
  (function(e,s){
    e.src=s;
    e.onload=function(){
      callback()
    };
    document.head.appendChild(e);
  })(document.createElement('script'), pathToScript);  
}

function init() {
  injectScript('libs/jquery-latest.min.js', function() {
    jQuery.noConflict();
    injectScript('utils.js', function() {
      constructOptions(calendars);
      restorePresetsOntoForm();
    })
  });
}

init();
