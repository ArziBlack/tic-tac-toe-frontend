import React, { useState, useEffect } from 'react';
import { Patterns } from '../utils/Patterns';

const DragDrop = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [xPieces, setXPieces] = useState([1, 2, 3]); // Available X pieces
  const [oPieces, setOPieces] = useState([1, 2, 3]); // Available O pieces

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
    
    if (piece.startsWith('X') && isXNext) {
      const newBoard = [...board];
      newBoard[index] = 'X';
      setBoard(newBoard);
      setXPieces(xPieces.filter(p => p !== parseInt(piece.slice(1))));
      setIsXNext(false);
    } else if (piece.startsWith('O') && !isXNext) {
      const newBoard = [...board];
      newBoard[index] = 'O';
      setBoard(newBoard);
      setOPieces(oPieces.filter(p => p !== parseInt(piece.slice(1))));
      setIsXNext(true);
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setXPieces([1, 2, 3]);
    setOPieces([1, 2, 3]);
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 p-4'>
      <h1 className='text-4xl font-bold text-white mb-6'>Drag & Drop Mode</h1>
      
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
