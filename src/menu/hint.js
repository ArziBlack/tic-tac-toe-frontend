const socket = io();

let playerName;

// Listen for the 'playerName' event
socket.on('playerName', (name) => {
    playerName = name;
    document.getElementById('playerName').innerText = `You are ${playerName}`;
});

// Listen for the 'turn' event
socket.on('turn', (turn) => {
    console.log(`Current Turn: ${turn}`);

    // Enable the 'End Turn' button only for the active player
    document.getElementById('endTurnButton').disabled = turn % 2 !== players.indexOf(playerName);
});

// Listen for the 'playerDisconnected' event
socket.on('playerDisconnected', (disconnectedPlayer) => {
    console.log(`Player ${disconnectedPlayer} disconnected`);
});

// Emit the 'endTurn' event when the player wants to end their turn
document.getElementById('endTurnButton').addEventListener('click', () => {
    socket.emit('endTurn');
});
