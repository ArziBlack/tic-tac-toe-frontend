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
  const [gameState, setGameState] = useState([]);

  const  generateId = () => {
    const id = Math.floor(Math.random() * 200);
    return id;
  }

  useEffect(() => {
    console.log(roomId);
    if (roomId) {
      socket.emit("joinRoom", roomId);
    }
  }, [roomId]);
  
  useEffect(() => {
    socket.on("data", (TPMPlaying) => {
      console.log(TPMPlaying);
      setGameState(TPMPlaying);
      handleState()
    })
    console.log(gameState);
  }, [socket]);

  function handleState(){
    const found = gameState?.find(item => item.p1.P1Name === name || item.p2.P2Name === name);
    console.log(gameState);
    console.log(found);
    console.log(name);
  }


  const handleSave = () => {
    generateId();
    const id = generateId()
    setRoomId(id);
    let content = {
      room: roomId,
      data: {
        name: name,
        turn: "X",
        message: "Welcome to Tic Tac Toe on the Solana Blockchain"
      }
    }
    socket.emit("quick", {roomId, name});
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
        <h1 className="text-3xl font-bold">Quick Game Mode</h1>
        <p><em>
          Play with any random player available online
        </em></p>
        <div className='flex w-full p-3 h-full'>
          <div className='f1 p-2 flex flex-col'>
            <input
              className="border-2 p-1 "
              type="text"
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleSave} className="border my-2 p-2 text-xl">
              Create Game Room
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
              <button onClick={handleState} className="border p-2 text-xl w-[20%] flex items-center justify-center">
                <FaSearch />
              </button>
            </div>
          </div>
          {/* <div className='f1 p-2 flex flex-col h-full'>
            <h1>Players That are Online</h1>
            <div className='bg-amber-400 h-full border-2 overflow-y-scroll'>
            </div>
            <button className='border border-black p-2 text-xl my-3'>Join Game</button>
          </div> */}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Multiplayer