import React from 'react'
import { Link } from 'react-router-dom'
import bg from '../assets/images/dice.jpg'
import '../styles/Login.css'

const Login = () => {
  return (
    <div className='login-bg' styles={{backgroundImage:"url(img/bg.jpg)"}}>
      <div className="login-container">
        <div className="login-image">
          <p>Login To Your Gamer Account</p>
          <img src={bg} alt='bg'/>
        </div>
        <div className="login-wrapper">
          <div className="login-logo">
            <p>Black Dice Inc. 2023</p>
          </div>
          <div className="login-form">
            <div className="login-input">
              <p>@UserName</p>
              <input type="text" placeholder='@User Name' />
            </div>
            <div className="login-input">
              <p>Password</p>
              <input type="password" placeholder='@User Name' />
            </div>
            <em>Don't Have an Account? <Link to='/signup'><b>Sign Up</b></Link></em>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login