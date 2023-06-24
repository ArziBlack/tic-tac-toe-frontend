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

const Home = () => {
  return (
    <div className='home'>
      <NavBar/>
      <Hero/>
      <Features/>
      <GameModes/>
      <Walkthrough/>
      <Roadmap/>
      <Download/>
      <About/>
      <Footer/>
    </div>
  )
}

export default Home