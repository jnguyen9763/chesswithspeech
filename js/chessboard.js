// source: https://chessboardjs.com/examples#5000
var board = null;
var game = new Chess();
var stat = document.getElementById('status');
var position = 'start';
var enableFlipping = true;

function onMoveEnd(oldBoard, newBoard) {
  var original = game.get(source);
  var potential = game.get(target);

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) {
    board.position(position);
  }
  else {
    var move = original.type.toUpperCase() + ' to ' + target.toUpperCase();
    displayPreviousMove(currPlayer, move);
    if (potential !== null) {
      showCapturedPiece(potential);
    }
    position = board.position();
    if (enableFlipping) {
      board.orientation('flip');
    }
  }
  updateStatus();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}

function updateStatus() {
  var status;
  var moveColor = 'White';

  if (game.turn() === 'b') {
    moveColor = 'Black';
  }
  if (game.in_checkmate()) {
    // checkmate?
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }
  else if (game.in_draw()) {
    // draw?
    status = 'Game over, drawn position';
  }
  else if (game.in_check()) {
    // check?
    status = moveColor + ' is in check';
  }
  else {
    // game still on
    status = moveColor + ' to move';
  }

  stat.innerHTML = status;
}

var config = {
  position: 'start',
  onSnapEnd: onSnapEnd,
  onMoveEnd: onMoveEnd,
  moveSpeed: 'slow'
}

board = Chessboard('board', config);

updateStatus();

// document.getElementById('test').innerHTML = '<img src="img/chesspieces/wikipedia/bB.png"/>'
