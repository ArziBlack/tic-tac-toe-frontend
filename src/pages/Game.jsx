import React, { useState } from 'react'
import SideNav from '../components/SideNav'

const Game = () => {
    const [board, setBoard] = useState(["","","","","","","","",""]);
  return (
    <div className='game'>
        <div className='board'>
            
        </div>
        <SideNav/>
    </div>
  )
}

export default Game