import { useEffect, useState } from 'react'

import { motivationalQuotes } from '../lib/mentalHealth'

const SLIDE_INTERVAL_MS = 16000

const QuotesSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % motivationalQuotes.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 px-6 py-8 backdrop-blur-xl md:px-10 md:py-10">
      <div className="absolute inset-0 bg-linear-to-r from-emerald-400/10 via-transparent to-amber-300/10" />
      <div className="relative min-h-30">
        {motivationalQuotes.map((quote, index) => (
          <blockquote
            key={quote}
            className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${
              index === activeIndex ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
            }`}
          >
            <p className="max-w-3xl text-2xl font-semibold tracking-tight text-white md:text-4xl">{quote}</p>
            <span className="mt-4 text-sm uppercase tracking-[0.35em] text-emerald-200">Daily encouragement</span>
          </blockquote>
        ))}
      </div>
      <div className="relative mt-6 flex gap-2">
        {motivationalQuotes.map((quote, index) => (
          <button
            key={`${quote}-indicator`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? 'w-10 bg-emerald-300' : 'w-2 bg-white/35'
            }`}
            aria-label={`Show quote ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default QuotesSlider
