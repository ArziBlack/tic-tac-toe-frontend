# Multiplayer Tic-Tac-Toe Implementation Guide

## Overview
This implementation adds full multiplayer functionality to your Tic-Tac-Toe game with 5 game modes:
1. **Quick Match** - Instant matchmaking with random opponents
2. **Drag & Drop** - Local or online play with drag-and-drop mechanics
3. **Two Player** - Room-based multiplayer with custom room codes
4. **Invite Player** - Challenge specific players from a lobby
5. **Tournament** - 8-player bracket tournament system

## Architecture

### Frontend Structure
```
src/
├── services/
│   └── socketService.js          # Centralized Socket.IO management
├── menu/
│   ├── Quick.jsx                 # Quick match with matchmaking
│   ├── DragDrop.jsx              # Drag & drop (local + online)
│   ├── Multiplayer.jsx           # Room-based multiplayer
│   ├── Invite.jsx                # Player invitation system
│   └── Tournament.jsx            # Tournament bracket mode
├── mode/
│   └── Double.jsx                # Two-player game room
└── components/
    └── Heros.jsx                 # Updated home page with all modes
```

### Backend Structure
```
server-enhanced.js                # Enhanced server with all multiplayer features
```

## Key Features Implemented

### 1. Socket Service (socketService.js)
- Centralized socket connection management
- Automatic reconnection handling
- Event listener cleanup
- Singleton pattern for consistent socket instance

### 2. Quick Match Mode
**Frontend (Quick.jsx):**
- Player name input
- Matchmaking queue
- Real-time game synchronization
- Turn-based gameplay
- Winner detection

**Backend Events:**
- `quickPlayFind` - Join matchmaking queue
- `playerName` - Receive assigned player name
- `gameStart` - Game paired and started
- `turn` - Turn updates
- `makeMove` - Broadcast moves
- `boardUpdate` - Sync board state
- `endTurn` - Switch turns
- `gameEnd` - Game completion
- `opponentDisconnected` - Handle disconnects

### 3. Drag & Drop Mode
**Features:**
- Mode selection (local vs online)
- Limited pieces (3 per player)
- Drag-and-drop interface
- Online multiplayer support
- Piece tracking across network

**Implementation:**
- Extends local drag-drop with socket events
- Syncs piece availability between players
- Broadcasts drag-drop moves in real-time

### 4. Invite Player Mode
**Features:**
- Player lobby with available players list
- Send/receive invitations
- Accept/decline invitations
- Direct player-to-player matching

**Backend Events:**
- `invitePlayFind` - Join invite lobby
- `invitePlayer` - Send invitation
- `invitationReceived` - Receive invitation
- `acceptInvite` - Accept invitation
- `declineInvite` - Decline invitation
- `invitationAccepted` - Both players notified

### 5. Tournament Mode
**Features:**
- 8-player bracket system
- Group stage (4 groups of 2)
- Automatic pairing
- Winner advancement
- Tournament winner announcement

**Backend Events:**
- `tournamentFind` - Join tournament queue
- `newTournamentPlayer` - Player joined notification
- `groupStart` - Group assignments
- `tournamentWinner` - Final winner

## Socket Events Reference

### Client → Server
| Event | Data | Description |
|-------|------|-------------|
| `quickPlayFind` | `name` | Join quick match queue |
| `invitePlayFind` | `name` | Join invite lobby |
| `tournamentFind` | `name` | Join tournament |
| `invitePlayer` | `playerId` | Send invitation |
| `acceptInvite` | `invitingPlayerId` | Accept invitation |
| `declineInvite` | `invitingPlayerId` | Decline invitation |
| `makeMove` | `{roomId, index, symbol, board, xPieces, oPieces}` | Make a move |
| `endTurn` | - | End current turn |
| `joinRoom` | `roomId` | Join specific room |

### Server → Client
| Event | Data | Description |
|-------|------|-------------|
| `playerName` | `name` or `players[]` | Assigned player name |
| `gameStart` | `game` | Game started |
| `turn` | `turnNumber` | Turn update |
| `boardUpdate` | `{board, turn, xPieces, oPieces}` | Board state sync |
| `gameEnd` | `winnerName, losers[]` | Game finished |
| `opponentDisconnected` | - | Opponent left |
| `invitationReceived` | `inviterId, inviterName` | Received invitation |
| `invitationAccepted` | `playerId, playerName` | Invitation accepted |
| `invitationDeclined` | `playerId, playerName` | Invitation declined |
| `groupStart` | `players[], groupIndex, playerIndex` | Tournament group |
| `newTournamentPlayer` | `playerName` | New tournament player |
| `tournamentWinner` | `winnerName` | Tournament winner |

## Setup Instructions

### 1. Install Dependencies
```bash
# Frontend (if not already installed)
npm install socket.io-client

# Backend (if not already installed)
npm install socket.io express
```

### 2. Environment Configuration
Create `.env` file in frontend:
```env
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Start Backend Server
```bash
# Use the enhanced server
node server-enhanced.js
```

### 4. Start Frontend
```bash
npm start
```

## Game Flow Examples

### Quick Match Flow
1. Player enters name
2. Clicks "Find Match"
3. Server adds to queue
4. When 2 players available, server pairs them
5. Both players receive `gameStart` event
6. Players take turns making moves
7. Moves broadcast via `makeMove` and `boardUpdate`
8. Winner detected, `gameEnd` emitted

### Invite Flow
1. Player A joins lobby
2. Player B joins lobby
3. Both see each other in available players
4. Player A invites Player B
5. Player B receives invitation
6. Player B accepts
7. Game starts between A and B

### Tournament Flow
1. 8 players join tournament queue
2. Server creates 4 groups (A, B, C, D)
3. Each group has 2 players
4. Players notified of their group
5. Matches start simultaneously
6. Winners advance to next round
7. Final winner announced

## Testing Checklist

- [ ] Quick match pairs players correctly
- [ ] Drag & drop syncs pieces online
- [ ] Room codes work for two-player mode
- [ ] Invitations send/receive properly
- [ ] Tournament starts with 8 players
- [ ] Disconnects handled gracefully
- [ ] Turn switching works correctly
- [ ] Winner detection accurate
- [ ] Board state syncs properly
- [ ] Multiple games can run simultaneously

## Troubleshooting

### Socket Connection Issues
- Check CORS settings in server
- Verify `REACT_APP_SOCKET_URL` is correct
- Ensure server is running on correct port

### Game State Desync
- Check `boardUpdate` events are emitting
- Verify `makeMove` includes full board state
- Ensure turn management is consistent

### Matchmaking Not Working
- Check player arrays are updating
- Verify socket IDs are valid
- Ensure room joining is successful

## Future Enhancements

1. **Spectator Mode** - Watch ongoing games
2. **Chat System** - In-game messaging
3. **Leaderboards** - Track wins/losses
4. **Replay System** - Review past games
5. **Custom Rules** - Configurable game variants
6. **Mobile Support** - Touch-optimized controls
7. **Animations** - Smooth move transitions
8. **Sound Effects** - Audio feedback
9. **Themes** - Customizable appearance
10. **AI Opponents** - Single-player vs computer

## Notes

- All components use the centralized `socketService`
- Socket cleanup happens in `useEffect` return
- Game state is managed both client and server-side
- Server is authoritative for turn validation
- Rooms are used for efficient event broadcasting
- Player names are auto-generated with unique IDs
