import React from 'react'

const Modal = ({ children }) => {
    return (
        <div className='fixed z-[300] left-0 right-60 top-0 bottom-10 w-screen h-screen'>
            <div className='fixed left-0 right-60 bottom-10 top-0 w-screen h-screen bg-amber-700/75 flex items-center justify-center'>
                <div className='bg-rose-400 border-4 shadow-2xl w-2/4 m-8 rounded-md relative text-2xl p-1 text-justify'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal