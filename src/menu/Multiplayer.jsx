import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaUserFriends } from 'react-icons/fa';

const backgrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },

  visible: {
    y: "00px",
    opacity: 1,
    transition: {
      delay: 0.5,
    },
  },
};

const Multiplayer = ({ socket, setName, name }) => {
  const [roomId, setRoomId] = useState(null);
  

  useEffect(() => {
    console.log(roomId);
    if (roomId) {
      socket.emit("joinRoom",  roomId);
      socket.emit("name", {roomId, name});
    }
  }, [roomId]);

  
  const handleSave = () => {
    setRoomId(roomId);
    let content = {
      room: roomId,
      data: {
        name: name,
        message:"Welcome to Tic Tac Toe on the Solana Blockchain"
      }
    }
    socket.emit("info", content);
    // socket.emit("name", {roomId, name});
  };
  return (
    <motion.div
      className="w-screen h-screen bg-amber-300 flex items-center justify-center"
      variants={backgrop}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="border-4 rounded-md m-4 h-[80%] w-[90%] bg-rose-400 shadow-2xl flex flex-col items-center p-4" variants={modal}>
        <h1 className="text-3xl font-bold">Two Player Game Mode</h1>
        <p><em>
          Create an invite Link and Share to the other Player or Search for Players That are online
        </em></p>
        <div className='flex w-full p-3 h-full'>
          <div className='f1 p-2 flex flex-col'>
            <input
              className="border-2 p-2 "
              type="text"
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border-2 p-2 "
              type="number"
              placeholder="eg: 1212"
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={handleSave} className="border my-2 p-2 text-xl">
              <Link to={`roomId/${roomId}`}>
                Create Two Player Game Room
              </Link>
            </button>
            <h1 className='text-2xl my-1'>Join Game Using an Invite</h1>
            <div className='flex w-full my-5'>
              <input
                className="border-2 p-2 w-[80%]"
                type="number"
                placeholder="mbt3-123-456-789"
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button onClick={handleSave} className="border p-2 text-xl w-[20%] flex items-center justify-center">
                {/* <FaPlus /> */}
                <FaUserFriends />
              </button>
            </div>
            <h1 className='text-2xl my-1'>Search for an Invite</h1>
            <div className='flex w-full my-5'>
              <input
                className="border-2 p-2 w-[80%]"
                type="number"
                placeholder="mbt3-123-456-789"
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button onClick={handleSave} className="border p-2 text-xl w-[20%] flex items-center justify-center">
                <FaSearch />
              </button>
            </div>
          </div>
          <div className='f1 p-2 flex flex-col h-full'>
            <h1>Players That are Online</h1>
            <div className='bg-amber-400 h-full border-2 overflow-y-scroll'>
            </div>
            <button className='border border-black p-2 text-xl my-3'>Join Game</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Multiplayer