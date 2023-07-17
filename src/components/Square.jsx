import React from 'react'

const Square = ({ val, chooseSquare, id }) => {
    return (
        <div className='square' id={id} onClick={chooseSquare}>{val}</div>
    )
}

export default Square