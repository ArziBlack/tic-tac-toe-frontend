# Quick Start Guide - Multiplayer Tic-Tac-Toe

## What's Been Implemented

Your Tic-Tac-Toe game now has **5 multiplayer modes**:

1. ⚡ **Quick Match** - Instant random matchmaking
2. 🎯 **Drag & Drop** - Local or online with drag-drop mechanics  
3. 👥 **Two Player** - Room-based play with custom codes
4. 💌 **Invite Player** - Challenge specific players
5. 🏆 **Tournament** - 8-player bracket competition

## Files Created/Modified

### New Files
- `src/services/socketService.js` - Socket connection manager
- `src/menu/Quick.jsx` - Quick match component (updated)
- `src/menu/DragDrop.jsx` - Drag & drop component (updated)
- `src/menu/Invite.jsx` - Invite system component
- `src/menu/Tournament.jsx` - Tournament mode component
- `server-enhanced.js` - Enhanced backend server
- `MULTIPLAYER_IMPLEMENTATION.md` - Full documentation
- `QUICK_START.md` - This file

### Modified Files
- `src/App.jsx` - Added new routes and socket service
- `src/components/Heros.jsx` - Added navigation buttons

## How to Run

### Step 1: Start the Backend Server

**Option A: Use the enhanced server (recommended)**
```bash
node server-enhanced.js
```

**Option B: Update your existing server.js**
Replace your current `t3-backend/server.js` with the code from `server-enhanced.js`

### Step 2: Start the Frontend
```bash
npm start
```

### Step 3: Test Multiplayer
Open **multiple browser windows** (or incognito tabs) to test:
- Navigate to `http://localhost:3000`
- Choose a game mode
- Play against yourself in different windows!

## Quick Test Scenarios

### Test Quick Match
1. Window 1: Click "Quick Match" → Enter name → Find Match
2. Window 2: Click "Quick Match" → Enter name → Find Match
3. Both windows should pair and start a game

### Test Drag & Drop Online
1. Window 1: Click "Drag & Drop" → Online Multiplayer → Find Match
2. Window 2: Click "Drag & Drop" → Online Multiplayer → Find Match
3. Drag pieces to play

### Test Invite System
1. Window 1: Click "Invite Player" → Enter name → Join Lobby
2. Window 2: Click "Invite Player" → Enter name → Join Lobby
3. Window 1: Click "Invite" on Window 2's player
4. Window 2: Accept the invitation
5. Game starts!

### Test Tournament
1. Open **8 browser windows** (yes, really!)
2. Each window: Click "Tournament" → Enter name → Join
3. When 8 players join, tournament auto-starts
4. Play through the bracket

## Environment Variables (Optional)

Create `.env` in your frontend root:
```env
REACT_APP_SOCKET_URL=http://localhost:5000
```

This allows you to change the backend URL without modifying code.

## Architecture Overview

```
Frontend (React)
    ↓
socketService.js (manages connection)
    ↓
Socket.IO Client
    ↓
[Network]
    ↓
Socket.IO Server
    ↓
server-enhanced.js (game logic)
```

## Key Features

### Centralized Socket Management
- Single socket connection shared across all components
- Automatic reconnection
- Clean event listener management

### Real-time Synchronization
- Board state syncs instantly
- Turn management handled server-side
- Disconnect detection and handling

### Multiple Game Modes
- Each mode has unique mechanics
- All use the same socket service
- Can run simultaneously

## Common Issues & Solutions

### "Cannot connect to server"
- Ensure backend is running on port 5000
- Check firewall settings
- Verify CORS is enabled in server

### "Players not pairing"
- Make sure you're using different browser windows/tabs
- Check server console for logs
- Verify socket connections are established

### "Board not updating"
- Check browser console for errors
- Ensure `makeMove` event is emitting
- Verify both players are in the same room

### "Drag & Drop not working online"
- Make sure you selected "Online Multiplayer" mode
- Check that pieces are being tracked in state
- Verify `xPieces` and `oPieces` are syncing

## Next Steps

1. **Test all modes** - Try each game mode with multiple windows
2. **Check server logs** - Monitor console for events
3. **Customize styling** - Adjust colors/layouts to your preference
4. **Add features** - See MULTIPLAYER_IMPLEMENTATION.md for ideas
5. **Deploy** - Host on Heroku, Railway, or similar platform

## Deployment Tips

### Backend Deployment
- Use environment variable for PORT
- Enable CORS for your frontend domain
- Consider using WebSocket transport only

### Frontend Deployment
- Set `REACT_APP_SOCKET_URL` to your backend URL
- Build with `npm run build`
- Deploy to Netlify, Vercel, or similar

### Example Production Config
```javascript
// Frontend
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://your-backend.herokuapp.com';

// Backend
const io = new Server(server, { 
  cors: { 
    origin: process.env.FRONTEND_URL || "*" 
  } 
});
```

## Support

For detailed documentation, see `MULTIPLAYER_IMPLEMENTATION.md`

For server code reference, see `server-enhanced.js`

## What's Working

✅ Quick match matchmaking  
✅ Drag & drop online mode  
✅ Room-based multiplayer  
✅ Player invitation system  
✅ Tournament brackets  
✅ Real-time board sync  
✅ Turn management  
✅ Winner detection  
✅ Disconnect handling  
✅ Multiple simultaneous games  

Enjoy your multiplayer Tic-Tac-Toe! 🎮
