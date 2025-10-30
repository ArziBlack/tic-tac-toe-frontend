import http from "http";
import express from "express";
import { log } from "console";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const io = new Server(server, { cors: { origin: "*" } });

let games = [];
let invitePlayers = [];
let pendingInvites = {};
let waitingPlayers = [];
let tournamentPlayers = [];

io.on("connection", (socket) => {
  log(`User connected on server port socket: ${socket.id}`);
  log("active Games Length:" + games.length);

  /***************************** Start of Quick Game  ********************************/

  // Find all Quick Play Players and Pair
  socket.on("quickPlayFind", (name) => {
    const id = generateId();
    const quickPlayerName = `Player_${name}_${id}`;
    log(
      `Player_${name}_${id} with socketId "${socket.id}" is interested in a Quick Game.`
    );
    waitingPlayers.push({ name: quickPlayerName, socketId: socket.id });

    // Notify the client about their player name
    socket.emit("playerName", quickPlayerName);

    // Pair Players for a Quick Game
    if (waitingPlayers.length >= 2) {
      const playerX = waitingPlayers.shift();
      const playerO = waitingPlayers.shift();
      const roomId = genRoomId();
      
      // Join both players to the room
      io.sockets.sockets.get(playerX.socketId)?.join(roomId);
      io.sockets.sockets.get(playerO.socketId)?.join(roomId);

      const game = {
        players: [playerX, playerO],
        currentTurn: 0,
        room: roomId,
        board: Array(9).fill(null),
        xPieces: [1, 2, 3],
        oPieces: [1, 2, 3]
      };

      // check game object
      log(game);

      // Notify players about the start of the game
      game.players.forEach((player) => {
        io.to(player.socketId).emit("socket", player.socketId);
        io.to(player.socketId).emit("gameStart", game);
      });

      games.push(game);

      // Emit the initial turn to the paired players
      game.players.forEach((player) => {
        io.to(player.socketId).emit("turn", game.currentTurn);
      });
    }
    log("waiting Players Length:" + waitingPlayers.length);
  });

  // Handle moves in Quick Game
  socket.on("makeMove", ({ roomId, index, symbol, board, xPieces, oPieces }) => {
    const game = games.find(g => g.room === roomId);
    if (game) {
      game.board = board;
      if (xPieces) game.xPieces = xPieces;
      if (oPieces) game.oPieces = oPieces;
      
      // Broadcast board update to all players in the room
      io.to(roomId).emit("boardUpdate", { 
        board: game.board, 
        turn: game.currentTurn,
        xPieces: game.xPieces,
        oPieces: game.oPieces
      });
    }
  });

  // Handle end turn
  socket.on("endTurn", () => {
    const game = games.find(g => 
      g.players.some(p => p.socketId === socket.id)
    );
    
    if (game) {
      handleEndTurn(socket.id, game);
    }
  });

  /************************************* End of Quick Game  **************************************/

  /****************************** Start of Invite Player Game  ***********************************/

  // Find all Invite Play Players
  socket.on("invitePlayFind", (name) => {
    const id = generateId();
    const invitePlayerName = `Player_${name}_${id}`;
    log(
      `Player ${name}_${id} with socketId "${socket.id}" is interested in a Game Invite.`
    );
    invitePlayers.push({ name: invitePlayerName, socketId: socket.id });

    // Notify the client about their player name and all available players
    socket.emit("playerName", invitePlayers);
    
    // Notify all other invite players about the new player
    socket.broadcast.emit("playerName", invitePlayers);
  });
  log("invite Players Length:" + invitePlayers.length);

  // Find All Waiting Tournament Players
  socket.on("tournamentFind", (name) => {
    const id = generateId();
    const tournamentPlayerName = `Player_${name}_${id}`;
    log(
      `Player ${name}_${id} with socketId "${socket.id}" is interested in the tournament.`
    );
    tournamentPlayers.push({ name: tournamentPlayerName, socketId: socket.id });

    // Join the player to a dedicated room for tournament players
    socket.join("tournamentRoom");

    // Notify the client about their player name
    socket.emit("playerName", tournamentPlayers);

    // Notify all tournament players about the new participant
    io.to("tournamentRoom").emit("newTournamentPlayer", tournamentPlayerName);

    // Try to start tournament if we have 8 players
    if (tournamentPlayers.length >= 8) {
      startTournament();
    }
  });
  log("tournament Players Length:" + tournamentPlayers.length);

  /****************************** End of Invite Player Game  ***********************************/

  /******* Start of Invite player  **********************/
  // Listen for an invitation to play with another player
  socket.on("invitePlayer", (invitedPlayerId) => {
    // Check if the invited player is available
    const invitedPlayer = invitePlayers.find(
      (player) => player.socketId === invitedPlayerId
    );
    const invitingPlayer = invitePlayers.find(
      (player) => player.socketId === socket.id
    );
    
    if (invitedPlayer && invitingPlayer) {
      // Store the pending invite
      pendingInvites[socket.id] = invitedPlayerId;

      // Notify the invited player about the invitation
      io.to(invitedPlayerId).emit("invitationReceived", socket.id, invitingPlayer.name);
    }
  });

  // Listen for an acceptance of the invitation
  socket.on("acceptInvite", (invitingPlayerId) => {
    // Check if the inviting player is still waiting
    const invitingPlayer = invitePlayers.find(
      (player) => player.socketId === invitingPlayerId
    );
    const acceptingPlayer = invitePlayers.find(
      (player) => player.socketId === socket.id
    );
    
    if (invitingPlayer && acceptingPlayer) {
      // Remove the pending invite
      delete pendingInvites[invitingPlayerId];

      const roomId = genRoomId();
      
      // Join both players to the room
      io.sockets.sockets.get(invitingPlayerId)?.join(roomId);
      io.sockets.sockets.get(socket.id)?.join(roomId);

      // Notify both players about the accepted invitation
      io.to(invitingPlayerId).emit("invitationAccepted", socket.id, acceptingPlayer.name);
      io.to(socket.id).emit("invitationAccepted", invitingPlayerId, invitingPlayer.name);

      // Create a game for the two players
      const game = {
        players: [
          { socketId: invitingPlayerId, name: invitingPlayer.name },
          { socketId: socket.id, name: acceptingPlayer.name },
        ],
        currentTurn: 0,
        room: roomId,
        board: Array(9).fill(null)
      };

      games.push(game);

      // Emit the initial turn to the paired players
      game.players.forEach((player) => {
        io.to(player.socketId).emit("turn", game.currentTurn);
      });
    }
  });

  // Listen for a decline of the invitation
  socket.on("declineInvite", (invitingPlayerId) => {
    const decliningPlayer = invitePlayers.find(
      (player) => player.socketId === socket.id
    );
    
    // Remove the pending invite
    delete pendingInvites[invitingPlayerId];

    // Notify the inviting player about the declined invitation
    io.to(invitingPlayerId).emit("invitationDeclined", socket.id, decliningPlayer?.name);
  });

  /******* End of Invite player  ************************/

  // Disconnect Players that Exited or Lost Connection to the Game Server
  socket.on("disconnect", () => {
    log(`User disconnected: ${socket.id}`);
    handlePlayerDisconnect(socket.id);

    // Remove any pending invites involving the disconnected player
    removeInvites(socket.id);
  });
});

