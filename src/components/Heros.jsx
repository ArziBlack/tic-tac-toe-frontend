import React from 'react'
import { Link } from 'react-router-dom'
import { FaCubes } from 'react-icons/fa'

const Heros = () => {
  return (
    <section className='relative w-screen h-screen'>
      <img src='/img/heros.jpg' alt='hero' className='absolute inset-0 w-full h-full object-cover' />
      <div className='absolute inset-0 bg-black/50' />
      <div className='relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6'>
        <FaCubes className='mb-4' fontSize={56} />
        <h1 className='text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg'>Dice Tic Tac Toe</h1>
        <p className='mt-4 max-w-2xl text-lg md:text-xl text-white/90'>Fast, simple, and fun tic-tac-toe with multiple modes. Jump into a quick match or play with a friend.</p>
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Link to='/play/quick' className='px-6 py-3 rounded-md bg-amber-500 text-black font-bold hover:scale-105 transition-transform'>Quick Match</Link>
          <Link to='/play/drag-drop' className='px-6 py-3 rounded-md bg-green-500 text-white font-bold hover:scale-105 transition-transform'>Drag & Drop</Link>
          <Link to='/play/double' className='px-6 py-3 rounded-md bg-white/10 border border-white/30 hover:bg-white/20 transition'>Two Player</Link>
        </div>
      </div>
    </section>
  )
}

export default Heros
