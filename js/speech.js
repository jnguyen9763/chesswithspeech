// Gloria Kitchens and Jacqueline Nguyen
// gloria.kitchens@tufts.edu and jacqueline.nguyen@tufts.edu
// handles speech commands

var coordinates = [];
var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var numbers = [1, 2, 3, 4, 5, 6, 7, 8];
for (var i = 0; i < letters.length; i++) {
    for (var j = 0; j < letters.length; j++) {
        coordinates.push(letters[i] + ' ' + numbers[j]);
    }
}
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + coordinates.join(' | ') + ' ;'


var recognizing, currPlayer;
var secondCoord = true;
var index = 0;
var source = '', target = '';
var recognition = new webkitSpeechRecognition();
var speechRecognitionList = new webkitSpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
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
        if (secondCoord) {
            source = results[0];
            target = results[1];
        }
        else if (coordinates.includes(results[0].split('').join(' '))) {
            target = results[0];
            secondCoord = true;
        }
        // handles if user says one coordinate and then another coordinate
        if (target === undefined && coordinates.includes(source.split('').join(' '))) {
            secondCoord = false;
        }
        // restarts the game
        if (source === 'new' && target === 'game') {
            location.reload(false);
        }
        // changes the game movement (can be either fast or slow)
        else if (source === 'move' && (target === 'fast' || target === 'slow')) {
            config.position = board.position();
            config.moveSpeed = target;
            board = Chessboard('board', config);
            fixOrientation();
        }
        // flips board
        else if (source === 'rotate' && target === 'board') {
            board.orientation('flip');
        }
        else if (source === 'toggle' && target === 'orientation') {
            enableFlipping = !enableFlipping;
            if (enableFlipping) fixOrientation();
        }
        // handles if user says two coordinates
        else if (secondCoord) {
            board.move(source + '-' + target);
        }
        return true;
    }
    return false;
}

// changes orientation to whoever's turn it is
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
