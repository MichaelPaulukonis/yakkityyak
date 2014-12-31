// TODO: break into chunks based on spaces or punctuation
// gui-button for repetition



var speakClicked = function() {
    try {
        var f0    = parseInt(document.getElementById("f0").value);
        var speed = parseFloat(document.getElementById("speed").value);
        var text  = document.getElementById("text").value;
        var repeat = document.getElementById('repeat').value;

        var seconds = 30;
        var waveBytes = SAMPLE_FREQUENCY * 2 * 2 * seconds;

        console.log('freq: ' + f0 + '\nspeed: ' + speed + '\nwaveBytes: ' + waveBytes);

        // TODO: if auto-chunk is true
        // break the buffer into chunks
        // and parse each chunk
        // ooooh! and maybe change speed and frequency for each chunk....
        // at any rate, this is currently stuck at max 30 seconds....

        var buf = new Int16Array(new ArrayBuffer(waveBytes));

        console.log('length of buf before: ' + buf.length);

        var b = SynthSpeech(buf, text, f0, speed, 0);

        console.log(b);


        console.log('length of buf before: ' + buf.length);

        // reduce size of buffer if < 30 seconds
        buf = buf.subarray(0, b);

        console.log('length of buf after:  ' + buf.length);

        // there doesn't seem to be an easy way to repeat
        // http://jsfiddle.net/tfSTh/1/
        // total time, and countdown
        // can use that for a timer to replay....
        playAudioBuffer(buf);


    } catch (e) {
        alert("Something went horribly wrong:\n" + e);
    }
};

var playAudioBuffer = function(buf) {
    var maxAmp = 22000;
    var audioString = "";
    for (var i=0; i < buf.length; i++) {
        var y = buf[i] / maxAmp * 0x7800;
        audioString += String.fromCharCode(y & 255, (y >> 8) & 255);
    }
    console.log("new Audio...");
    var data = "data:audio/wav;base64,"
            + btoa(atob("UklGRti/UABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YbS/UAA")
                   + audioString);

    var player = document.getElementById('audio') || new Audio();
    // proof-of-concept: for repetition....
    // http://stackoverflow.com/questions/16874529/playing-sounds-sequentially-html5?rq=1
    player.onended = function() { console.log('all done playing!'); };
    player.src = data;
    console.log("play()!");
    player.play();

};

// TODO: parse opts to see if we've passed in new defaults
var getQuerystring = function(key, default_)
{
    if (default_==null) default_="";
    key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if(qs == null)
        return default_;
    else
        return decodeURI(qs[1]);
};


var startup = function() {

    var baseFreq = getQuerystring('basefreq', 60);
    var baseSpeed = getQuerystring('speed', 1.5);
    var baseText = getQuerystring('text', 'taini spitS sinT in djavaskript');
    var autoPlay = getQuerystring('autoplay', false);

    var bfGui = document.getElementById('f0');
    bfGui.value = baseFreq;

    var speedGui = document.getElementById('speed');
    speedGui.value = baseSpeed;

    var textGui = document.getElementById('text');
    textGui.textContent = baseText;

    if (autoPlay) {
        speakClicked();
    }

}();
