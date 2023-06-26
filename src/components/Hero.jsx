import React from 'react'
import {FaGooglePlay} from 'react-icons/fa'
// import t3 from '../assets/images/t3.jpg'
import '../styles/Hero.css'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
      <div className='img'>
        <div className="hero-body">
          <p>TIC TAC TOE on the Solana Blockchain</p>
          <div className='hero-cta'>
            <button>
              <FaGooglePlay className='play'/>
              Download from PlayStore
            </button>
            <button>
              <Link to='demo'>
              Play Demo
              </Link>
            </button>
          </div>
          <button className='button'>Get Started</button>
        </div>
      </div>
    </div>
  )
}

export default Hero