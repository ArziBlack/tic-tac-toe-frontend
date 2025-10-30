import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowRight } from 'react-icons/fa';

const Multiplayer = ({ socket, setName, name }) => {
  const [roomId, setRoomId] = useState('');
  const [localName, setLocalName] = useState(name || '');
  const navigate = useNavigate();

  const generateId = () => {
    return Math.floor(Math.random() * 9000) + 1000;
  };

  const handleCreateRoom = () => {
    if (!localName.trim()) {
      alert('Please enter your name');
      return;
    }
    const newRoomId = generateId();
    setName(localName);
    socket.emit('joinRoom', newRoomId);
    navigate(`/play/double/roomId/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!localName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!roomId.trim()) {
      alert('Please enter a room code');
      return;
    }
    setName(localName);
    socket.emit('joinRoom', roomId);
    navigate(`/play/double/roomId/${roomId}`);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full'>
        <h1 className='text-4xl font-bold text-center text-gray-800 mb-2'>Two Player</h1>
        <p className='text-center text-gray-600 mb-6'>Play with a friend online</p>

        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
          <input
            className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
            type='text'
            placeholder='Enter your name'
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
          />
        </div>

        <div className='space-y-4'>
          <div className='bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl'>
            <h2 className='text-lg font-bold text-gray-800 mb-3 flex items-center'>
              <FaPlus className='mr-2' /> Create New Room
            </h2>
            <p className='text-sm text-gray-600 mb-4'>Start a new game and share the room code with your friend</p>
            <button
              onClick={handleCreateRoom}
              className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 flex items-center justify-center'
            >
              Create Room <FaArrowRight className='ml-2' />
            </button>
          </div>

          <div className='bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl'>
            <h2 className='text-lg font-bold text-gray-800 mb-3'>Join Existing Room</h2>
            <p className='text-sm text-gray-600 mb-4'>Enter the room code your friend shared</p>
            <input
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
              type='text'
              placeholder='Enter room code'
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button
              onClick={handleJoinRoom}
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 flex items-center justify-center'
            >
              Join Room <FaArrowRight className='ml-2' />
            </button>
          </div>
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
};

export default Multiplayer;
