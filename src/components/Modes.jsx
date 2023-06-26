import React from 'react'
import modeimg from '../assets/images/map.jpg'

const Modes = ({ num, text }) => {
  return (
    <div className='modes relative'>  
      <div className='absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center'>
        <p className=' bg-green-500 text-xl p-6 px-10 font-extrabold'>{text}</p>
      </div>
      <img src={modeimg} alt="" className='  bg-contain w-full'/>
    </div>
  )
}

export default Modes