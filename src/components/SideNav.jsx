import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
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
          <FaBars padding="15px" size="30px" className='bar' />
        </div>
      }
      {open &&
        <div className='menu flex flex-col items-center justify-between h-full'>
          <div onClick={toggleMenu} className='w-1 h-1 border rounded-full bg-white close'>
            <FaTimes color="red" size="30px" />
          </div>
          <div>
            <NavLink to='welcome'>Home</NavLink>
          </div>
          <div>
            <NavLink to='/'>Play Demo</NavLink>
          </div>
          <div>
            <NavLink to='signup'>Sign Up</NavLink>
          </div>
          <div>
            <NavLink to='login'>Login</NavLink>
          </div>
          <div>
            <div>Connect Wallet</div>
          </div>
          <div>
            <NavLink to='settings'>Settings</NavLink>
          </div>
          <div>
          <NavLink to='aboutus'>About Us</NavLink>
          </div>
        </div>
      }
    </div>
  )
}

export default SideNav