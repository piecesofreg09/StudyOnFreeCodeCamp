var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "edemonster", "squareenix", "twitchpresents"];
var offOnInfo = {};
var icon_size = "50";
$(document).ready(function(){
  useAjax();
  $("#all").on("click", function() {
    for (var i = 0; i < channels.length; i++) {
      var divName = "#" + channels[i].toLowerCase();
      $(divName).show();
    }
    console.log(offOnInfo);
  });
  $("#on").on("click", function() {
    for (var i = 0; i < channels.length; i++) {
      var divName = "#" + channels[i].toLowerCase();
      console.log(divName);
      if (offOnInfo[channels[i].toLowerCase()] !== "Offline") {
        $(divName).show();
        console.log("changed");
      }
      else {
        $(divName).hide();
        console.log("changed");
      }
    }
  });
  $("#off").on("click", function() {
    for (var i = 0; i < channels.length; i++) {
      var divName = "#" + channels[i].toLowerCase();
      console.log(divName);
      if (offOnInfo[channels[i].toLowerCase()] !== "Offline") {
        $(divName).hide();
        console.log("changed");
      }
      else {
        $(divName).show();
        console.log("changed");
      }
    }
  });
});

function useAjax() {
  for (var i = 0; i < channels.length; i ++) {
    $.ajax( {
      url: "https://wind-bow.gomix.me/twitch-api"+"/channels/"+channels[i],
      dataType: "jsonp"
    }).done(function(e) {
      var linkUrl = e.url;
      var iconUrl = e.logo;
      var display_name = e.display_name;
      var name = e.name;
      var game = e.game;
      var status = e.status;
      //console.log(e);
      var html = "<div class='col-sm-2' style='text-align: center'><img src=" + iconUrl + " height=" + icon_size +" width=" + icon_size + "></div>";
      html += "<div class='col-sm-3' style='text-align: center'><p>" + name + "</p></div>";
      // add info or offline
      if (game !== null) {
        offOnInfo[name] = game + ": " + status;
      }
      else if (status !== null) {
        offOnInfo[name] = status;
      }
      else {
        offOnInfo[name] = "Offline";
      }
      var tempName = offOnInfo[name].split("");
      console.log(tempName.length);
      if (tempName.length > 50) {
        offOnInfo[name] = offOnInfo[name].substring(0,50) + "...";
      }
      else {
        offOnInfo[name] = offOnInfo[name].substring(0,50);
      }
      console.log(offOnInfo[name]);
      html += "<div class='col-sm-7' style='text-align: center'><p>" + offOnInfo[name] + "</p></div>";
      
      var divAdded = "<div class='channel row' id=" + name + "><a href=" + linkUrl + " target=_blank>" + html + "</a></div>";
      $("#channel-parent").append(divAdded);
      if (offOnInfo[name] == "Offline") {
        $("#" + name).addClass("Offline");
        console.log("added offline");
      }
      else {
        $("#" + name).addClass("Online");
        console.log("added online");
      }
      
    });
  }
  
}
function loadPanel() {
  console.log("success.");
}