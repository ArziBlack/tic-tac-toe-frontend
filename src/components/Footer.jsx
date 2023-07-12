import React from 'react'
import { FaInstagram, FaTwitter } from 'react-icons/fa'

function Footer() {
  return (
    <div className='bg-blue-500 w-full'>
      <div className='flex'>
        <div className='f1'>1</div>
        <div className='f1'>2</div>
        <div className='f1'>3</div>
      </div>
      <div className='flex w-full justify-between'>
        <p>
          2023 Modern NFT Tic Tac Toe
        </p>
        <div className='flex justify-between'>
          <FaTwitter/>
          <FaInstagram/>
        </div>
      </div>
    </div>
  )
}

export default Footer