'use strict';

let presetForm = document.getElementById('presetForm');
let presetFormSubmitButton = document.getElementById('presetFormSubmitButton');

var calendars = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];

function constructOptions(calendars) {
  for (let calendar of calendars) {
    let div = document.createElement('div');
    let inputPreset1 = document.createElement('input');
    let slash = document.createElement('span')
    let inputPreset2 = document.createElement('input');
    let span = document.createElement('span');

    inputPreset1.type = "checkbox";
    inputPreset1.name = calendar;
    slash.textContent = "/";
    inputPreset2.type = "checkbox";
    inputPreset2.name = calendar;
    span.textContent = calendar;

    div.appendChild(inputPreset1);
    div.appendChild(slash);
    div.appendChild(inputPreset2);
    div.appendChild(span);
    presetForm.prepend(div);
  }

  presetFormSubmitButton.addEventListener('click', function() {
    chrome.storage.sync.set({color: item}, function() {
      console.log('color is ' + item);
    })
  });
}

constructOptions(calendars);
