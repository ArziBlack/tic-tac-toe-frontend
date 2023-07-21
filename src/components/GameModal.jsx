import React from 'react'
import { FaTimes } from 'react-icons/fa';
import Modal from './Modal';

const GameModal = ({toggleStart}) => {
  return (
    <div className='fixed z-[300] left-0 right-60 top-0 bottom-10 w-screen h-screen'>
                <div className='fixed left-0 right-60 bottom-10 top-0 w-screen h-screen bg-amber-700/75 flex items-center justify-center'>
                    <div className='bg-rose-400 border-4 shadow-2xl w-2/4 h-[58%] m-8 rounded-md relative text-2xl p-1 text-justify'>
                        <div className='absolute right-0 p-2 border-2 rounded-full m-3 bg-white cursor-pointer hover:scale-50 transition' onClick={toggleStart}>
                            <FaTimes color='red' size='25px' />
                        </div>
                        <h1 className='pt-10 font-bold text-3xl text-center'>Round One</h1>
                        <h3 className='font-bold'>**Rules**</h3>
                        <div className='p-2'>
                            <p>*In this round you are given a maximum of 10Mins to Beat your Opponent Else the Round will be over with no Winner.</p>
                            <p>*You are in free Mode so you would tokens only on the devnet, not mainnet</p>
                            <p>*Once this round is over you shall proceed to Round Two.</p>
                        </div>
                        <button>Start</button>
                    </div>
                </div>
            </div>
  )
}

export default GameModal