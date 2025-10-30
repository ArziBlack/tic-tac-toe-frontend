import React from 'react'
import { Link } from 'react-router-dom'

const Play = () => {
  return (
    <div className='bg-rose-700 text-white flex flex-col items-center'>
      <section className='bg-pink-700/50 p-6 text-center'>
        <h1 className='text-3xl font-bold my-2'>Ready to Play?</h1>
        <p className='text-lg md:text-xl'>Start a quick match or invite a friend to play. No accounts, no wallets—just play.</p>
        <Link to='/play/quick' className='inline-block border px-4 py-2 my-3 hover:bg-white hover:text-black font-mono transition hover:scale-110 font-semibold'>Play Now</Link>
      </section>
    </div>
  )
}

export default Play