/** ************************Game Logic and Functions****************************** */
const genRoomId = () => {
  var result = "";
  var hexChars = "0123456789abcdef";
  for (var i = 0; i < 6; i += 1) {
    result += hexChars[Math.floor(Math.random() * 16)];
  }
  return result;
};

const generateId = () => {
  const id = Math.floor(Math.random() * 2000);
  return id;
};

function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return 'X' or 'O'
    }
  }
  return null;
}

function handlePlayerDisconnect(disconnectedSocketId) {
  // Remove the player from waitingPlayers
  waitingPlayers = waitingPlayers.filter(
    (player) => player.socketId !== disconnectedSocketId
  );

  // Remove from invite players
  invitePlayers = invitePlayers.filter(
    (player) => player.socketId !== disconnectedSocketId
  );

  // Remove from tournament players
  tournamentPlayers = tournamentPlayers.filter(
    (player) => player.socketId !== disconnectedSocketId
  );

  // Remove the player from active games and notify the other player
  games.forEach((game) => {
    const disconnectedPlayer = game.players.find(
      (player) => player.socketId === disconnectedSocketId
    );
    if (disconnectedPlayer) {
      const otherPlayer = game.players.find(
        (player) => player !== disconnectedPlayer
      );

      if (otherPlayer) {
        io.to(otherPlayer.socketId).emit("opponentDisconnected");
      }
      games = games.filter((g) => g !== game);
    }
  });
}

