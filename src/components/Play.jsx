import React from 'react'

const Play = () => {
  return (
    <div className=' bg-rose-700 text-white flex flex-col items-center'>
        <section className=' bg-pink-700/50 p-6'>
            <h1 className='text-3xl font-bold my-2'>Let's Play</h1>
            <p className=' text-2xl '>Are you ready to embrace the future of gaming with the Modern NFT Tic Tac Toe? Join the game now and pioneer a whole new world of strategic gameplay and NFT action, all on the cutting edge Solana Blockchain.</p>
            <em className='font-semibold'>Please Connect your wallet before starting the Game!</em><br/>
            <button className=' border p-2 my-3 hover:bg-white hover:text-black font-mono transition hover:scale-110 font-semibold'>Play Now</button>
        </section>
    </div>
  )
}

export default Play