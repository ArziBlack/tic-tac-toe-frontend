const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const waitingPlayers = [];
const activeGames = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinWaitingRoom', () => {
    waitingPlayers.push(socket.id);

    // Check if there are enough players to start the game (e.g., 2 players)
    if (waitingPlayers.length >= 2) {
      const playersInGame = waitingPlayers.splice(0, 2); // Get the first two players

      // Create player objects with unique IDs
      const player1 = { id: playersInGame[0], number: 'player1' };
      const player2 = { id: playersInGame[1], number: 'player2' };

      // Store players in the activeGames object
      activeGames[player1.id] = player1;
      activeGames[player2.id] = player2;

      // Emit player information to clients
      io.to(player1.id).emit('player', player1);
      io.to(player2.id).emit('player', player2);
    }
  });

  socket.on('movePaddle', (data) => {
    socket.broadcast.emit('movePaddle', data);
  });

  socket.on('moveBall', (data) => {
    socket.broadcast.emit('moveBall', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');

    // Remove from waiting room if disconnected before game starts
    const index = waitingPlayers.indexOf(socket.id);
    if (index !== -1) {
      waitingPlayers.splice(index, 1);
    }

    // Remove from active game if disconnected after the game starts
    if (activeGames[socket.id]) {
      delete activeGames[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