function handleEndTurn(socketId, game) {
  const currentPlayer = game.players.find(
    (player) => player.socketId === socketId
  );

  // Only allow the current player to end their turn
  if (currentPlayer && currentPlayer === game.players[game.currentTurn % 2]) {
    // Increment the turn and broadcast the new turn to all clients
    game.currentTurn++;
    
    // Broadcast to room if available, otherwise to individual players
    if (game.room) {
      io.to(game.room).emit("turn", game.currentTurn);
    } else {
      game.players.forEach((player) => {
        io.to(player.socketId).emit("turn", game.currentTurn);
      });
    }

    // Check for a winner
    const winner = checkWinner(game.board);
    if (winner) {
      const winningPlayer = game.players.find(p => {
        const playerIndex = game.players.indexOf(p);
        return (playerIndex === 0 && winner === 'X') || (playerIndex === 1 && winner === 'O');
      });

      // Notify players about the winner
      if (game.room) {
        io.to(game.room).emit("gameEnd", winningPlayer?.name, 
          game.players.filter((p) => p !== winningPlayer).map((p) => p.name)
        );
      } else {
        game.players.forEach((player) => {
          io.to(player.socketId).emit(
            "gameEnd",
            winningPlayer?.name,
            game.players.filter((p) => p !== winningPlayer).map((p) => p.name)
          );
        });
      }

      // Remove the game from the active games list
      games = games.filter((g) => g !== game);
    }
  }
}

function removeInvites(disconnectedSocketId) {
  for (const invitingPlayerId in pendingInvites) {
    if (pendingInvites[invitingPlayerId] === disconnectedSocketId) {
      // Notify the inviting player about the declined invitation
      io.to(invitingPlayerId).emit(
        "invitationDeclined",
        disconnectedSocketId,
        "Player"
      );

      // Remove the pending invite
      delete pendingInvites[invitingPlayerId];
    }
  }
}

function startTournament() {
  const groups = createGroups(tournamentPlayers.slice(0, 8));
  console.log("Starting tournament with groups:", groups);

  // Notify players about the start of the group stage
  groups.forEach((group, groupIndex) => {
    group.forEach((player, playerIndex) => {
      io.to(player.socketId).emit(
        "groupStart",
        group.map((p) => p.name),
        groupIndex + 1,
        playerIndex + 1
      );
    });

    const groupGames = createBracket(group);
    console.log("Group games:", groupGames);
    
    groupGames.forEach(game => {
      game.board = Array(9).fill(null);
      game.room = genRoomId();
      
      // Join players to room
      game.players.forEach(player => {
        io.sockets.sockets.get(player.socketId)?.join(game.room);
      });
    });
    
    games.push(...groupGames);

    // Emit game start and initial turn
    groupGames.forEach((game) => {
      game.players.forEach((player) => {
        io.to(player.socketId).emit("gameStart", game);
        io.to(player.socketId).emit("turn", game.currentTurn);
      });
    });
  });

  tournamentPlayers = tournamentPlayers.slice(8);
}

export function createGroups(players) {
  const groups = [];
  const groupNames = ["A", "B", "C", "D"]; // Customize as needed

  // Shuffle players to ensure random grouping
  players.sort(() => Math.random() - 0.5);

  for (let i = 0; i < groupNames.length; i++) {
    const group = players.splice(0, 2);
    groups.push(
      group.map((player) => ({ ...player, groupName: groupNames[i] }))
    );
  }

  return groups;
}

export function createBracket(players) {
  const bracket = [];
  for (let i = 0; i < players.length; i += 2) {
    const game = {
      players: [players[i], players[i + 1]],
      currentTurn: 0,
    };
    bracket.push(game);
    console.log("Created bracket game:", game);
  }
  return bracket;
}

server.listen(PORT, () =>
  log(`Server running on port ${PORT} => http://localhost:5000`)
);
