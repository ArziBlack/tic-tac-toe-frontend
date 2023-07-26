import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// import { Wallet } from './Wallet'
import { FaCubes, FaTimes } from 'react-icons/fa'
import modeimg from '../assets/images/heros.jpg'

const Heros = () => {
    const [walktru, setWalktru] = useState(false);
    function toggle() {
        setWalktru(!walktru);
    }
    return (
        <div className=' relative flex  w-screen h-screen'>
            <div className='fixed right-0 top-0 border text-2xl font-bold font-mono bg-rose-700 m-1 uppercase text-white shadow-2xl shadow-black hover:bg-slate-800 z-10 transition' >
                {/* <Wallet/> */}
                </div> 
            <div className=' w-screen h-full'> 
                <img src={modeimg} alt="img" className=' w-full h-full z-0' />
            </div>
            <section className='absolute top-0 right-0 left-0 w-full h-full'>
                <div className='flex flex-col h-[100%] items-center justify-between p-3  bg-amber-400/25 relative'>
                    {walktru &&
                        (<div className='fixed z-20 left-0 right-60 top-0 bottom-10 w-screen h-screen'>
                            <section className='fixed left-0 right-60 bottom-10 top-0 w-screen h-screen bg-amber-700/75'>
                                <div className=' bg-rose-700 border-4 shadow-2xl h-[88%] m-8 rounded-md relative'>
                                    <div className='absolute right-0 top-0 p-3 border-2 rounded-full m-3 hover:scale-110 bg-white cursor-pointer' onClick={toggle}>
                                        <FaTimes color='red' size='25' />
                                    </div>
                                    <div>
                                        <div className='text-white text-2xl text-left p-3'>
                                            <h1 className='text-3xl font-extrabold text-center my-3'>How To Play</h1>
                                            <p className='my-1'>STEP 1: Click on the Connect Wallet Button to connect your Solana Wallet with the game environment.</p>
                                            <p className='my-1'>STEP 2: Click on Get NFT to get an NFT to PLAY Game! <em className='uppercase text-base'><b>NB:</b> If there is an existing NFT in your wallet, Skip this Step!</em></p>
                                            <p className='my-1'>STEP 3: Click on Play Game so we can check if you have our NFT present in your Wallet and Redirect to the Game Environment.</p>
                                            <p className='my-1'>STEP 4: Play and Have Fun.</p>
                                        </div>
                                        <div></div>
                                    </div>

                                </div>
                            </section>
                        </div>)
                    }
                    <FaCubes fontSize={55} />
                    <h1 className='text-9xl font-extrabold drop-shadow-xl'>DICE TIC TAC TOE</h1>
                    <div className='flex p-4 font-medium'>
                        <div className=' cursor-pointer px-4 py-2 bg-amber-500 rounded-md mx-2 hover:scale-110 font-bold' onClick={() => setWalktru(true)}>How To Play</div>
                        <div className='cursor-pointer px-4 py-2 bg-amber-500 rounded-md font-bold mx-2 hover:scale-110'>Get NFT</div>
                        <div className='cursor-pointer px-4 py-2 bg-amber-500 rounded-md mx-2 hover:scale-110 font-bold'>Play</div>
                        <Link to='demo' className='cursor-pointer px-4 py-2 bg-amber-500 rounded-md mx-2 hover:scale-110 font-bold'>Play Demo</Link>
                        <div className='cursor-pointer px-4 py-2 bg-amber-500 rounded-md mx-2 hover:scale-110 font-bold'>Download</div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Heros