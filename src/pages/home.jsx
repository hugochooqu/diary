import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <div className='header'>
        <p className='logo'>Write</p>
        <ul>
          <li><Link to='/signin' style={{textDecoration: 'none', color:'black'}}>Sign In</Link></li>
          <li><Link to='/register' style={{textDecoration: 'none', color:'black'}}>Register</Link></li>
        </ul>
      </div>
      <div className='title'>
        <h1>JOT THINGS DOWN. <span>📝</span></h1>
        <button>Get started</button>
      </div>
    </div>
  )
}

export default Home