import { Link } from 'react-router-dom'

import About from './Landing Page Component/About.jsx'
import Feature from './Landing Page Component/Feature.jsx'
import Footer from './Landing Page Component/Footer.jsx'
import DisclaimerBanner from './DisclaimerBanner.jsx'
import Header from './Landing Page Component/Header.jsx'
import QuotesSlider from './QuotesSlider.jsx'

const LandingPage = () => {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-linear-to-br from-slate-950 via-cyan-950/20 to-slate-950">
        <section id="home" className="relative overflow-hidden px-4 pb-14 pt-28 md:px-10 md:pt-34">
          <div className="absolute left-10 top-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute bottom-16 right-10 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
                AI wellness support for daily reflection
              </div>
              <h1 className="mt-6 text-5xl font-bold leading-tight text-white md:text-7xl">
                Predict mood patterns and turn check-ins into helpful insight.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Write how you feel, get an AI-generated category, save your history, and follow your emotional trends through a calm and beginner-friendly dashboard.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="rounded-full bg-linear-to-r from-emerald-500 to-sky-500 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:from-emerald-400 hover:to-sky-400"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
                >
                  Sign In
                </Link>
              </div>
              <div className="mt-8 max-w-2xl">
                <DisclaimerBanner />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">Check-in</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Daily mood snapshots</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-yellow-100">Predict</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Stress and anxiety signals</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-rose-100">Track</p>
                  <p className="mt-3 text-2xl font-semibold text-white">History and dashboard trends</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Feature />
        <About />
        <Footer />
      </div>
    </>
  )
}

export default LandingPage
