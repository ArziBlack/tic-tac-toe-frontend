import React from 'react'
import {FaGamepad, FaHeart, FaGlobe, FaDollarSign} from 'react-icons/fa'
import  '../styles/Features.css'
import FCard from './FCard'

const Features = () => {
  return (
    <div className='features bg-slate-400'>
        <div className="features-wrapper">
            <FCard icon={<FaGamepad size='42'/>} head='Dynamic Game Modes' body='The Most Dynamic Game modes will get you Playing'/>
            <FCard icon={<FaHeart size='42'/>} head='Friendly Game User Experience' body='Experience a Friendly UI with Incredible Game Modes'/>
            <FCard icon={<FaGlobe size='42'/>} head='Online Multiplayer' body='Play Online with Multiple Gamers ready to Play'/>
            <FCard icon={<FaDollarSign size='42'/>} head='Play To Earn' body='Stand a chance to earn while playing'/>
        </div>
    </div>
  )
}

export default Features