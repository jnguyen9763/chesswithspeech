var recognizing, currPlayer;
var index = 0;
var source = '', target = '';
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
reset();

recognition.onend = function() {
    if (recognizing) {
        recognition.start();
        return;
    }
    reset();
}

recognition.onresult = function(event) {
    var final = "";
    var interim = "";
    for (var i = index; i < event.results.length; ++i) {
        // if the word is finally processed, then add to final
        if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
        // else the word is still be processed, add to interim
        } else {
            interim += event.results[i][0].transcript;
        }
    }

    final_span.innerHTML = final;
    interim_span.innerHTML = interim;
    // display one command at a time
    if (checkCommand(final)) {
        index = event.results.length;
    }
}

function checkCommand(command) {
    currPlayer = game.turn();
    if (command !== '') {
        // source: https://stackoverflow.com/questions/64904/parsings-strings-extracting-words-and-phrases-javascript
        var results = command.toLowerCase().match(/("[^"]+"|[^"\s]+)/g);
        source = results[0];
        target = results[1];
  
        if (source === 'new' && target === 'game') {
            location.reload(false);
        }
        else if (source === 'move' && (target === 'fast' || target === 'slow')) {
            config.position = board.position();
            config.moveSpeed = target;
            board = Chessboard('board', config);
            fixOrientation();
        }
        else if (source === 'rotate' && target === 'board') {
            board.orientation('flip');
        }
        else if (source === 'toggle' && target === 'orientation') {
            enableFlipping = !enableFlipping;
            if (enableFlipping) fixOrientation();
        }
        else {
            board.move(source + '-' + target);
        }
        return true;
    }
    return false;
}

function fixOrientation() {
    if (currPlayer === 'b') {
        board.orientation('black');
    } else {
        board.orientation('white');
    }
}

function reset() {
    recognizing = false;
    index = 0;
    button.innerHTML = "Click to Speak";
    final_span.innerHTML = "";
    interim_span.innerHTML = "";
}

function toggleStartStop() {
    if (recognizing) {
        reset();
        recognition.stop();
    } else {
        recognizing = true;
        button.innerHTML = "Click to Stop";
        recognition.start();
    }
}