import React, { useState } from 'react'
import Header from "./Landing Page Component/Header"

import {Eye, EyeOff} from 'lucide-react'

const Login = () => {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
        <Header/>
        <div className='min-h-screen bg-linear-to-br from-slate-950 via-purple-900/20 to-slate-950 pt-10'>

          {/* linear Orbs Background */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <section className="px-10 py-20 mt-20">
          <div className="max-w-3xl mx-auto ">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12">
              <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">

                    <h3 className="text-2xl font-bold text-white mb-1 text-center">Login to your Account</h3>

                    <div className="space-y-5">
                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <input
                          type="text"
                          name="username"
                          placeholder="johndoe"
                          // value={formData.username}
                          // onChange={handleChange}
                          className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
                        />
                      </div>

                      {/* {errors.username && (<p className='text-red-400 mt-1'>{errors.username}</p>)} */}

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            // value={password}
                            // onChange={handlePassword}
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
                      {/* {errors.password && (<p className=' text-red-400 text-sm mt-1'>{errors.password}</p>)} */}

                      

                      {/* Login Button */}
                      <button
                        // onClick={handleSubmit}
                        className="max-w-2xs   rounded-xl bg-linear-to-r from-purple-500 to-purple-600 px-6 py-3 text-base font-semibold text-white hover:from-purple-600 hover:to-purple-700 transition shadow-lg shadow-purple-500/40 mt-2">
                        Login
                      </button>
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

export default Login