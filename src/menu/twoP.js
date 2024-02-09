$(document).ready(() => {
    const socket = io();
  
    let player;
    let currentPlayer;
  
    // Set up the game board
    for (let i = 0; i < 9; i++) {
      $('#board').append(`<div class="box" data-index="${i}"></div>`);
    }
  
    // Handle player assignment
    socket.on('player', (playerId) => {
      player = playerId;
      $('#board').append(`<p>You are Player ${player}</p>`);
    });
  
    // Handle board updates
    socket.on('updateBoard', (board) => {
      updateUI(board);
    });
  
    // Handle next turn
    socket.on('nextTurn', (nextPlayer) => {
      currentPlayer = nextPlayer;
      if (player === currentPlayer) {
        $('#board').append('<p>Your turn!</p>');
      } else {
        $('#board').append('<p>Waiting for opponent...</p>');
      }
    });
  
    // Handle box click event
    $('#board').on('click', '.box', function () {
      if (player === currentPlayer) {
        const index = $(this).data('index');
        socket.emit('move', index);
      }
    });
  
    // Function to update the UI based on the current board state
    function updateUI(board) {
      $('.box').each((index, element) => {
        const value = board[index];
        $(element).text(value);
      });
    }
  });
  