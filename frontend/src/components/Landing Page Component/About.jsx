import React from 'react'

const About = () => {
  return (
    <>
    {/* About Section */}
      <section id="about" className="px-10 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  What This System Does
                </h2>
                <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                  Our Mental Health Prediction System uses cutting-edge artificial intelligence 
                  to analyze behavioral patterns, emotional states, and psychological indicators 
                  to predict potential mental health concerns before they become severe.
                </p>
                <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                  Through a comprehensive questionnaire and continuous monitoring, we provide 
                  you with actionable insights, personalized recommendations, and early warnings 
                  that can help you maintain optimal mental wellness.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <p className="text-slate-300">
                      <span className="font-semibold text-white">Assessment:</span> Complete a scientifically-validated questionnaire
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <p className="text-slate-300">
                      <span className="font-semibold text-white">Analysis:</span> AI processes your responses using advanced algorithms
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <p className="text-slate-300">
                      <span className="font-semibold text-white">Insights:</span> Receive detailed predictions and recommendations
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <p className="text-slate-300">
                      <span className="font-semibold text-white">Action:</span> Access resources and connect with professionals
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/50">
                        1
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Answer Questions</h4>
                        <p className="text-slate-400 text-sm">Complete our comprehensive mental health assessment</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/50">
                        2
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Get Predictions</h4>
                        <p className="text-slate-400 text-sm">AI analyzes your data and generates insights</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/50">
                        3
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Take Action</h4>
                        <p className="text-slate-400 text-sm">Follow personalized recommendations for better health</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/50">
                        4
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Monitor Progress</h4>
                        <p className="text-slate-400 text-sm">Track your journey and see improvements over time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About