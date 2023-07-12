import React from 'react'

const GameFeatures = () => {
  return (
    <div className='bg-rose-700 p-6 pt-12 text-white flex items-start'>
        <div className='f1 pr-8'>
            <h1 className='text-justify text-3xl font-semibold py-4'>Game Features</h1>
            <p className='text-justify text-lg'>Experience eye-popping visuals, addictive gameplay, and an ever-evolving NFT ecosystem that sets the standard for Blockchain Gaming.</p>
        </div>
        <div className='f1 pr-8'>
            <h1 className='text-justify text-3xl font-semibold py-4'>NFT Roadmap</h1>
            <div className='flex w-full justify-between py-1 text-lg'>
                <p>(Q1) Genesis Collection</p>
                <p>2023</p>
            </div>
            <div className='flex w-full justify-between py-1 text-lg'>
                <p>(Q2) Rare NFT Abilities</p>
                <p>2023</p>
            </div>
            <div className='flex w-full justify-between py-1 text-lg'>
                <p>(Q3) Limited Edition Skins</p>
                <p>2023</p>
            </div>
            <div className='flex w-full justify-between py-1 text-lg'>
                <p>(Q4) Expansions and Update</p>
                <p>2023</p>
            </div>
        </div>
    </div>
  )
}

export default GameFeatures