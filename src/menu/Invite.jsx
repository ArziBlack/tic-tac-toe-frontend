import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import socketService from '../services/socketService';
import { Patterns } from '../utils/Patterns';

const Invite = () => {
  const [localName, setLocalName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [inLobby, setInLobby] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [mySymbol, setMySymbol] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const socket = socketService.connect();

    socketService.on('playerName', (players) => {
      if (Array.isArray(players)) {
        const me = players[players.length - 1];
        setPlayerName(me.name);
        setAvailablePlayers(players.filter(p => p.socketId !== socket.id));
      }
    });

    socketService.on('invitationReceived', (invitingPlayerId, inviterName) => {
      setPendingInvites(prev => [...prev, { id: invitingPlayerId, name: inviterName }]);
    });

    socketService.on('invitationAccepted', (acceptedPlayerId, acceptedPlayerName) => {
      setGameStarted(true);
      setInLobby(false);
      setOpponent(acceptedPlayerName);
      setMySymbol('X');
      setIsMyTurn(true);
    });

    socketService.on('invitationDeclined', (declinedPlayerId) => {
      alert('Player declined your invitation');
    });

    socketService.on('turn', (turn) => {
      const myIndex = mySymbol === 'X' ? 0 : 1;
      setIsMyTurn(turn % 2 === myIndex);
    });

    socketService.on('boardUpdate', ({ board: newBoard }) => {
      setBoard(newBoard);
      checkWinner(newBoard);
    });

    return () => {
      socketService.removeAllListeners('playerName');
      socketService.removeAllListeners('invitationReceived');
      socketService.removeAllListeners('invitationAccepted');
      socketService.removeAllListeners('invitationDeclined');
      socketService.removeAllListeners('turn');
      socketService.removeAllListeners('boardUpdate');
    };
  }, [mySymbol]);

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

  function handleJoinLobby() {
    if (!localName.trim()) {
      alert('Please enter your name');
      return;
    }
    setInLobby(true);
    socketService.emit('invitePlayFind', localName);
  }

  function handleInvitePlayer(playerId) {
    socketService.emit('invitePlayer', playerId);
    alert('Invitation sent!');
  }

  function handleAcceptInvite(invitingPlayerId) {
    socketService.emit('acceptInvite', invitingPlayerId);
    setPendingInvites(prev => prev.filter(inv => inv.id !== invitingPlayerId));
    setGameStarted(true);
    setInLobby(false);
    setMySymbol('O');
    setIsMyTurn(false);
  }

  function handleDeclineInvite(invitingPlayerId) {
    socketService.emit('declineInvite', invitingPlayerId);
    setPendingInvites(prev => prev.filter(inv => inv.id !== invitingPlayerId));
  }

  function handleClick(index) {
    if (!isMyTurn || board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = mySymbol;
    setBoard(newBoard);
    
    socketService.emit('makeMove', { index, symbol: mySymbol, board: newBoard });
    socketService.emit('endTurn');
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameStarted(false);
    setInLobby(false);
    setMySymbol(null);
    setOpponent(null);
    setIsMyTurn(false);
  }

  // Initial view
  if (!inLobby && !gameStarted) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full'>
          <h1 className='text-4xl font-bold text-center text-gray-800 mb-2'>Invite Player</h1>
          <p className='text-center text-gray-600 mb-6'>Challenge specific players</p>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
            <input
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'
              type='text'
              placeholder='Enter your name'
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinLobby()}
            />
          </div>

          <button
            onClick={handleJoinLobby}
            className='w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 mb-4'
          >
            Join Lobby
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

  // Lobby view
  if (inLobby && !gameStarted) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 p-4'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full'>
          <h1 className='text-3xl font-bold text-center text-gray-800 mb-2'>Game Lobby</h1>
          <p className='text-center text-gray-600 mb-6'>Player: <span className='font-bold text-pink-600'>{playerName}</span></p>

          {pendingInvites.length > 0 && (
            <div className='mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4'>
              <h2 className='text-lg font-bold text-gray-800 mb-3'>Pending Invitations</h2>
              {pendingInvites.map(invite => (
                <div key={invite.id} className='flex items-center justify-between bg-white p-3 rounded-lg mb-2'>
                  <span className='font-medium'>{invite.name} wants to play!</span>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleAcceptInvite(invite.id)}
                      className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition'
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineInvite(invite.id)}
                      className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition'
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='mb-6'>
            <h2 className='text-lg font-bold text-gray-800 mb-3'>Available Players</h2>
            {availablePlayers.length === 0 ? (
              <p className='text-gray-600 text-center py-4'>No other players online</p>
            ) : (
              <div className='space-y-2'>
                {availablePlayers.map(player => (
                  <div key={player.socketId} className='flex items-center justify-between bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg'>
                    <span className='font-medium text-gray-800'>{player.name}</span>
                    <button
                      onClick={() => handleInvitePlayer(player.socketId)}
                      className='px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition'
                    >
                      Invite
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setInLobby(false)}
            className='w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition'
          >
            Leave Lobby
          </button>
        </div>
      </div>
    );
  }

  // Game view
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full'>
        <div className='flex justify-between items-center mb-4'>
          <div className='text-left'>
            <p className='text-sm text-gray-600'>You ({mySymbol})</p>
            <p className='font-bold text-gray-800'>{playerName}</p>
          </div>
          <div className='text-2xl font-bold text-pink-600'>VS</div>
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
              className={`h-24 bg-gradient-to-br from-pink-100 to-purple-100 border-4 border-pink-300 text-5xl font-bold flex items-center justify-center rounded-lg transition ${
                isMyTurn && !cell && !winner ? 'hover:bg-pink-200 cursor-pointer' : 'cursor-not-allowed'
              }`}
              disabled={!isMyTurn || !!cell || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>

        <button
          onClick={resetGame}
          className='w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition'
        >
          {winner ? 'Back to Lobby' : 'Leave Game'}
        </button>
      </div>
    </div>
  );
};

export default Invite;
