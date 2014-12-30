
function speakClicked() {
	try {
		var f0    = parseInt(document.getElementById("f0").value);
		var speed = parseFloat(document.getElementById("speed").value);
		var text  = document.getElementById("text").value;

		var seconds = 30;
		var waveBytes = SAMPLE_FREQUENCY * 2 * 2 * seconds;
		var buf = new Int16Array(new ArrayBuffer(waveBytes));
		SynthSpeech(buf, text, f0, speed, 0);
		playAudioBuffer(buf);
	} catch (e) {
		alert("Something went horribly wrong:\n" + e);
	}
}

function playAudioBuffer(buf) {
	var maxAmp = 22000;
	var audioString = "";
	for (var i=0; i < buf.length; i++) {
        var y = buf[i] / maxAmp * 0x7800;
		audioString += String.fromCharCode(y & 255, (y >> 8) & 255);
	}
	console.log("new Audio...");
	var audio = new Audio("data:audio/wav;base64,"+btoa(atob("UklGRti/UABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YbS/UAA") + audioString));
	console.log("play()!");
	audio.play();
}
