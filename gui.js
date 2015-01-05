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

        // remove everything but spaces and the acceptable phoenemes
        // a, e, E, i, o, u
        // b, d, f, g, h, j, k, l, m, n, p, r, s, S, t, T, v, w, z, Z

        console.log('text: ' + text);

        text = text.replace(/[^aeEioubdfghjklmnprsStTvwzZ]/g, '');

        console.log('phoenemes: ' + text);

        var chunks = text.split('');
        var curChunk = 0;

        // TODO: loop through phoenemes
        // when playing is done, get next phoeneme


        var player = document.getElementById('audio') || new Audio();
        // proof-of-concept: for repetition....
        // http://stackoverflow.com/questions/16874529/playing-sounds-sequentially-html5?rq=1
        player.onended = function() {
            console.log('duration: ' + this.duration);
            this.pause();
            this.currentTime = 0;
            curChunk++;
            if (curChunk >= chunks.length) {
                console.log('all done!');
            } else {
                builder(chunks[curChunk], speed, f0, waveBytes);
            }
        };

        var builder = function(text, speed, f0, waveBytes) {

            // console.log('freq: ' + f0 + '\nspeed: ' + speed + '\nwaveBytes: ' + waveBytes);
            console.log('text: ' + text);

            var buf = new Int16Array(new ArrayBuffer(waveBytes));
            var b = SynthSpeech(buf, text, f0, speed, 0);

            // reduce size of buffer if < 30 seconds
            buf = buf.subarray(0, b);
            console.log('buflength: ' + buf.length);

            var maxAmp = 22000;
            var audioString = "";
            for (var i=0; i < buf.length; i++) {
                var y = buf[i] / maxAmp * 0x7800;
                audioString += String.fromCharCode(y & 255, (y >> 8) & 255);
            }

            var data = "data:audio/wav;base64,"
                    + btoa(atob("UklGRti/UABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YbS/UAA")
                           + audioString);
            console.log(data);
            player.src = data;
            player.play();

        };

        builder(chunks[curChunk], speed, f0, waveBytes);
        return;

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
