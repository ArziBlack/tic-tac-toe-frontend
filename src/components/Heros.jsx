import { Link } from 'react-router-dom'
import { FaCubes } from 'react-icons/fa'

const Heros = () => {
  return (
    <section className='relative w-screen h-screen overflow-hidden'>
      {/* Animated gradient background */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 animate-gradient-shift'></div>
      
      {/* Animated geometric shapes */}
      <div className='absolute inset-0 overflow-hidden opacity-20'>
        <div className='absolute top-20 left-20 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob'></div>
        <div className='absolute top-40 right-20 w-64 h-64 bg-yellow-300 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000'></div>
        <div className='absolute bottom-20 left-40 w-64 h-64 bg-pink-300 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000'></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className='absolute inset-0 bg-grid-pattern opacity-10'></div>
      
      {/* Content */}
      <div className='relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6'>
        <FaCubes className='mb-4 animate-bounce-slow' fontSize={56} />
        <h1 className='text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200'>Dice Tic Tac Toe</h1>
        <p className='mt-4 max-w-2xl text-lg md:text-xl text-white drop-shadow-lg'>Fast, simple, and fun tic-tac-toe with multiple modes. Jump into a quick match or play with a friend.</p>
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Link to='/play/quick' className='px-6 py-3 rounded-md bg-amber-500 text-black font-bold hover:scale-105 hover:shadow-xl transition-all shadow-lg'>⚡ Quick Match</Link>
          <Link to='/play/drag-drop' className='px-6 py-3 rounded-md bg-green-500 text-white font-bold hover:scale-105 hover:shadow-xl transition-all shadow-lg'>🎯 Drag & Drop</Link>
          <Link to='/play/double' className='px-6 py-3 rounded-md bg-indigo-500 text-white font-bold hover:scale-105 hover:shadow-xl transition-all shadow-lg'>👥 Two Player</Link>
          <Link to='/play/invite' className='px-6 py-3 rounded-md bg-pink-500 text-white font-bold hover:scale-105 hover:shadow-xl transition-all shadow-lg'>💌 Invite Player</Link>
          <Link to='/play/tournament' className='px-6 py-3 rounded-md bg-orange-500 text-white font-bold hover:scale-105 hover:shadow-xl transition-all shadow-lg'>🏆 Tournament</Link>
        </div>
      </div>
    </section>
  )
}

export default Heros
