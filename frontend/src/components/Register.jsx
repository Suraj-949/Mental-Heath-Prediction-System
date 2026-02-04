import React, { useState, useEffect } from 'react'
import { Brain, Shield, Heart, CheckCircle, Eye, EyeOff } from 'lucide-react'
import Header from './Landing Page Component/Header'

import axios from 'axios'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // password error state
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // error state
  const [errors, setError] = useState({})

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) return;

    const userData = {...formData, password: password};
    console.log("User data: ", userData)

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/register/", userData)
      console.log('Form submitted:', response.data)
    } catch (error) {
      setError(error.response.data)
      console.log("Error: ", errors)
    }
    

  }


  useEffect(() => {
    if (!confirmPassword) return;

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } 
    else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);


  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-900/20 to-slate-950 pt-10">

        {/* linear Orbs Background */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <section className="px-10 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Column - Info */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
                      Begin Your
                      <span className="block text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
                        Wellness Journey
                      </span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                      Join now and take control of your mental health with AI-powered insights.
                    </p>
                  </div>

                  {/* Why Join Cards */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition">
                      <div className="shrink-0 w-11 h-11 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">AI-Powered Predictions</h4>
                        <p className="text-slate-400 text-sm">Get personalized mental health insights using advanced machine learning.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition">
                      <div className="shrink-0 w-11 h-11 rounded-full bg-linear-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/40">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">100% Secure & Private</h4>
                        <p className="text-slate-400 text-sm">Your data is fully encrypted. Your privacy is our top priority.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition">
                      <div className="shrink-0 w-11 h-11 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Early Detection</h4>
                        <p className="text-slate-400 text-sm">Identify mental health concerns before they become serious.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Registration Form */}
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">

                    <h3 className="text-2xl font-bold text-white mb-1 text-center">Create Account</h3>
                    <p className="text-slate-400 text-center mb-8">Fill in your details to get started</p>

                    <div className="space-y-5">
                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <input
                          type="text"
                          name="username"
                          placeholder="johndoe"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                        />
                      </div>

                      {errors.username && (<p className='text-red-400 mt-1'>{errors.username}</p>)}

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={handlePassword}
                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 px-4 py-3 pr-12 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      {errors.password && (<p className=' text-red-400 text-sm mt-1'>{errors.password}</p>)}

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={handleConfirmPassword}
                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 px-4 py-3 pr-12 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {confirmPasswordError && (
                        <p className=' text-red-400 text-sm mt-1'>
                          {confirmPasswordError}
                        </p>
                      )}

                      

                      {/* Register Button */}
                      <button
                        onClick={handleSubmit}
                        className="w-full rounded-xl bg-linear-to-r from-purple-500 to-purple-600 px-6 py-3 text-base font-semibold text-white hover:from-purple-600 hover:to-purple-700 transition shadow-lg shadow-purple-500/40 mt-2">
                        Create Account
                      </button>

                      {/* Already have account */}
                      <p className="text-center text-slate-400 text-sm">
                        Already have an account?{' '}
                        <a href="#" className="text-purple-400 hover:text-purple-300 font-medium transition">
                          Log in
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Register;