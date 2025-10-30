# Server.js to Frontend Implementation Mapping

This document shows how each feature from `server.js` has been implemented in the frontend.

## Quick Play Mode

### Server (server.js)
```javascript
socket.on("quickPlayFind", (name) => {
  // Generate player name
  // Add to waiting queue
  // Pair when 2 players available
  // Create game room
  // Emit gameStart
});
```

### Frontend (Quick.jsx)
```javascript
function handleFindMatch() {
  socketService.emit('quickPlayFind', localName);
}

useEffect(() => {
  socketService.on('playerName', (name) => setPlayerName(name));
  socketService.on('gameStart', (game) => {
    // Set up game state
    // Determine player symbol
    // Start game
  });
});
```

**Status:** ✅ Fully Implemented

---

## Drag & Drop Mode

### Server Enhancement (server-enhanced.js)
```javascript
socket.on("makeMove", ({ roomId, index, symbol, board, xPieces, oPieces }) => {
  // Update game state
  // Broadcast to room
  io.to(roomId).emit("boardUpdate", { board, xPieces, oPieces });
});
```

### Frontend (DragDrop.jsx)
```javascript
function handleDrop(e, index) {
  // Local drag-drop logic
  // If online mode:
  socketService.emit('makeMove', { 
    roomId, index, symbol, board, xPieces, oPieces 
  });
}

useEffect(() => {
  socketService.on('boardUpdate', ({ board, xPieces, oPieces }) => {
    setBoard(board);
    setXPieces(xPieces);
    setOPieces(oPieces);
  });
});
```

**Status:** ✅ Fully Implemented (with local/online mode selection)

---

## Invite Player System

### Server (server.js)
```javascript
socket.on("invitePlayFind", (name) => {
  // Add to invite players list
  // Broadcast updated player list
});

socket.on("invitePlayer", (invitedPlayerId) => {
  // Store pending invite
  // Notify invited player
});

socket.on("acceptInvite", (invitingPlayerId) => {
  // Create game room
  // Notify both players
  // Start game
});

socket.on("declineInvite", (invitingPlayerId) => {
  // Remove pending invite
  // Notify inviting player
});
```

### Frontend (Invite.jsx)
```javascript
function handleJoinLobby() {
  socketService.emit('invitePlayFind', localName);
}

function handleInvitePlayer(playerId) {
  socketService.emit('invitePlayer', playerId);
}

function handleAcceptInvite(invitingPlayerId) {
  socketService.emit('acceptInvite', invitingPlayerId);
}

function handleDeclineInvite(invitingPlayerId) {
  socketService.emit('declineInvite', invitingPlayerId);
}

useEffect(() => {
  socketService.on('playerName', (players) => {
    setAvailablePlayers(players);
  });
  
  socketService.on('invitationReceived', (inviterId, inviterName) => {
    setPendingInvites(prev => [...prev, { id: inviterId, name: inviterName }]);
  });
  
  socketService.on('invitationAccepted', (playerId, playerName) => {
    setGameStarted(true);
    setOpponent(playerName);
  });
});
```

**Status:** ✅ Fully Implemented

---

## Tournament Mode

### Server (server.js)
```javascript
socket.on("tournamentFind", (name) => {
  // Add to tournament queue
  // Join tournament room
  // When 8 players: start tournament
});

function startTournament() {
  const groups = createGroups(tournamentPlayers.slice(0, 8));
  
  groups.forEach((group, groupIndex) => {
    // Notify players of groups
    // Create bracket games
    // Start matches
  });
}

function createGroups(players) {
  // Shuffle players
  // Create 4 groups of 2
  return groups;
}

function createBracket(players) {
  // Pair players for matches
  return bracket;
}
```

### Frontend (Tournament.jsx)
```javascript
function handleJoinTournament() {
  socketService.emit('tournamentFind', localName);
}

useEffect(() => {
  socketService.on('playerName', (players) => {
    setTournamentPlayers(players);
  });
  
  socketService.on('newTournamentPlayer', (newPlayerName) => {
    setTournamentPlayers(prev => [...prev, { name: newPlayerName }]);
  });
  
  socketService.on('groupStart', (groupPlayers, groupIndex, playerIndex) => {
    setGroupInfo({ players: groupPlayers, groupIndex, playerIndex });
  });
  
  socketService.on('gameStart', (game) => {
    setGameStarted(true);
    // Set up match
  });
  
  socketService.on('tournamentWinner', (winnerName) => {
    setTournamentWinner(winnerName);
  });
});
```

**Status:** ✅ Fully Implemented

---

## Two Player (Room-Based)

### Server (Existing - Multiplayer.jsx/Double.jsx)
```javascript
socket.on("joinRoom", (roomId) => {
  socket.join(roomId);
  // Handle room logic
});
```

### Frontend (Multiplayer.jsx + Double.jsx)
```javascript
// Multiplayer.jsx - Room creation/joining
function handleCreateRoom() {
  const newRoomId = generateId();
  socket.emit('joinRoom', newRoomId);
  navigate(`/play/double/roomId/${newRoomId}`);
}

// Double.jsx - Game play
useEffect(() => {
  socket.emit('joinRoom', { roomId, name });
  
  socket.on('gameStart', ({ players, startingPlayer }) => {
    // Set up game
  });
  
  socket.on('updateGame', ({ board, currentPlayer }) => {
    setBoard(board);
    setCurrentPlayer(currentPlayer);
  });
});
```

**Status:** ✅ Already Implemented (kept as-is)

---

## Core Game Logic

