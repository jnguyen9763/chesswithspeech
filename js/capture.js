// Gloria Kitchens and Jacqueline Nguyen
// gloria.kitchens@tufts.edu and jacqueline.nguyen@tufts.edu
// handles assigning players the pieces that they capture
// and displaying previous moves

var whiteMove = document.querySelector("#left h3");
var blackMove = document.querySelector("#right h3");
var white = document.querySelectorAll("#white > .col");
var black = document.querySelectorAll("#black > .col");
var whiteIndex = 0;
var blackIndex = 0;

var piece = {
    p: ''
}

// adds captured piece to player's side
function showCapturedPiece(piece) {
    if (piece.color === 'w') {
        black[blackIndex].innerHTML = 
        "<img src='img/chesspieces/wikipedia/" + piece.color + piece.type.toUpperCase() + ".png' alt='piece'>";
        blackIndex++;
    }
    else {
        white[whiteIndex].innerHTML = 
        "<img src='img/chesspieces/wikipedia/" + piece.color + piece.type.toUpperCase() + ".png' alt='piece'>";
        whiteIndex++;
    }
}

// adds player's move to their respective side
function displayPreviousMove(color, move) {
    if (color === 'w') {
        whiteMove.innerHTML = move;
    }
    else {
        blackMove.innerHTML = move;
    }
}
