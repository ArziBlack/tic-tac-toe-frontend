import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

const SideNav = () => {
  const [open, setOpen] = useState(true);
  function toggleMenu() {
    setOpen(!open);
  }
  return (
    <div className='sidenav' >
      {!open &&
        <div onClick={toggleMenu} className='open'>
          <FaBars padding="15px" size="30px"/>
        </div>
      }
      {open &&
        <div className='menu flex flex-col items-center justify-between h-full'>
          <div onClick={toggleMenu} className='w-1 h-1 border rounded-full bg-white close'>
            <FaTimes color="red" size="30px"/>
          </div>
          <div>Home</div>
          <div>Play Demo</div>
          <div>Sign Up</div>
          <div>Login</div>
          <div>Connect Wallet</div>
          <div>About Us</div>
        </div>
      }
    </div>
  )
}

export default SideNav