import { useState, useEffect } from 'react';
import { Patterns } from '../utils/Patterns';
import socketService from '../services/socketService';
import { Link } from 'react-router-dom';

const Quick = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [localName, setLocalName] = useState('');
  const [searching, setSearching] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [mySymbol, setMySymbol] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    const socket = socketService.connect();

    // Listen for player name assignment
    socketService.on('playerName', (name) => {
      setPlayerName(name);
      console.log('Assigned player name:', name);
    });

    // Listen for game start
    socketService.on('gameStart', (game) => {
      console.log('Game started:', game);
      setGameStarted(true);
      setSearching(false);
      setRoomId(game.room);
      
      // Determine my symbol based on player position
      const myIndex = game.players.findIndex(p => p.socketId === socket.id);
      const myPlayerSymbol = myIndex === 0 ? 'X' : 'O';
      setMySymbol(myPlayerSymbol);
      
      const opponentPlayer = game.players.find(p => p.socketId !== socket.id);
      setOpponent(opponentPlayer?.name || 'Opponent');
      
      setIsMyTurn(game.currentTurn === myIndex);
    });

    // Listen for turn updates
    socketService.on('turn', (turn) => {
      setCurrentTurn(turn);
      const socket = socketService.getSocket();
      const myIndex = mySymbol === 'X' ? 0 : 1;
      setIsMyTurn(turn % 2 === myIndex);
    });

    // Listen for board updates (you'll need to emit this from server)
    socketService.on('boardUpdate', ({ board: newBoard, turn }) => {
      setBoard(newBoard);
      setCurrentTurn(turn);
      const myIndex = mySymbol === 'X' ? 0 : 1;
      setIsMyTurn(turn % 2 === myIndex);
      checkWinner(newBoard);
    });

    // Listen for game end
    socketService.on('gameEnd', (winnerName, losers) => {
      const didIWin = winnerName === playerName;
      setWinner(didIWin ? mySymbol : (mySymbol === 'X' ? 'O' : 'X'));
    });

    // Listen for opponent disconnect
    socketService.on('opponentDisconnected', () => {
      alert('Opponent disconnected');
      resetToLobby();
    });

    return () => {
      socketService.removeAllListeners('playerName');
      socketService.removeAllListeners('gameStart');
      socketService.removeAllListeners('turn');
      socketService.removeAllListeners('boardUpdate');
      socketService.removeAllListeners('gameEnd');
      socketService.removeAllListeners('opponentDisconnected');
    };
  }, [mySymbol, playerName]);

  useEffect(() => {
    if (gameStarted) {
      const win = calculateWinner(board);
      if (win) {
        setWinner(win);
      }
    }
  }, [board, gameStarted]);

  function calculateWinner(squares) {
    for (let i = 0; i < Patterns.length; i++) {
      const [a, b, c] = Patterns[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function handleFindMatch() {
    if (!localName.trim()) {
      alert('Please enter your name');
      return;
    }
    setSearching(true);
    socketService.emit('quickPlayFind', localName);
  }

  function handleClick(index) {
    if (!isMyTurn || board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = mySymbol;
    setBoard(newBoard);
    
    // Emit move to server
    socketService.emit('makeMove', { roomId, index, symbol: mySymbol, board: newBoard });
    socketService.emit('endTurn');
  }

  function resetToLobby() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setSearching(false);
    setGameStarted(false);
    setMySymbol(null);
    setOpponent(null);
    setIsMyTurn(false);
    setCurrentTurn(0);
    setRoomId('');
  }

  function resetGame() {
    resetToLobby();
  }

  // Lobby view
  if (!gameStarted && !searching) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-400 to-amber-600 p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full'>
          <h1 className='text-4xl font-bold text-center text-gray-800 mb-2'>Quick Match</h1>
          <p className='text-center text-gray-600 mb-6'>Find a random opponent instantly</p>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
            <input
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition'
              type='text'
              placeholder='Enter your name'
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFindMatch()}
            />
          </div>

          <button
            onClick={handleFindMatch}
            className='w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 mb-4'
          >
            Find Match
          </button>

          <Link
            to='/'
            className='block text-center text-gray-600 hover:text-gray-800 font-medium transition'
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Searching view
  if (searching && !gameStarted) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-400 to-amber-600'>
        <div className='bg-white p-8 rounded-2xl shadow-2xl text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4'></div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Finding opponent...</h2>
          <p className='text-gray-600 mb-4'>Player: <span className='font-bold text-amber-600'>{playerName || localName}</span></p>
          <button
            onClick={resetToLobby}
            className='px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition'
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Game view
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-400 to-amber-600 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full'>
        <div className='flex justify-between items-center mb-4'>
          <div className='text-left'>
            <p className='text-sm text-gray-600'>You ({mySymbol})</p>
            <p className='font-bold text-gray-800'>{playerName}</p>
          </div>
          <div className='text-2xl font-bold text-amber-600'>VS</div>
          <div className='text-right'>
            <p className='text-sm text-gray-600'>Opponent ({mySymbol === 'X' ? 'O' : 'X'})</p>
            <p className='font-bold text-gray-800'>{opponent}</p>
          </div>
        </div>

        <div className='text-center mb-4'>
          {winner ? (
            <div className='text-2xl font-bold text-green-600'>
              {winner === mySymbol ? '🎉 You Win!' : '😢 You Lose'}
            </div>
          ) : (
            <div className='text-lg font-bold text-gray-700'>
              {isMyTurn ? "Your Turn" : "Opponent's Turn"}
            </div>
          )}
        </div>

        <div className='grid grid-cols-3 gap-2 mb-4'>
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`h-24 bg-gradient-to-br from-amber-100 to-yellow-100 border-4 border-amber-300 text-5xl font-bold flex items-center justify-center rounded-lg transition ${
                isMyTurn && !cell && !winner ? 'hover:bg-amber-200 cursor-pointer' : 'cursor-not-allowed'
              }`}
              disabled={!isMyTurn || !!cell || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>

        <div className='flex gap-2'>
          <button
            onClick={resetGame}
            className='flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg transition'
          >
            {winner ? 'Find New Match' : 'Leave Game'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quick;
