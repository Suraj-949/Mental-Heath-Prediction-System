import { useContext, useState } from 'react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { AuthContext } from '../AuthProvider'
import { apiUrl } from '../axiosInstance'
import DisclaimerBanner from './DisclaimerBanner'
import Header from './Landing Page Component/Header'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { setIsLoggedIn } = useContext(AuthContext)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(apiUrl('token/'), {
        username,
        password,
      })
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
      setIsLoggedIn(true)
      navigate('/home')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-cyan-950/20 to-slate-950 px-4 pb-16 pt-28 md:px-10">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Welcome back</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Continue your wellness journey</h1>
            <p className="mt-4 text-slate-300">
              Sign in to make predictions, save daily check-ins, and track mood trends on your dashboard.
            </p>
            <div className="mt-6">
              <DisclaimerBanner />
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <h2 className="text-2xl font-bold text-white">Login to your account</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                  placeholder="johndoe"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition focus:border-sky-400"
                    placeholder="........"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((currentValue) => !currentValue)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-2xl border border-red-300/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-400 to-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:from-emerald-300 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-300">
              Need an account?{' '}
              <Link to="/register" className="font-semibold text-emerald-200 hover:text-white">
                Create one
              </Link>
            </p>
          </section>
        </div>
      </main>
    </>
  )
}

export default Login
