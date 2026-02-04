import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>

    <header className="fixed top-0 left-0 right-0 w-full border-b border-white/10 h-20 backdrop-blur-xl bg-slate-950/30 z-50">
        <div className="mx-auto flex h-auto items-center justify-between px-10 py-4">
    
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-purple-500/50">
                    MH
                </div>
                <Link className="text-3xl font-semibold text-slate-100" to={"/"}>
                 Mental Health Prediction
                </Link>
                
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
            
                <a href="#"
                className="text-sm rounded-full font-medium text-slate-200 px-5 py-2 border border-white/20 backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/30 transition">
                    Log in
                </a>
            
                <Link to="/register"
                className="rounded-full bg-linear-to-r from-purple-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white hover:from-purple-600 hover:to-purple-700 transition shadow-lg shadow-purple-500/50 backdrop-blur-sm">
                    Register
                </Link>
            </div>
        </div>
    </header>


    </>
  )
}

export default Header