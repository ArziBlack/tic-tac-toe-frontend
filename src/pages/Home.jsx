import React from 'react'
import NavBar from '../components/NavBar'
import '../styles/Home.css'
import GameModes from '../components/GameModes'
import Walkthrough from '../components/Walkthrough'
import Roadmap from '../components/Roadmap'
import Download from '../components/Download'
import About from '../components/About'
import Footer from '../components/Footer'
import Heros from '../components/Heros'
import GamePlay from '../components/GamePlay'
import GameFeatures from '../components/GameFeatures'
import Play from '../components/Play'
import Features from '../components/Features'

const Home = () => {
  return (
    <div className='home'>
      <Heros/>
      <About/>
      <GamePlay/>
      <GameFeatures/>
      <Features/>
      <Play/>
      <Footer/>
    </div>
  )
}

export default Home