import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Patterns } from '../utils/Patterns';

const Double = ({ socket, name }) => {
  const { roomId } = useParams();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [mySymbol, setMySymbol] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    socket.emit('joinRoom', { roomId, name });

    socket.on('gameStart', ({ players, startingPlayer }) => {
      setWaiting(false);
      const me = players.find(p => p.name === name);
      const opp = players.find(p => p.name !== name);
      setMySymbol(me?.symbol || 'X');
      setOpponent(opp?.name || 'Opponent');
      setCurrentPlayer(startingPlayer);
      setIsMyTurn(startingPlayer === me?.symbol);
    });

    socket.on('updateGame', ({ board: newBoard, currentPlayer: nextPlayer }) => {
      setBoard(newBoard);
      setCurrentPlayer(nextPlayer);
      setIsMyTurn(nextPlayer === mySymbol);
      checkWinner(newBoard);
    });

    socket.on('playerDisconnected', () => {
      alert('Opponent disconnected');
    });

    return () => {
      socket.off('gameStart');
      socket.off('updateGame');
      socket.off('playerDisconnected');
    };
  }, [socket, roomId, name, mySymbol]);

  function checkWinner(squares) {
    for (let pattern of Patterns) {
      const [a, b, c] = pattern;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinner(squares[a]);
        return;
      }
    }
  }

  function handleClick(index) {
    if (!isMyTurn || board[index] || winner || waiting) return;
    socket.emit('play', { roomId, index, symbol: mySymbol });
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer('X');
    setIsMyTurn(mySymbol === 'X');
  }

  if (waiting) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'>
        <div className='bg-white p-8 rounded-2xl shadow-2xl text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4'></div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Waiting for opponent...</h2>
          <p className='text-gray-600 mb-4'>Room Code: <span className='font-mono font-bold text-purple-600'>{roomId}</span></p>
          <p className='text-sm text-gray-500'>Share this code with your friend</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full'>
        <div className='flex justify-between items-center mb-4'>
          <div className='text-left'>
            <p className='text-sm text-gray-600'>You ({mySymbol})</p>
            <p className='font-bold text-gray-800'>{name}</p>
          </div>
          <div className='text-2xl font-bold text-purple-600'>VS</div>
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
              className={`h-24 bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-300 text-5xl font-bold flex items-center justify-center rounded-lg transition ${
                isMyTurn && !cell && !winner ? 'hover:bg-purple-200 cursor-pointer' : 'cursor-not-allowed'
              }`}
              disabled={!isMyTurn || !!cell || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>

        <div className='flex gap-2'>
          {winner && (
            <button
              onClick={resetGame}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition'
            >
              Play Again
            </button>
          )}
          <Link
            to='/play/double'
            className='flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition text-center'
          >
            Leave Room
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Double;
