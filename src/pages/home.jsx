import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <div className='header'>
        <p className='logo'>Write</p>
        
      </div>
      <div className='title'>
        <h1>JOT THINGS DOWN. <span>📝</span></h1>
        <Link to='/register' style={{textDecoration: 'none', color:'black'}}><button>Get started</button></Link>
      </div>
    </div>
  )
}

export default Home