### Server (server.js)
```javascript
function handleEndTurn(socketId, game) {
  // Validate turn
  // Increment turn counter
  // Broadcast turn update
  // Check for winner
  // Emit gameEnd if winner found
}

function checkWinner(board) {
  // Check all win patterns
  // Return winner or null
}

function handlePlayerDisconnect(disconnectedSocketId) {
  // Remove from queues
  // Notify opponents
  // Clean up games
}
```

### Frontend (All Game Components)
```javascript
function calculateWinner(squares) {
  for (let pattern of Patterns) {
    const [a, b, c] = pattern;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function handleClick(index) {
  if (!isMyTurn || board[index] || winner) return;
  
  const newBoard = [...board];
  newBoard[index] = mySymbol;
  setBoard(newBoard);
  
  socketService.emit('makeMove', { roomId, index, symbol: mySymbol, board: newBoard });
  socketService.emit('endTurn');
}

useEffect(() => {
  socketService.on('turn', (turn) => {
    setIsMyTurn(turn % 2 === myIndex);
  });
  
  socketService.on('gameEnd', (winnerName, losers) => {
    setWinner(winnerName === playerName ? mySymbol : opponentSymbol);
  });
  
  socketService.on('opponentDisconnected', () => {
    alert('Opponent disconnected');
    resetToLobby();
  });
});
```

**Status:** ✅ Fully Implemented

---

## Socket Service Architecture

### Server (server.js)
```javascript
io.on("connection", (socket) => {
  // Handle all socket events
  
  socket.on("disconnect", () => {
    // Cleanup
  });
});
```

### Frontend (socketService.js)
```javascript
class SocketService {
  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true
    });
  }
  
  emit(event, data) {
    this.socket.emit(event, data);
  }
  
  on(event, callback) {
    this.socket.on(event, callback);
  }
  
  removeAllListeners(event) {
    this.socket.removeAllListeners(event);
  }
}

export default new SocketService();
```

**Status:** ✅ Fully Implemented (Singleton pattern)

---

## Feature Comparison Table

| Feature | Server.js | Frontend | Status |
|---------|-----------|----------|--------|
| Quick Play Matchmaking | ✅ | ✅ Quick.jsx | Complete |
| Drag & Drop | ⚠️ Partial | ✅ DragDrop.jsx | Enhanced |
| Invite System | ✅ | ✅ Invite.jsx | Complete |
| Tournament | ✅ | ✅ Tournament.jsx | Complete |
| Room-Based Play | ✅ | ✅ Multiplayer.jsx/Double.jsx | Complete |
| Turn Management | ✅ | ✅ All components | Complete |
| Winner Detection | ✅ | ✅ All components | Complete |
| Disconnect Handling | ✅ | ✅ All components | Complete |
| Socket Management | ✅ | ✅ socketService.js | Complete |
| Board Sync | ✅ | ✅ All components | Complete |

---

## Event Flow Diagrams

### Quick Match Flow
```
Player 1                    Server                      Player 2
   |                          |                            |
   |--quickPlayFind---------->|                            |
   |<-----playerName----------|                            |
   |                          |<----quickPlayFind----------|
   |                          |------playerName----------->|
   |                          |                            |
   |<-----gameStart-----------|------gameStart------------>|
   |<-----turn(0)-------------|------turn(0)-------------->|
   |                          |                            |
   |--makeMove--------------->|                            |
   |--endTurn---------------->|                            |
   |                          |------boardUpdate---------->|
   |                          |------turn(1)-------------->|
```

### Invite Flow
```
Player A                    Server                      Player B
   |                          |                            |
   |--invitePlayFind--------->|                            |
   |<-----playerName----------|                            |
   |                          |<----invitePlayFind---------|
   |<-----playerName----------|------playerName----------->|
   |                          |                            |
   |--invitePlayer(B)-------->|                            |
   |                          |--invitationReceived(A)---->|
   |                          |                            |
   |                          |<----acceptInvite(A)--------|
   |<--invitationAccepted(B)--|--invitationAccepted(A)---->|
   |<-----gameStart-----------|------gameStart------------>|
```

### Tournament Flow
```
8 Players                   Server
   |                          |
   |--tournamentFind--------->|
   |<-----playerName----------|
   |<--newTournamentPlayer----|
   |                          |
   [When 8 players joined]    |
   |                          |
   |<-----groupStart----------|  (Groups A, B, C, D)
   |<-----gameStart-----------|  (4 simultaneous matches)
   |                          |
   [Matches complete]         |
   |                          |
   |<--tournamentWinner-------|  (Final winner)
```

---

## Code Reusability

### Shared Patterns Across Components

1. **Socket Connection**
   ```javascript
   useEffect(() => {
     const socket = socketService.connect();
     // Setup listeners
     return () => {
       // Cleanup listeners
     };
   }, [dependencies]);
   ```

2. **Winner Detection**
   ```javascript
   function calculateWinner(squares) {
     for (let pattern of Patterns) {
       const [a, b, c] = pattern;
       if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
         return squares[a];
       }
     }
     return null;
   }
   ```

3. **Move Handling**
   ```javascript
   function handleClick(index) {
     if (!isMyTurn || board[index] || winner) return;
     const newBoard = [...board];
     newBoard[index] = mySymbol;
     setBoard(newBoard);
     socketService.emit('makeMove', { /* data */ });
     socketService.emit('endTurn');
   }
   ```

---

## Summary

✅ **All server.js features have been implemented in the frontend**

The implementation includes:
- 5 complete game modes
- Real-time multiplayer synchronization
- Centralized socket management
- Turn-based gameplay
- Winner detection
- Disconnect handling
- Multiple simultaneous games support

The frontend now fully leverages the server's multiplayer capabilities with a clean, component-based architecture.
