'use strict';

var apiURL = 'http://api.wunderground.com/api/e0e26c847eb5b7b7/';
var locationCode = 94539;

$(document).ready(init);

var responseObjects = [];

function init() {
  $('#set-zip').click(setZip);
  fetchData();
}

function setZip() {
  locationCode = $('#zip-code').val();
  fetchData();
}

function fetchData() {
  var forecastURL = apiURL + 'forecast10day/q/' + locationCode + '.json';
  var conditionURL = apiURL + 'conditions/q/' + locationCode + '.json';

  $.getJSON(conditionURL, function(response) {
    responseObjects.push(response);
    fillData();
  });

  $.getJSON(forecastURL, function(response) {
    responseObjects.push(response);
    fillData();
  });
}

function fillData() {
  if (responseObjects.length === 2) {
    var forecastObject;
    var conditionObject;

    if (responseObjects[0].hasOwnProperty('forecast')) {
      forecastObject = responseObjects[0];
      conditionObject = responseObjects[1];
    } else {
      forecastObject = responseObjects[1];
      conditionObject = responseObjects[0];
    }
    while (responseObjects.length > 0) {
      responseObjects.pop();
    }

    conditionObject = conditionObject.current_observation;
    forecastObject = forecastObject.forecast.simpleforecast.forecastday;

    $('#hereandnow .city').text(conditionObject.display_location.city);
    $('#hereandnow .weather .text').text(conditionObject.weather);
    $('#hereandnow .weather .icon').attr('src', forecastObject[0].icon_url);
    $('#hereandnow .temp').text(conditionObject.temp_f);
    $('#hereandnow .today .weekday').text(forecastObject[0].date.weekday);
    $('#hereandnow .today .highlow').text(highLowString(forecastObject[0]));

    for (var i = 1; i <= 9; i++) {
      $('#day' + i + ' .weekday').text(forecastObject[i].date.weekday);
      $('#day' + i + ' .icon').attr('src', forecastObject[i].icon_url);
      $('#day' + i + ' .conditions').text(forecastObject[i].conditions);
      $('#day' + i + ' .highlow').text(highLowString(forecastObject[i]));
    }
  }
}

function highLowString(object) {
  return 'H: ' + object.high.fahrenheit + ' L: ' + object.low.fahrenheit;
}
