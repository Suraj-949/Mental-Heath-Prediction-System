import { useEffect, useState } from 'react'
import { Brain, Eye, EyeOff, Heart, LoaderCircle, Shield } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { baseURL } from '../axiosInstance'
import DisclaimerBanner from './DisclaimerBanner'
import Header from './Landing Page Component/Header'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const navigate = useNavigate()

  const handleChange = (event) => {
    setFormData((currentValue) => ({ ...currentValue, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await axios.post(`${baseURL}register/`, { ...formData, password })
      navigate('/login')
    } catch (error) {
      setErrors(error?.response?.data || { detail: 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!confirmPassword) {
      setConfirmPasswordError('')
      return
    }

    setConfirmPasswordError(password !== confirmPassword ? 'Passwords do not match' : '')
  }, [password, confirmPassword])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-cyan-950/20 to-slate-950 px-4 pb-16 pt-28 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.05fr]">
          <section className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Join now</p>
            <h1 className="text-4xl font-bold text-white">Start tracking your mental wellness with AI support</h1>
            <p className="text-slate-300">
              Create an account to save predictions, log quick daily moods, and view charts that help you understand patterns over time.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Brain className="h-6 w-6 text-emerald-200" />
                <p className="mt-3 font-semibold text-white">AI predictions</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Shield className="h-6 w-6 text-sky-200" />
                <p className="mt-3 font-semibold text-white">Protected dashboard</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Heart className="h-6 w-6 text-rose-200" />
                <p className="mt-3 font-semibold text-white">Daily check-ins</p>
              </div>
            </div>
            <DisclaimerBanner />
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <h2 className="text-2xl font-bold text-white">Create account</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                  placeholder="johndoe"
                />
                {errors.username && <p className="mt-2 text-sm text-red-100">{errors.username}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-2 text-sm text-red-100">{errors.email}</p>}
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
                {errors.password && <p className="mt-2 text-sm text-red-100">{errors.password}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition focus:border-sky-400"
                    placeholder="........"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((currentValue) => !currentValue)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPasswordError && <p className="mt-2 text-sm text-red-100">{confirmPasswordError}</p>}
              </div>

              {errors.detail && <p className="rounded-2xl border border-red-300/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">{errors.detail}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-400 to-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:from-emerald-300 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-300">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-emerald-200 hover:text-white">
                Log in
              </Link>
            </p>
          </section>
        </div>
      </main>
    </>
  )
}

export default Register
