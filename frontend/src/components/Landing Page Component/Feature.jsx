import React from 'react'
import { Brain, Shield, Users, Heart, TrendingUp, AlertCircle } from 'lucide-react'

const Feature = () => {
  return (
    <>
    {/* Mental Health Features */}
      <section id="feature" className="px-10 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Understanding Mental Health
          </h2>
          <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
            Mental health is essential to overall wellbeing. Our system helps you stay aware and take action.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition group">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 group-hover:scale-110 transition">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">AI-Powered Analysis</h3>
              <p className="text-slate-300">
                Advanced machine learning algorithms analyze your responses to provide accurate mental health predictions.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition group">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/50 group-hover:scale-110 transition">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Complete Privacy</h3>
              <p className="text-slate-300">
                Your data is encrypted and secure. We prioritize your privacy and confidentiality at every step.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition group">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Personalized Care</h3>
              <p className="text-slate-300">
                Receive tailored recommendations and resources based on your unique mental health profile.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition group">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/50 group-hover:scale-110 transition">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Track Progress</h3>
              <p className="text-slate-300">
                Monitor your mental health journey over time with detailed insights and progress tracking.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition group">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/50 group-hover:scale-110 transition">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Early Detection</h3>
              <p className="text-slate-300">
                Identify potential mental health concerns early and take preventive action before they escalate.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition group">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Professional Support</h3>
              <p className="text-slate-300">
                Connect with licensed mental health professionals when you need additional support and guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Feature