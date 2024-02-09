const socket = io();

// Emit an event to express interest in participating in the tournament
document.getElementById('joinTournamentButton').addEventListener('click', () => {
    socket.emit('joinTournament');
});

// Emit an event to invite another player
document.getElementById('invitePlayerButton').addEventListener('click', () => {
    const invitedPlayerId = prompt('Enter the ID of the player you want to invite:');
    socket.emit('invitePlayer', invitedPlayerId);
});

// Listen for an invitation received
socket.on('invitationReceived', (invitingPlayerId, invitingPlayerName) => {
    const acceptInvitation = confirm(`${invitingPlayerName} has invited you to play. Do you accept?`);
    if (acceptInvitation) {
        // Accept the invitation
        socket.emit('acceptInvite', invitingPlayerId);
    } else {
        // Decline the invitation
        socket.emit('declineInvite', invitingPlayerId);
    }
});

// Listen for an accepted invitation
socket.on('invitationAccepted', (otherPlayerId, otherPlayerName) => {
    console.log(`${otherPlayerName} has accepted your invitation. Starting the game...`);
    // Handle the game start as needed
});

// Listen for a declined invitation
socket.on('invitationDeclined', (otherPlayerId, otherPlayerName) => {
    console.log(`${otherPlayerName} has declined your invitation.`);
    // Handle the declined invitation as needed
});

// ... (other client-side code)
