import React from 'react'


import Footer from './Landing Page Component/Footer.jsx'
import About from './Landing Page Component/About.jsx'
import Header from './Landing Page Component/Header.jsx'
import Feature from './Landing Page Component/Feature.jsx'

import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <>
    <Header/>

    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950/20 to-slate-950">
      
      {/* Hero Section */}
      <section id="home" className="relative px-10 py-25 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-24 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto text-center z-10">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Your Mental Wellness,
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
              Predicted & Protected
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Harness the power of AI to understand, predict, and improve your mental health. 
            Get personalized insights and take proactive steps toward better wellbeing.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to={"/register"}
              className="rounded-full bg-linear-to-r from-purple-500 to-purple-600 max-w-2xl px-8 py-4 text-lg font-semibold text-white hover:from-purple-600 hover:to-purple-700 transition shadow-lg shadow-purple-500/50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <Feature />

      <About/>

      <Footer/>
    </div>
    </>

    
  )
}

export default LandingPage
