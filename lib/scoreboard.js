var firebase = require('firebase');
require('firebase/database');
const FirebaseConfig = require('./firebase-config');
var firebaseApp = firebase.initializeApp(FirebaseConfig);
var fireDb = firebaseApp.database();
var scoreboardRecords = [];

function Scoreboard(){}

Scoreboard.prototype.savePoints = function(points){
  if (points > scoreboardRecords[4].points) {
    var scoreboard = this;
    scoreboard.setHighScore(points, scoreboard);
  }
};

Scoreboard.prototype.setHighScore = function(points, scoreboard){
  $('.scoreboard').hide();
  $('.high-score-entry').css('display', 'inline-block');
  $('#submit-name').click(function(event){
    scoreboard.addToScoreboardRecords(points);
    fireDb.ref('highscore/').set({
      highscores: scoreboardRecords
    });
    event.preventDefault();
    scoreboard.renderScores();
    $(".high-score-entry").hide()
    $('.scoreboard').show();
  });
};

Scoreboard.prototype.addToScoreboardRecords = function (points) {
  var username = $("#username").val() || "unknown user";
  scoreboardRecords.push({username: username, points: points});
  return scoreboardRecords;
};

Scoreboard.prototype.loadScoreboard = function(){
  var scoreboard = this;
  scoreboardRecords = [];
  $('#scoreboard-records').empty();

  fireDb.ref('highscore/').once('value').then(function(scores){
    var allScores = scoreboard.sortScores(scores.val().highscores);
    scoreboard.addScores(allScores);
    scoreboard.renderScores(allScores, scoreboardRecords.length);
  });
};

Scoreboard.prototype.renderScores = function(allScores, scoreboardLength){
  // var results = ""
  for (var i = 0; i < scoreboardLength; i++) {
    $('#scoreboard-records').append(i+1 + ". " + allScores[i].username + ": " + allScores[i].points + "<br>");
    // results += (i+1) + ". " + allScores[i].username + ": " + allScores[i].points + "<br>"
  }
  // $("#scoreboard-records").html(results)
};

Scoreboard.prototype.addScores = function(allScores){
  for (var i = 0; i < 5; i++) {
    if (allScores[i] !== undefined) {
      scoreboardRecords.push(allScores[i]);
    }
  }
  return scoreboardRecords;
};

Scoreboard.prototype.sortScores = function(scores){
  var sortedScores = scores.sort(function(a, b){return b.points - a.points;});
  return sortedScores;
};

module.exports = Scoreboard;