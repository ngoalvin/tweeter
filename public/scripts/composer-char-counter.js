$(document).ready(function() {

  $("#tweet-text").keydown(function(event) {
    const counter = $(this).closest(".new-tweet").find(".counter");
    counter.text(140 - this.value.length);
  });
});