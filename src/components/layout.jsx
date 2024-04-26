import React, {useContext} from 'react'
import Navigation from './Navigation'
import {Outlet }from 'react-router-dom'
import { stateContext } from '../App'
import ViewProfile from '../pages/ViewProfile'

const Layout = ({children}) => {
const {theme, showProfileHandler} = useContext(stateContext)

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