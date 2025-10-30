import { useState, useEffect } from 'react';
import { Patterns } from '../utils/Patterns';
import socketService from '../services/socketService';
import { Link } from 'react-router-dom';

const DragDrop = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [xPieces, setXPieces] = useState([1, 2, 3]); // Available X pieces
  const [oPieces, setOPieces] = useState([1, 2, 3]); // Available O pieces
  const [mode, setMode] = useState('local'); // 'local' or 'online'
  const [playerName, setPlayerName] = useState('');
  const [localName, setLocalName] = useState('');
  const [searching, setSearching] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [mySymbol, setMySymbol] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    if (mode === 'online') {
      const socket = socketService.connect();

      socketService.on('playerName', (name) => {
        setPlayerName(name);
      });

      socketService.on('gameStart', (game) => {
        setGameStarted(true);
        setSearching(false);
        setRoomId(game.room);
        
        const myIndex = game.players.findIndex(p => p.socketId === socket.id);
        const myPlayerSymbol = myIndex === 0 ? 'X' : 'O';
        setMySymbol(myPlayerSymbol);
        
        const opponentPlayer = game.players.find(p => p.socketId !== socket.id);
        setOpponent(opponentPlayer?.name || 'Opponent');
        
        setIsMyTurn(game.currentTurn === myIndex);
        setIsXNext(myIndex === 0);
      });

      socketService.on('turn', (turn) => {
        const myIndex = mySymbol === 'X' ? 0 : 1;
        setIsMyTurn(turn % 2 === myIndex);
        setIsXNext(turn % 2 === 0);
      });

      socketService.on('boardUpdate', ({ board: newBoard, xPieces: newXPieces, oPieces: newOPieces }) => {
        setBoard(newBoard);
        setXPieces(newXPieces);
        setOPieces(newOPieces);
        checkWinner(newBoard);
      });

      socketService.on('opponentDisconnected', () => {
        alert('Opponent disconnected');
        resetToLobby();
      });

      return () => {
        socketService.removeAllListeners('playerName');
        socketService.removeAllListeners('gameStart');
        socketService.removeAllListeners('turn');
        socketService.removeAllListeners('boardUpdate');
        socketService.removeAllListeners('opponentDisconnected');
      };
    }
  }, [mode, mySymbol]);

  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
    }
  }, [board]);

  function calculateWinner(squares) {
    for (let i = 0; i < Patterns.length; i++) {
      const [a, b, c] = Patterns[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function checkWinner(squares) {
    const win = calculateWinner(squares);
    if (win) {
      setWinner(win);
    }
  }

  function handleFindMatch() {
    if (!localName.trim()) {
      alert('Please enter your name');
      return;
    }
    setSearching(true);
    socketService.emit('quickPlayFind', localName);
  }

  function resetToLobby() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setXPieces([1, 2, 3]);
    setOPieces([1, 2, 3]);
    setSearching(false);
    setGameStarted(false);
    setMySymbol(null);
    setOpponent(null);
    setIsMyTurn(false);
    setMode('local');
  }

  function handleDragStart(e, piece) {
    e.dataTransfer.setData('piece', piece);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e, index) {
    e.preventDefault();
    const piece = e.dataTransfer.getData('piece');
    
    if (board[index] || winner) return;
    
    // Online mode - check if it's my turn
    if (mode === 'online' && !isMyTurn) return;
    
    if (piece.startsWith('X') && isXNext) {
      const newBoard = [...board];
      newBoard[index] = 'X';
      const newXPieces = xPieces.filter(p => p !== parseInt(piece.slice(1)));
      
      setBoard(newBoard);
      setXPieces(newXPieces);
      setIsXNext(false);
      
      // Emit move to server if online
      if (mode === 'online') {
        socketService.emit('makeMove', { 
          roomId, 
          index, 
          symbol: 'X', 
          board: newBoard,
          xPieces: newXPieces,
          oPieces 
        });
        socketService.emit('endTurn');
      }
    } else if (piece.startsWith('O') && !isXNext) {
      const newBoard = [...board];
      newBoard[index] = 'O';
      const newOPieces = oPieces.filter(p => p !== parseInt(piece.slice(1)));
      
      setBoard(newBoard);
      setOPieces(newOPieces);
      setIsXNext(true);
      
      // Emit move to server if online
      if (mode === 'online') {
        socketService.emit('makeMove', { 
          roomId, 
          index, 
          symbol: 'O', 
          board: newBoard,
          xPieces,
          oPieces: newOPieces 
        });
        socketService.emit('endTurn');
      }
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setXPieces([1, 2, 3]);
    setOPieces([1, 2, 3]);
    if (mode === 'online') {
      resetToLobby();
    }
  }

  // Mode selection view
  if (mode === 'local' && !gameStarted) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full'>
          <h1 className='text-4xl font-bold text-center text-gray-800 mb-2'>Drag & Drop Mode</h1>
          <p className='text-center text-gray-600 mb-6'>Choose your game mode</p>

          <div className='space-y-4'>
            <button
              onClick={() => setMode('local')}
              className='w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105'
            >
              🎮 Local Play (Same Device)
            </button>
            
            <button
              onClick={() => setMode('online')}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105'
            >
              🌐 Online Multiplayer
            </button>
          </div>

          <Link
            to='/'
            className='block text-center text-gray-600 hover:text-gray-800 mt-6 font-medium transition'
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Online lobby view
  if (mode === 'online' && !gameStarted && !searching) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full'>
          <h1 className='text-4xl font-bold text-center text-gray-800 mb-2'>Drag & Drop Online</h1>
          <p className='text-center text-gray-600 mb-6'>Find an opponent</p>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
            <input
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition'
              type='text'
              placeholder='Enter your name'
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFindMatch()}
            />
          </div>

          <button
            onClick={handleFindMatch}
            className='w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 mb-4'
          >
            Find Match
          </button>

          <button
            onClick={() => setMode('local')}
            className='w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition'
          >
            Back to Mode Selection
          </button>
        </div>
      </div>
    );
  }

  // Searching view
  if (searching && !gameStarted) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600'>
        <div className='bg-white p-8 rounded-2xl shadow-2xl text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4'></div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Finding opponent...</h2>
          <p className='text-gray-600 mb-4'>Player: <span className='font-bold text-teal-600'>{playerName || localName}</span></p>
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
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 p-4'>
      <h1 className='text-4xl font-bold text-white mb-4'>Drag & Drop Mode {mode === 'online' ? '(Online)' : '(Local)'}</h1>
      
      {mode === 'online' && (
        <div className='bg-white/20 backdrop-blur-sm px-6 py-2 rounded-lg mb-4'>
          <div className='flex items-center gap-4 text-white font-bold'>
            <span>You ({mySymbol}): {playerName}</span>
            <span>VS</span>
            <span>Opponent: {opponent}</span>
          </div>
        </div>
      )}
      
      {winner ? (
        <div className='mb-4 text-2xl font-bold text-white'>🎉 {winner} Wins!</div>
      ) : (
        <div className='mb-4 text-xl font-bold text-white'>Current Turn: {isXNext ? 'X' : 'O'}</div>
      )}

      <div className='flex items-center justify-center gap-8'>
        {/* X Pieces - Left Side */}
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl font-bold text-white text-center'>Player X</h2>
          {xPieces.map(piece => (
            <div
              key={`X${piece}`}
              draggable={isXNext && !winner}
              onDragStart={(e) => handleDragStart(e, `X${piece}`)}
              className={`w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center text-4xl font-bold text-red-600 ${
                isXNext && !winner ? 'cursor-grab active:cursor-grabbing hover:scale-110 transition-transform' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className='relative'>
                <div className='absolute w-1 h-full bg-red-600 rotate-45 left-1/2 -ml-0.5'></div>
                <div className='absolute w-full h-1 bg-red-600 rotate-45 top-1/2 -mt-0.5'></div>
                <span className='opacity-0'>X</span>
              </div>
            </div>
          ))}
        </div>

        {/* Game Board */}
        <div className='bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-2xl'>
          <div className='grid grid-cols-3 gap-3'>
            {board.map((cell, index) => (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className='w-24 h-24 bg-white/90 border-4 border-teal-700 rounded-lg text-4xl font-bold flex items-center justify-center hover:bg-white transition relative'
              >
                {cell === 'X' && (
                  <div className='relative w-12 h-12'>
                    <div className='absolute w-1 h-full bg-red-600 rotate-45 left-1/2 -ml-0.5'></div>
                    <div className='absolute w-full h-1 bg-red-600 rotate-45 top-1/2 -mt-0.5'></div>
                  </div>
                )}
                {cell === 'O' && (
                  <div className='w-12 h-12 border-4 border-blue-600 rounded-full'></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* O Pieces - Right Side */}
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl font-bold text-white text-center'>Player O</h2>
          {oPieces.map(piece => (
            <div
              key={`O${piece}`}
              draggable={!isXNext && !winner}
              onDragStart={(e) => handleDragStart(e, `O${piece}`)}
              className={`w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center ${
                !isXNext && !winner ? 'cursor-grab active:cursor-grabbing hover:scale-110 transition-transform' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className='w-14 h-14 border-4 border-blue-600 rounded-full'></div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={resetGame}
        className='mt-8 px-8 py-3 bg-white text-teal-700 font-bold rounded-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg'
      >
        Reset Game
      </button>
    </div>
  );
};

export default DragDrop;
