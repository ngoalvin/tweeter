/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// Test / driver code (temporary). Eventually will get this from the server.
$(document).ready(function() {


  const createTweetElement = function(tweetData) {
    const tweet = `<section class='tweets-container'>
    <article>
    <div class="tweets-header">
      <div class="tweet-avatar">
      <img id="avatar" src="/images/avatar.png">
      <h5 id="tweet-user">${tweetData["user"]["name"]}</h5>
      </div>
      <p id="handle">${tweetData["user"]["handle"]}</p>
      </div>
      <p id="tweet-inside">${tweetData["content"]["text"]}</p>
      <hr>
      <footer>
        <span class="date">${convertDate(tweetData["created_at"])} ago</span>
        <div class="icons">
        <img id="flag" src="/images/flag.png">
        <img id="retweet" src="/images/retweet.png">
        <img id="heart" src="/images/heart.png">
        </div>
      </footer>
    </article>
  </section>`;

    return tweet;
  };

  const convertDate = function(milliseconds) {

    const date = new Date(milliseconds);
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  };

  const renderTweets = function(tweets) {
    $("#tweets").empty();
    for (let tweet of tweets) {
      $("#tweets").prepend(createTweetElement(tweet));
    }
  };

  const loadtweets = function() {
    $.get("/tweets", function(data, status) {
      if (status) {
        renderTweets(data);
      }
    });
  };

  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };


  $(".form").on("submit", function(event) {
    event.preventDefault();
    const text = $("textarea").serialize();
    if (!text.slice(5)) {
      $('#error').text("Field can not be empty.");
      $('#error').slideDown("slow", function() {});
    } else if (text.slice(5).length > 140) {
      $('#error').text("Message is too long.");
      $('#error').slideDown("slow", function() {});
    } else {
      const safeHTML = escape(text);
      $.post("/tweets", safeHTML, function() {
        $("textarea").val("");
        console.log(safeHTML);
        loadtweets();
      });
    }
  });
  loadtweets();
});