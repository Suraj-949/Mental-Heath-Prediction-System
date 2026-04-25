import { useContext, useEffect, useRef, useState } from 'react'
import { Brain, Home, LayoutDashboard, LogOut, Menu, UserCircle2, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthContext } from '../../AuthProvider'

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const sidebarRef = useRef(null)

  const protectedPaths = ['/home', '/predict', '/dashboard', '/profile']
  const isProtectedLayout = isLoggedIn && protectedPaths.includes(location.pathname)

  const navItems = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/predict', label: 'Predict', icon: Brain },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: UserCircle2 },
  ]

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMenuOpen(false) 
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const navLinkClassName = (path) =>
    `text-sm font-medium transition ${location.pathname === path ? 'text-white' : 'text-slate-300 hover:text-white'}`

  const sidebarLinkClassName = (path) =>
    `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
      location.pathname === path
        ? 'border-sky-300/30 bg-sky-400/15 text-white shadow-lg shadow-sky-950/20'
        : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
    }`

  const SidebarContent = () => (
    <>
      <div className="border-b border-white/10 pb-6">
        <Link to="/home" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-sky-500 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
            MH
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Wellness</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Mental Health</h2>
          </div>
        </Link>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Track your mood, run predictions, and review your progress from one place.
        </p>
      </div>

      <nav className="mt-6 space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <Link key={item.to} to={item.to} className={sidebarLinkClassName(item.to)}>
              <Icon className="h-5 w-5 text-sky-200" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl border border-rose-400/15 bg-rose-500/10 px-4 py-3 text-left text-sm font-medium text-rose-100 transition hover:bg-rose-500/20"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  )

  if (isProtectedLayout) {
    return (
      <>
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl xl:hidden">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <Link to="/home" className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-sky-500 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
                MH
              </div>
              <span className="text-lg font-semibold">Mental Health</span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Menu className="h-4 w-4 text-sky-200" />
              <span>Menu</span>
            </button>
          </div>
        </header>

        <aside className="fixed left-0 top-0 hidden h-screen w-[21rem] border-r border-white/10 bg-slate-950/95 px-6 py-8 backdrop-blur-xl xl:flex xl:flex-col">
          <SidebarContent />
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm xl:hidden">
            <div className="flex h-full">
              <aside
                ref={sidebarRef}
                className="flex h-full w-[min(21rem,88vw)] flex-col border-r border-white/10 bg-slate-950/95 px-5 py-6 shadow-2xl shadow-slate-950/60"
              >
                <div className="mb-6 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <SidebarContent />
              </aside>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between px-4 py-4 md:px-10">
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-sky-500 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
            MH
          </div>
          <Link className="text-lg font-semibold text-slate-100 md:text-2xl" to="/">
            Mental Health Prediction
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-5">
          <nav className="flex items-center justify-end gap-4">
            {isLoggedIn && (
              <>
                <Link to="/home" className={navLinkClassName('/home')}>
                  Home
                </Link>
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
                className="inline-flex items-center gap-2 rounded-full border border-rose-400/15 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
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
