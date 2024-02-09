const socket = io();

// Emit an event to express interest in participating in the tournament
document.getElementById('joinTournamentButton').addEventListener('click', () => {
    socket.emit('joinTournament');
});

// Listen for the tournamentWinner event to handle the end of the tournament
socket.on('tournamentWinner', (winnerName) => {
    console.log(`Tournament winner: ${winnerName}`);
    // Handle the tournament winner announcement as needed
});

// ... (other client-side code)
