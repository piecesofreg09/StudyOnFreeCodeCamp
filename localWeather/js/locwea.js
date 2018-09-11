// corReal is the global coordinate vaiable
// tempData is the global temperature variable
var corReal;
var tempData=[];
var weaData="tornado".toLowerCase();
var wea = "sunny";
var tempWea = "";
var localLoc = "";
$(document).ready(function(){
  $('#loadWeather').on('click', function() {
    console.log("button pressed");
    navigator.geolocation.getCurrentPosition(function(position) {
      loadWeather(position.coords.latitude+","+position.coords.longitude);
    });
  });
  $('#changeT').on('click', function() {
    var tt = tempData.shift();
    $(".tempData").html(tt);
    tempData.push(tt);
  });
});


/*
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords);
    corReal = position.coords;
    $("#location").html(corReal.latitude+" "+corReal.longitude);
    //getWeather();
    changeWeatherIcon();
  });
}
*/
/*
function getCity(lat, lon) {
  $.ajax( {
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&key=AIzaSyA2ZSdd_NN4RS0nscix_hdhaR7UW8Qbec8', success: function(data) {
      console.log("success");
      var post = data.shift(); // The data is an array of posts. Grab the first one.
      
      $('#location').html(post.content).fadeIn(500);
    },
    cache: false
  });
  
}
*/
/*
function getWeather() {
  $.ajax( {
    url: 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1', success: function(data) {
      console.log("success");
      var post = data.shift(); // The data is an array of posts. Grab the first one.
      
      $('#location').html(post.content).fadeIn(500);
    },
    cache: false
  });
}
*/
function initMap() {
  console.log("initMap");
  var geocoder = new google.maps.Geocoder;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position.coords);
      corReal = position.coords;
      $("#location").html(corReal.latitude+" "+corReal.longitude);
      //getWeather();
      geocodeLatLng(geocoder, corReal.latitude, corReal.longitude);
      console.log(corReal.latitude + "," + corReal.longitude);
      loadWeather(corReal.latitude+","+corReal.longitude);
    });
  }
}
function geocodeLatLng(geocoder, x, y) {
  var latlng = {lat: x, lng: y};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[1]) {
        var addStr = results[1].formatted_address;
        addStr = addStr.match(/[a-zA-z ]+,/);
        console.log(typeof(addStr));
        var len = addStr[0].split("");
        console.log(len);
        var len = len.length;
        addStr = addStr[0].substr(0,len-1);
        $("#location").html(addStr);
        localLoc = addStr;
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
function loadWeather(location, woeid) {
  console.log("Run to load weather.");
  $.simpleWeather({
    location: location,
    woeid: woeid,
    unit: 'f',
    success: function(weather) {
      console.log("Successfully get weather data.");
      var locationHtml = '</br><div><h4>' + weather.city + ', ' + weather.region+'</h4><div>';
      $("#location").html(localLoc + locationHtml);
      var html = '<div><h2 class="tempData">' + weather.temp + '&deg;' + weather.units.temp + '</h2></div>';
      html += '<div><h2>' + weather.currently + '</h2></div>';      
      tempData = [weather.alt.temp+"&deg;C",weather.temp+"&deg;F"];
      weaData = weather.currently.toLowerCase();
      console.log(weaData);
      $("#weather").html(html);
      changeWeatherIcon();
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}
function changeWeatherIcon() {
  switch (weaData) {
    case "fair (night)":
    case "clear (night)":
      wea = "night-clear";
      break;
    case "sunny":
    case "fair (day)":
      wea = "day-sunny";
      break;
    case "cloudy":
    case "partly cloudy":
    case "mostly cloudy":
    case "mostly cloudy (night)":
    case "mostly cloudy (day)":
    case "partly cloudy (night)":
    case "partly cloudy (day)":
      wea = "cloudy";
      break;
    case "thundershowers":
    case "isolated thundershowers":
    case "tropical storm":
      wea = "storm-showers";
      break;
    case "severe thunderstorms":
    case "thunderstorms":
    case "isolated thunderstorms":
    case "scattered thunderstorms":
      wea = "thunderstorm";
      break;
    case "freezing drizzle":
    case "drizzle":
    case "freezing rain":
      wea = "sprinkle";
      break;
    case "scattered showers":
    case "showers":
      wea = "showers";
      break;
    case "mixed rain and sleet":
    case "mixed snow and sleet":
    case "sleet":
      wea = "sleet";
      break;
    case "mixed rain and snow":
    case "mixed rain and hail":
      wea = "rain-mix";
      break;
    case "snow flurries":
    case "light snow showers":
    case "blowing snow":
    case "snow":
    case "heavy snow":
    case "scattered snow showers":
    case "snow showers":
      wea = "snow";
      break;
    case "tornado":
      wea = "tornado";
      break;
    case "hurricane":
      wea = "hurricane";
      break;
    case "hail":
      wea = "hail";
      break;
    case "dust":
      wea = "dust";
      break;
    case "foggy":
      wea = "fog";
      break;
    case "haze":
      wea = "smog";
      break;
    case "smoky":
      wea = "smoke";
      break;
    case "blustery":
      wea = "strong-wind";
      break;
    case "windy":
      wea = "windy";
      break;
    case "cold":
      wea = "snowflake-cold";
      break;
    case "hot":
      wea = "hot";
      break;
                 }
  $("#weather-icon").removeClass("wi-" + tempWea)
  $("#weather-icon").addClass("wi-" + wea);
  console.log(wea);
  tempWea = wea;
}
