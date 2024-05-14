import React from 'react'
import { ThreeDots } from 'react-loader-spinner'

const LoadingPage = () => {
  return (
    <div className='loading'>
        <h3>WRITE</h3>
        <ThreeDots 
            visible={true}
            secondaryColor='black'
            color='grey'
        />
    </div>
  )
}

export default LoadingPage