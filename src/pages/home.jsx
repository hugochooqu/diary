import React, {Suspense, lazy} from 'react'
import { Link } from 'react-router-dom'
import LoadingPage from '../components/LoadingPage'

const Home = () => {
  const Body = lazy(() => import('../components/HomeBody'))
  return (
    <div>
      <Suspense fallback={<LoadingPage />}>
        <Body />
      </Suspense>
    </div>
  )
}

export default Home