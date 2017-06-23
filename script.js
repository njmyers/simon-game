'use strict';

var mySimon = (function() {

  var colors = ['green', 'yellow', 'red', 'blue'];
  var notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  var masterSequence = [];
  var audio = {};

  var highScore = 0;
  
  /* Timing */
  var time = 400;
  var pace = 3;
  
  /* Modes */
  var strict = 'not strict';

  var ref = [];
  var my = {};

  my.userSequence = [];

  /* Make */

  function make(myFunction) { // Closure to generate prefix color names
    return (function() {
      for (var i = 0; i < colors.length; i++) {
        myFunction.call(this, i);
      }
    })();
  }

  /* Add event listeners */

  function addClick(i) { // Event Listeners
    console.log('click added');
    document.getElementById(colors[i]).addEventListener('click', ref[i] = takeTurn(colors[i]));
  }

  function removeClick(i) { // Remove Event Listeners
    document.getElementById(colors[i]).removeEventListener('click', ref[i]);;
  }

  function addButtons() {
    document.getElementById('start').addEventListener('click', startGame);
    document.getElementById('pace').addEventListener('click', changePace);
    document.getElementById('strict').addEventListener('click', strictMode);    
  }

  function generate() { // End of Document Call for creating DOM elements
    make(myAudio);
    addButtons();
    updateCounter();
  }

  /* Private Audio Functions */

  function randomNote() {
    return notes[Math.floor(Math.random() * 7)]; // Selects A - G
  }

  function randomOctave() {
    return (Math.floor(Math.random() * 3) + 3); // Selects Octave 3 - 5
  }

  function myAudio(i) { // Audio Variables
    var note = randomNote() + randomOctave(); // Random Pitches
    console.log(note);
    audio[colors[i]] = new Wad({source : 'sine',
                                pitch  : note,
                                env    : {attack : .1, release : .025}
                              });
  }

  function sound(color) {
    var a = audio[color];
    a.play({
      env : {hold: ((time - 50) / 1000)}
    });
  }

  /* Private Display Functions */

  function blinker(color) {
    var id = document.getElementById(color);
    function add(id) { // Closure for setTimeout ID
      return function() {
        id.setAttribute('class', 'blink');
      }
    }
    function remove(id) {
      return function() {
        id.removeAttribute('class', 'blink')
      }
    }
    add(id)();
    setTimeout(remove(id), time);
  }

  function updateCounter() {
    var ID = document.getElementById('counter');
    var m = masterSequence.length;
    var num;
    if (m === 0) num = '00';
    else if (m > 0 && m < 10) num = '0' + (m - 1);
    else if (m < 20) num = m - 1;
    else if (m === 20) num = 'WIN';
    ID.innerHTML = (num);
  }

  /* Interactive Stuff on Timers */

  function prettyStuff(c) {
    blinker(c);
    sound(c);
  }

  /* Reset Stuff */

  function startGame() {
    my.userSequence.splice(0);
    resetMaster();
    soundOff();
    updateCounter();
  }

  function blinkAll() {
    for (var i = 0; i < colors.length; i ++) {
      sound(colors[i]);
      blinker(colors[i]);
    }    
  }

  function loseGame() {
    document.getElementById('counter').innerHTML = 'LOSE';
    resetMaster();
    blinkAll();
    }

  /* Modes */

  function strictMode() {
    if (strict === 'not strict' ) {
      strict = 'strict';
      document.getElementById('strict').setAttribute('class', 'highlight');
    } else {
      strict = 'not strict';
      document.getElementById('strict').removeAttribute('class', 'highlight');
    }
  }

  function changePace() {
    var ID = document.getElementById('pace');
    if (pace === 3) {
      pace = 2;
      ID.innerHTML = 'fast';
      ID.setAttribute('class', 'highlight');
    } else {
      pace = 3;
      ID.innerHTML = 'slow';
      ID.removeAttribute('class', 'highlight');
    }
    console.log(pace);
  }

  /* Game Play */

  function generateColor() {
    return colors[Math.floor(Math.random() * 4)];
  }

  function resetMaster() {
    masterSequence.splice(0);
    masterSequence.push(generateColor());
  }

  function resetUser() {
    my.userSequence.splice(0);
    masterSequence.push(generateColor());
  }

  function soundOff() { // All Timing Functions go here
    make(removeClick); // Remove event listeners for duration of computer turn

    function delayed() {
      var i = 0;
      function recurse() {
        if (i < masterSequence.length) {
          var c = masterSequence[i];
          prettyStuff(c);
          //if (i === masterSequence.length - 1) make(addClick);// Add back event listener end of recursive soundOff
          i ++;
          setTimeout(recurse, (time * pace));
        } else {
          make(addClick);
        }
      }
      setTimer(masterSequence.length); // Set the pace of game
      setTimeout(recurse, (time * pace));
      //make(addClick)
    }

    setTimeout(delayed, 200); // Pause after completing turn
  }

  function setTimer(num) {
    if (num < 5) time = 400;
    else if (num < 9) time = 325;
    else if (num < 13) time = 250;
    else if (num >= 14) time = 175;
  }

  /* User Turn Function */

  function takeTurn(color) {
    return function() {
      var temp = true;
      my.userSequence.push(color);
      prettyStuff(color);
      if (masterSequence.length === my.userSequence.length) { // End Turn
        for (var i = 0; i < my.userSequence.length; i ++) {
          if (my.userSequence[i] !== masterSequence[i]) temp = false;
        }
        if (temp) {// End of Turn All Match
          if (masterSequence.length === 20) {
            blinkAll();
          } else {
            resetUser();
            soundOff();
          }
        } else {  // Last Move Doesn't Match
          if (strict === 'strict') {
            loseGame();
          }
          my.userSequence.splice(0);
          soundOff();
        }
      } else { // Middle of Turn
        for (var j = 0; j < my.userSequence.length; j ++) {
          if (my.userSequence[j] !== masterSequence[j]) temp = false;
        }
        if (!temp) { // Mistake Mid-turn
          if (strict === 'strict') {
            loseGame();
          }
          my.userSequence.splice(0);
          soundOff();
        } 
      }
      updateCounter();
    } 
  }

  /* Global Accesible Diagnostic Function */

  my.winner = function() {
    blinkAll();
  }

  my.populate = function() {
    for (var i = 0; i < 19; i ++) {
      masterSequence.push(generateColor());
    }
  }

  generate(); // Create DOM stuff end of document

  return my;

})();