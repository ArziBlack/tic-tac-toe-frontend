import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import SideNav from '../components/SideNav'
import GameModal from '../components/GameModal';
import Modal from '../components/Modal';

const Game = ({toggleMenu, open}) => {
    const [mode, setMode] = useState(1);
    return (
        <div className='game'> Tic Tac Toe Game OnChain Building in Progress...
            {open &&
                (<Modal>
                    <div className='flex flex-col items-center justify-center text-center'>
                        <h1 className='text-3xl font-bold my-2'>Tic Tac Toe in-Game Menu</h1>
                        <div className='flex flex-col p-2 font-bold'>
                            <div className='my-2 p-2 border hover:translate-x-3 transition cursor-pointer bg-white' onClick={toggleMenu}>
                                <Link to='double'>
                                    Two Player
                                </Link>
                            </div>
                            <div className='my-2 p-2 border hover:translate-x-3 transition cursor-pointer' onClick={toggleMenu}>
                                <Link to='challenge'>
                                    Challenge Mode
                                </Link>
                            </div>
                            <Link className='my-2 p-2 border hover:translate-x-3 transition cursor-pointer' to='tournament' onClick={toggleMenu}>Tournament Mode</Link>
                            <Link className='my-2 p-2 border hover:translate-x-3 transition cursor-pointer' to='demo' onClick={toggleMenu}>Demo Mode</Link>
                            <div className='my-2 p-2 hover:translate-x-3 transition cursor-pointer bg-slate-500 text-slate-700' onClick={toggleMenu}>Story Mode (coming soon)</div>
                        </div>
                    </div>
                </Modal>)}
        </div>
    )
}

export default Game