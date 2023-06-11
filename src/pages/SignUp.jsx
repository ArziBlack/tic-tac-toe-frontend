import React from 'react'
import '../styles/SignUp.css'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='bg'>
      <div className='signup'>
          <div className='signup-logo'>
            <p>Black Dice Inc.</p>
          </div>
        <div className='signup-form'>
          <div className="input-signup">
            <p>Name</p>
            <input type="text" placeholder='Name'/>
          </div>
          <div className="input-signup">
            <p>Email</p>
            <input type="email" placeholder='Email'/>
          </div>
          <div className="input-signup">
            <p>User Name</p>
            <input type="Text" placeholder='@Username'/>
          </div>
          <div className="input-signup">
            <p>Password</p>
            <input type="Password" placeholder='Password'/>
          </div>
          <div className="input-signup">
            <p>Confirm Password</p>
            <input type="Password" placeholder='Confirm Password'/>
          </div>
          <button className='signup-btn'>Sign Up</button>
        </div>
        <p>Already Have an Account? <b><Link to='/login'>Login</Link></b></p>
      </div>
    </div>
  )
}

export default SignUp