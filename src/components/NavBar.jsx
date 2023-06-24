import React, { useState } from 'react'
import { FaDice, FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import '../styles/Navbar.css';

const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);

    window.onscroll = () => {
        setScrolled(window.scrollY === 0 ? false : true)
        return () => (window.onscroll = null)
    };
  return (
    <div className='nav'>
        <div className={scrolled ? "navbar scrolled" : "navbar"}>
            <div className="nav-left">
                <FaDice size='30px' color='white'/>
                <p>BlackDice</p>
            </div>
            <div className="nav-right">
                <div className="nav-social">
                    <FaTwitter size='20px' color='white'/>
                    <FaYoutube size='20px' color='white'/>
                    <FaLinkedin size='20px' color='white'/>
                    <FaFacebook size='20px' color='white'/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NavBar