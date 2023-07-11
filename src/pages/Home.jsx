import React from 'react'
import NavBar from '../components/NavBar'
import '../styles/Home.css'
import Hero from '../components/Hero'
import Features from '../components/Features'
import GameModes from '../components/GameModes'
import Walkthrough from '../components/Walkthrough'
import Roadmap from '../components/Roadmap'
import Download from '../components/Download'
import About from '../components/About'
import Footer from '../components/Footer'
import Heros from '../components/Heros'
import GamePlay from '../components/GamePlay'
import GameFeatures from '../components/GameFeatures'

const Home = () => {
  return (
    <div className='home'>
      {/* <NavBar/> */}
      <Heros/>
      <About/>
      <GamePlay/>
      <GameFeatures/>
      {/* <Features/> */}
      {/* <GameModes/> */}
      <Walkthrough/>
      <Roadmap/>
      <Download/>
      <Footer/>
    </div>
  )
}

export default Home