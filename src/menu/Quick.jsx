import React, { useState, useEffect } from 'react';
import { Patterns } from '../utils/Patterns';

const Quick = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

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

  function handleClick(index) {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-400 to-amber-600 p-4'>
      <h1 className='text-4xl font-bold text-white mb-6'>Quick Match</h1>
      {winner ? (
        <div className='mb-4 text-2xl font-bold text-white'>🎉 {winner} Wins!</div>
      ) : (
        <div className='mb-4 text-xl font-bold text-white'>Current Turn: {isXNext ? 'X' : 'O'}</div>
      )}
      <div className='grid grid-cols-3 gap-2 mb-6'>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className='w-24 h-24 bg-white border-4 border-amber-700 text-4xl font-bold flex items-center justify-center hover:bg-amber-50 transition disabled:opacity-50'
            disabled={!!cell || !!winner}
          >
            {cell}
          </button>
        ))}
      </div>
      <button
        onClick={resetGame}
        className='px-6 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition'
      >
        Reset Game
      </button>
    </div>
  );
};

export default Quick;
