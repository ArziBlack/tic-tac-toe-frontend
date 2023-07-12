import React from 'react'
import { FaInstagram, FaTwitter } from 'react-icons/fa'

function Footer() {
  return (
    <div className=' bg-blue-800 w-full p-6 text-white'>
      <div className='flex text-left my-2'>
        <div className='f1'>
          <h1 className='font-bold uppercase'>About</h1>
          <p>Team</p>
          <p>Story</p>
          <p>Faq</p>
        </div>
        <div className='f1'>
          <h1 className='font-bold uppercase'>Explore</h1>
          <p>Features</p>
          <p>Roadmap</p>
          <p>Play</p>
        </div>
        <div className='f1'>
          <h1 className='font-bold uppercase'>Community</h1>
          <p>Discord</p>
          <p>Twitter</p>
          <p>Blog</p>
        </div>
      </div>
      <div className='flex w-full justify-between'>
        <p className='font-bold'>
          2023 Modern NFT Tic Tac Toe
        </p>
        <div className='flex justify-between'>
          <FaTwitter className='p-1' size='25'/>
          <FaInstagram className='p-1' size='25'/>
        </div>
      </div>
    </div>
  )
}

export default Footer