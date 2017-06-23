var thisTime = 1000;
var anAudio = new Audio('../extended.mp3');

var audioLib = (function() {
  
  var my = {};

  function stopIt(a) {
          return function() {
            a.pause();
            a.currentTime = 0.0;    
          }
        }

  function playIt(a) {
    return function() {
      a.play();
    }
  }

  my.fadeIn = function(audObj, fadeTime) {
    var volume = 0;
    var fade = fadeTime;
    var minTime = 4;
    var i = 0;
    function recurse() {
      if (i < fade) {
        volume += (1 / (fade / minTime));
        volume = (Math.round(volume * 1000000) / 1000000) // Floating integer
        audObj.volume = volume;
        console.log(volume + ': volume ' + i + ': fade');
        i += minTime;
        console.log(i);
      }
      setTimeout(recurse, minTime);
    }
    audObj.volume = 0;
    audObj.play();
    setTimeout(recurse, minTime);
  }

  my.fadeOut = function(audObj, fadeTime, audioTime) {
    
    //return function () {

      function fader() {
        //return function() {
          var volume = 1;
          var fade = fadeTime;
          var minTime = 4;
          var i = 0;
          function recurse() {
            if (i < fade) {
              volume -= (1 / (fade / minTime));
              volume = (Math.round(volume * 1000) / 1000) // Floating integer
              audObj.volume = volume;
              console.log('volume: ' + volume);
              if (volume === 0) stopIt(audObj)();
              i += minTime;
            }
            setTimeout(recurse, minTime);
          }
          setTimeout(recurse, minTime);
        //}
      }

      //console.log(audioTime - fadeTime);
      playIt(audObj)();
      setTimeout(function(){fader();}, (audioTime - fadeTime) );
    //}
  }  

  return my;

})();


audioLib.fadeOut(anAudio, 24, 1000);

//setTimeout(fadeOut(anAudio, 200, 400), 800);

//anAudio.play();

   function stopIt(a) {
      return function() {
        a.pause();
        a.currentTime = 0.0;    
      }
    }

    function playIt(a) {
      return function() {
        a.play();
      }
    }

//setTimeout(stopIt(anAudio), 200);

//setTimeout(playIt(anAudio), 300);