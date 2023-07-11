import React from 'react'
import { FaCubes } from 'react-icons/fa'
import modeimg from '../assets/images/heros.jpg'

const Heros = () => {
    return (
        <div className=' relative flex  w-screen h-screen'>
            <div className=' w-full h-full'>
                <img src={modeimg} alt="img" className=' w-full h-full z-0' />
            </div>
            <section className='absolute top-0 right-0 left-0 w-screen h-full'>
                <div className='flex flex-col h-[100%] items-center justify-between p-3  bg-amber-400/25'>
                    <FaCubes fontSize={55} />
                    <h1 className='text-9xl font-extrabold drop-shadow-xl'>DICE TIC TAC TOE</h1>
                    <div className='flex p-4 font-medium'>
                        <div className=' cursor-pointer px-4 py-2 bg-amber-500 rounded-md mx-2'>Features</div>
                        <div className='cursor-pointer px-4 py-2 bg-amber-500 rounded-md mx-2'>Roadmap</div>
                        <div className='cursor-pointer px-4 py-2 bg-amber-500 rounded-md mx-2'>Play</div>
                        <div className='cursor-pointer px-4 py-2 bg-amber-500 rounded-md mx-2'>Download</div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Heros