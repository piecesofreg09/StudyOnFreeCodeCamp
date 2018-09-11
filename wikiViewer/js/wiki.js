$(document).ready(function() {
  $('input').keypress(function (e) {
    if (e.which == 13) {
      var content = $('input').val();
      searchWiki(content);
      return false;    //<---- Add this line
    }
  });
  
})
function searchWiki(content) {
  $.ajax({
    url:'https://en.wikipedia.org/w/api.php',
    data: {
      action: 'opensearch',
      search: content,
      limit: 8,
      namespace: 0,
      format: 'json',
      origin: "*"
    },
    dataType: "json",
    success: function(res) {
      console.log("success");
      console.log(res);
      var post="";
      $("#result").html(post);
      $("#input-field p").remove();
      for (var i = 0; i < res[1].length; i ++) {
        var newDiv = $("<div class='singRes'>"+"<a href="+res[3][i]+" target='_blank'>"+"<div><h3><b>"+res[1][i]+"</b></h2>"+"<h5>"+res[2][i]+"</h5><br>"+"</div></a></div>").hide();
        $("#result").append(newDiv);
      }
      console.log($("#result").html());
      showDiv();
    }
  });
  
}
function showDiv() {
  // If there are hidden divs left
  if($('div:hidden').length) {
    // Fade the first of them in
    $('div:hidden:first').fadeIn();
    // And wait one second before fading in the next one
    setTimeout(showDiv, 400);
  }
}