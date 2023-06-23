import React from 'react'
import {FaGooglePlay} from 'react-icons/fa'
// import t3 from '../assets/images/t3.jpg'
import '../styles/Hero.css'

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
              Play Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero