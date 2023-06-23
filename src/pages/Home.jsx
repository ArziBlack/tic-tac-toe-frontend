import React from 'react'
import NavBar from '../components/NavBar'
import '../styles/Home.css'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <div className='home'>
      <NavBar/>
      <Hero/>
    </div>
  )
}

export default Home