import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Game from './Game'

const Mode = () => {
    const [open, setOpen] = useState(false);
    function toggleMenu() {
        setOpen(!open);
    }
    return (
        <div className='w-full h-full'>
            {open && (<div>
                <Game open={open} toggleMenu={toggleMenu}/>
            </div>)}
            <Outlet />
        </div>
    )
}

export default Mode