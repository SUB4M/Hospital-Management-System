import React from 'react'
import Navbar from '../components/Navbar'
import DashboardPage from '../components/DashboardPage'

const Home = () => {
    console.log("home is rendered")
  return (
    <div>
        <Navbar/>
        <DashboardPage/>
    </div>
  )
}

export default Home