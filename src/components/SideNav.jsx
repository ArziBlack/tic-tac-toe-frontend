import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'

const SideNav = ({open, toggleMenu}) => {
  
  return (
    <div className='sidenav' >
      {!open &&
        <div onClick={toggleMenu} className='open'>
          <FaBars padding="15px" size="30px" className='bar' />
        </div>
      }
      {open &&
        <div className={`menu ${!open ? 'none' : 'flex'}`}>
          <div onClick={toggleMenu} className='close'>
            <FaTimes color="red" size="30px" />
          </div>
          <div className='link'>
            <NavLink to='welcome'>Home</NavLink>
          </div>
          <div className='link'>
            <NavLink to='/'>Play Demo</NavLink>
          </div>
          <div className='link'>
            <NavLink to='signup'>Sign Up</NavLink>
          </div>
          <div className='link'>
            <NavLink to='login'>Login</NavLink>
          </div>
          <div className='link'>
            <div>Connect Wallet</div>
          </div>
          <div className='link'>
            <NavLink to='settings'>Settings</NavLink>
          </div>
          <div className='link'>
          <NavLink to='aboutus'>About Us</NavLink>
          </div>
        </div>
      }
    </div>
  )
}

export default SideNav