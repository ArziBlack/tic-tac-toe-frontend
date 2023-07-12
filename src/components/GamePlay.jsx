import React from 'react'
import modeimg from '../assets/images/dice.jpg'

const GamePlay = () => {
  return (
    <div className='flex p-6 text-white bg-rose-700'>
        <div className='f1 flex flex-col items-start pr-8'>
            <img src={modeimg} alt="" className=' h-[350px] w-full'/>
            <h1 className=' text-3xl font-semibold mt-5 py-3'>Epic NFT Entity</h1>
            <p className=' text-left text-lg w-[70%]'>Each NFT entity comes with a unique design and ability, making your Tic Tac Toe Experience truly one-of-a-kind. Collect them all and Reign Supreme.</p>
        </div>
        <div className='f1 flex flex-col items-start pr-8'>
            <img src={modeimg} alt="" className='h-[350px] w-full' />
            <h1 className='text-3xl font-semibold mt-5 py-3'>Strategic Gameplay</h1>
            <p className=' text-left text-lg w-[70%]'>Master the tatics as you maneuver your NFTs on the game board, anticipating your opponent's move while plotting your path to victory.</p>
        </div>
    </div>
  )
}

export default GamePlay