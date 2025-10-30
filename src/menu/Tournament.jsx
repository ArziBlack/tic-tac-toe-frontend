import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import socketService from '../services/socketService';
import { Patterns } from '../utils/Patterns';

const Tournament = () => {
  const [localName, setLocalName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [tournamentPlayers, setTournamentPlayers] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [mySymbol, setMySymbol] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [tournamentWinner, setTournamentWinner] = useState(null);

  useEffect(() => {
    const socket = socketService.connect();

    socketService.on('playerName', (players) => {
      if (Array.isArray(players)) {
        const me = players[players.length - 1];
        setPlayerName(me.name);
        setTournamentPlayers(players);
      }
    });

    socketService.on('newTournamentPlayer', (newPlayerName) => {
      setTournamentPlayers(prev => [...prev, { name: newPlayerName }]);
    });

    socketService.on('groupStart', (groupPlayers, groupIndex, playerIndex) => {
      setGroupInfo({ players: groupPlayers, groupIndex, playerIndex });
      setWaiting(false);
    });

    socketService.on('gameStart', (game) => {
      setGameStarted(true);
      const myIndex = game.players.findIndex(p => p.socketId === socket.id);
      const myPlayerSymbol = myIndex === 0 ? 'X' : 'O';
      setMySymbol(myPlayerSymbol);
      
      const opponentPlayer = game.players.find(p => p.socketId !== socket.id);
      setOpponent(opponentPlayer?.name || 'Opponent');
      
      setIsMyTurn(game.currentTurn === myIndex);
    });

    socketService.on('turn', (turn) => {
      const myIndex = mySymbol === 'X' ? 0 : 1;
      setIsMyTurn(turn % 2 === myIndex);
    });

    socketService.on('boardUpdate', ({ board: newBoard }) => {
      setBoard(newBoard);
      checkWinner(newBoard);
    });

    socketService.on('gameEnd', (winnerName, losers) => {
      const didIWin = winnerName === playerName;
      setWinner(didIWin ? mySymbol : (mySymbol === 'X' ? 'O' : 'X'));
    });

    socketService.on('tournamentWinner', (winnerName) => {
      setTournamentWinner(winnerName);
    });

    return () => {
      socketService.removeAllListeners('playerName');
      socketService.removeAllListeners('newTournamentPlayer');
      socketService.removeAllListeners('groupStart');
      socketService.removeAllListeners('gameStart');
      socketService.removeAllListeners('turn');
      socketService.removeAllListeners('boardUpdate');
      socketService.removeAllListeners('gameEnd');
      socketService.removeAllListeners('tournamentWinner');
    };
  }, [mySymbol, playerName]);

  function calculateWinner(squares) {
    for (let pattern of Patterns) {
      const [a, b, c] = pattern;
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

  function handleJoinTournament() {
    if (!localName.trim()) {
      alert('Please enter your name');
      return;
    }
    setWaiting(true);
    socketService.emit('tournamentFind', localName);
  }

  function handleClick(index) {
    if (!isMyTurn || board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = mySymbol;
    setBoard(newBoard);
    
    socketService.emit('makeMove', { index, symbol: mySymbol, board: newBoard });
    socketService.emit('endTurn');
  }

  function resetToLobby() {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameStarted(false);
    setWaiting(false);
    setMySymbol(null);
    setOpponent(null);
    setIsMyTurn(false);
    setGroupInfo(null);
    setTournamentWinner(null);
  }

  // Tournament winner view
  if (tournamentWinner) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center'>
          <div className='text-6xl mb-4'>🏆</div>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>Tournament Winner!</h1>
          <p className='text-2xl font-bold text-orange-600 mb-6'>{tournamentWinner}</p>
          <button
            onClick={resetToLobby}
            className='w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition'
          >
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  // Initial view
  if (!waiting && !gameStarted && !groupInfo) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full'>
          <h1 className='text-4xl font-bold text-center text-gray-800 mb-2'>Tournament Mode</h1>
          <p className='text-center text-gray-600 mb-6'>Compete in an 8-player bracket</p>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
            <input
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition'
              type='text'
              placeholder='Enter your name'
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinTournament()}
            />
          </div>

          <button
            onClick={handleJoinTournament}
            className='w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 mb-4'
          >
            Join Tournament
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

  // Waiting view
  if (waiting && !gameStarted) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600'>
        <div className='bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full'>
          <div className='animate-pulse text-6xl mb-4'>🏆</div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Waiting for players...</h2>
          <p className='text-gray-600 mb-4'>Player: <span className='font-bold text-orange-600'>{playerName}</span></p>
          <p className='text-gray-600 mb-4'>
            Players joined: <span className='font-bold'>{tournamentPlayers.length}/8</span>
          </p>
          <div className='bg-gray-100 rounded-lg p-4 mb-4'>
            {tournamentPlayers.map((player, idx) => (
              <div key={idx} className='text-sm text-gray-700 py-1'>
                {player.name}
              </div>
            ))}
          </div>
          <button
            onClick={resetToLobby}
            className='px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition'
          >
            Leave Tournament
          </button>
        </div>
      </div>
    );
  }

  // Group stage info
  if (groupInfo && !gameStarted) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600'>
        <div className='bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>Group {String.fromCharCode(64 + groupInfo.groupIndex)}</h2>
          <p className='text-gray-600 mb-4'>Your group players:</p>
          <div className='bg-gray-100 rounded-lg p-4 mb-4'>
            {groupInfo.players.map((player, idx) => (
              <div key={idx} className='text-lg text-gray-700 py-2 font-medium'>
                {player}
              </div>
            ))}
          </div>
          <p className='text-gray-600'>Waiting for match to start...</p>
        </div>
      </div>
    );
  }

  // Game view
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full'>
        <div className='text-center mb-4'>
          <h2 className='text-2xl font-bold text-orange-600'>Tournament Match</h2>
          {groupInfo && <p className='text-gray-600'>Group {String.fromCharCode(64 + groupInfo.groupIndex)}</p>}
        </div>

        <div className='flex justify-between items-center mb-4'>
          <div className='text-left'>
            <p className='text-sm text-gray-600'>You ({mySymbol})</p>
            <p className='font-bold text-gray-800'>{playerName}</p>
          </div>
          <div className='text-2xl font-bold text-orange-600'>VS</div>
          <div className='text-right'>
            <p className='text-sm text-gray-600'>Opponent ({mySymbol === 'X' ? 'O' : 'X'})</p>
            <p className='font-bold text-gray-800'>{opponent}</p>
          </div>
        </div>

        <div className='text-center mb-4'>
          {winner ? (
            <div className='text-2xl font-bold text-green-600'>
              {winner === mySymbol ? '🎉 You Win! Advancing...' : '😢 You Lose - Eliminated'}
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
              className={`h-24 bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-orange-300 text-5xl font-bold flex items-center justify-center rounded-lg transition ${
                isMyTurn && !cell && !winner ? 'hover:bg-orange-200 cursor-pointer' : 'cursor-not-allowed'
              }`}
              disabled={!isMyTurn || !!cell || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>

        {winner && (
          <button
            onClick={resetToLobby}
            className='w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition'
          >
            Exit Tournament
          </button>
        )}
      </div>
    </div>
  );
};

export default Tournament;
