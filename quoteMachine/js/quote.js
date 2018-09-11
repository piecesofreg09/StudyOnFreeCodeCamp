var aniTime = 300;
$(document).ready(function() {
  console.log( "ready!" );
  getQuote();
  getColor();
  $('#get-another-quote-button').on('click', getQuote);
  $('#get-another-quote-button').on('click', getColor);
  $('#twitter-button').on('click',function(e) {
    //e.preventDefault();
    var str = $('#quote-content').text();
    var author = $('#quote-title').text();
    console.log("something to post: " + str);
    $('.twitter-share-button').attr('href', 'https://twitter.com/intent/tweet?text='+str+"  "+author);
    
    
  });
});

// This line is all the functions
function getColor() {
  var x = Math.floor((Math.random() * 180) + 0);
  var y = Math.floor((Math.random() * 180) + 0);
  var z = Math.floor((Math.random() * 180) + 0);
  var a = 0.5;
  var bt = 1.4;
  var btx = Math.floor(bt * x);
  var bty = Math.floor(bt * y);
  var btz = Math.floor(bt * z);
  var bta = 0.9;
  var au = 1.1;
  var aux = Math.floor(au * x);
  var auy = Math.floor(au * y);
  var auz = Math.floor(au * z);
  var aua = 0.8;
  
  //$('body').css('background-color', 'rgba(' + x + ',' + y + ',' + z + ',' + a + ')');
  $('body').animate({
    backgroundColor: 'rgba(' + x + ',' + y + ',' + z + ',' + a + ')',
  }, aniTime * 2);
  //$('.buttonDiv').css('background-color', 'rgba(' + btx + ',' + bty + ',' + btz + ',' + bta + ')');
  $('.buttonDiv').animate({
    backgroundColor: 'rgba(' + btx + ',' + bty + ',' + btz + ',' + bta + ')'}, aniTime * 2);
  //$('#author-text, #quote-content, #quote-title').css('color', 'rgba(' + aux + ',' + auy + ',' + auz + ',' + aua + ')');
  $('#author-text, #quote-content, #quote-title').animate({
    color: 'rgba(' + aux + ',' + auy + ',' + auz + ',' + aua + ')'}, aniTime * 2);
}
function getQuote() {
  $.ajax( {
    url: 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=result',
    dataType: "jsonp",
    success: function(data) {
      console.log(data);
    },
    cache: false
  });
}
function result(data) {
  console.log(data);
  console.log("success");
  var post = data.shift(); // The data is an array of posts. Grab the first one.
  console.log(post.title);
  $('#quote-title, #quote-content').fadeOut(aniTime, function(){
    $('#quote-title').text('--  ' + post.title).fadeIn(aniTime);
    $('#quote-content').html(post.content).fadeIn(aniTime);
  });
  

  // If the Source is available, use it. Otherwise hide it.
  if (typeof post.custom_meta !== 'undefined' && typeof post.custom_meta.Source !== 'undefined') {
    $('#quote-source').html('Source:' + post.custom_meta.Source);
  }
  else {
    $('#quote-source').text('');
  }
}
