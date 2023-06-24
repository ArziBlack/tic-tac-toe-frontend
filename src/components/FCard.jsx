import React from 'react'

const FCard = ({ icon, head, body }) => {
    return (
        <div className='fcard'>
            {icon}
            <p>{head}</p>
            <span><em>{body}</em></span>
        </div>
    )
}

export default FCard