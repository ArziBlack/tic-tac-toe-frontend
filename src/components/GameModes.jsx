import React, { useEffect, useState } from 'react'
import Modes from './Modes'
import '../styles/GameModes.css'
import modeimg from '../assets/images/map.jpg'

function GameModes() {
    const [page, setPage] = useState(1);
    useEffect(() => {
        const interval = setInterval(() => {
          setPage(page => {
            if (page === 5) return 1
            return page + 1
          });
        }, 3000)
    
        return () => clearInterval(interval)
      }, [])
  return (
    <div className='gamemodes'>
        {page === 1 && <Modes  text='Are you ready for the ultimate gaming test? Prepare to embark on an extraordinary journey filled with excitement, Strategy, and adrenaline-puming challenges.'/>}
        {page === 2 &&<Modes text='Welcome to our game challenge Modes, where only the Bravest and most skilled gamers rise to the top! Ranging From the Different Challenge Modes'/>}
        {page === 3 &&<Modes  text='Embark on epic quests, solve mind-bogling puzzles, defeat menacing foes, and unlock awe-inspiring achievements.
        Our Game challenge Modes is your gateway to a world where every vicory brings you closer to becoming a true gaming legend.'/>}
        {page === 4 &&<Modes  text='Dive into the Action with our inituitive Interface and seamless gameplay. Whether you prefer 1st-person shooters, strategy games, Platformers, or RPGs, our Diverse Game Modes has Something for everyone. Discover new Challenges, Test your skills in different gaming styles, and find your true gaming passion.'/>}
        {page === 5 &&<Modes text='Challenge your Friends, create Rivalries, and compete head-to-head in Multiplayer Tournament Battles. With Our Integrated Chat System, You can connect with fellow gamers, Discuss Strategies, and Celebrate your Victories Together.'/>}
    </div>
  )
}

export default GameModes