import React, {useContext} from 'react'
import Navigation from './Navigation'
import {Outlet }from 'react-router-dom'
import { stateContext } from '../App'

const Layout = ({children}) => {
const {theme} = useContext(stateContext)

  return (
    <div className={`${theme}`}>
      <Navigation />
      <div className='main'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout