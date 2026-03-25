import { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthContext } from '../../AuthProvider'

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinkClassName = (path) =>
    `text-sm font-medium transition ${location.pathname === path ? 'text-white' : 'text-slate-300 hover:text-white'}`

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-sky-500 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
            MH
          </div>
          <Link className="text-lg font-semibold text-slate-100 md:text-2xl" to="/">
            Mental Health Prediction
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <nav className="flex items-center gap-4">
            <Link to="/" className={navLinkClassName('/')}>
              Home
            </Link>
            {isLoggedIn && (
              <>
                <Link to="/predict" className={navLinkClassName('/predict')}>
                  Predict
                </Link>
                <Link to="/dashboard" className={navLinkClassName('/dashboard')}>
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-linear-to-r from-emerald-400 to-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:from-emerald-300 hover:to-sky-400"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
