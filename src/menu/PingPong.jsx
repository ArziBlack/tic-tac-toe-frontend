import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [player, setPlayer] = useState(null);
  const [paddleY, setPaddleY] = useState(50); // Initial paddle position

  useEffect(() => {
    socket.on('player', (data) => {
      setPlayer(data);
    });

    socket.on('movePaddle', ({ player: currentPlayer, direction }) => {
      if (currentPlayer === player) {
        // Update paddle position based on direction
        setPaddleY((prevY) => {
          const newY = direction === 'up' ? prevY - 10 : prevY + 10;
          return Math.max(0, Math.min(100, newY)); // Ensure paddle stays within bounds
        });
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [player]);

  const handleMouseMove = (event) => {
    const mouseY = (event.clientY / window.innerHeight) * 100; // Convert cursor position to percentage
    socket.emit('movePaddle', { player, direction: mouseY > paddleY ? 'down' : 'up' });
  };

  return (
    <div className="App" onMouseMove={handleMouseMove}>
      <h1>{player ? `You are ${player}` : 'Waiting for players...'}</h1>
      <div className="game-container">
        <div className="paddle" style={{ top: `${paddleY}%` }}></div>
        <div className="ball"></div>
      </div>
    </div>
  );
}

export default App;
