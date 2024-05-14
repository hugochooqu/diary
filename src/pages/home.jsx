import React, {Suspense, lazy} from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const Body = lazy(() => import('../components/HomeBody'))
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Body />
      </Suspense>
    </div>
  )
}

export default Home