import { useMemo, useState } from 'react'
import { AlertTriangle, Brain, LoaderCircle, Save, Sparkles } from 'lucide-react'

import axiosInstance from '../axiosInstance'
import { dailyCheckInOptions, getMoodTheme, suggestionMap } from '../lib/mentalHealth'
import DisclaimerBanner from './DisclaimerBanner'
import Header from './Landing Page Component/Header'

const PredictForm = () => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [checkInLoading, setCheckInLoading] = useState('')
  const [checkInMessage, setCheckInMessage] = useState('')

  const confidencePercent = useMemo(() => {
    if (!result) return 0
    return Math.round((result.confidence || 0) * 100)
  }, [result])

  const currentTheme = result ? getMoodTheme(result.prediction) : null
  const suggestionMessage = result ? suggestionMap[result.prediction] || 'Please consider speaking with a professional for guidance.' : ''
  const isEmergencyPrediction = result?.prediction === 'Suicidal'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setResult(null)
    setCheckInMessage('')

    if (!text.trim()) {
      setError('Please describe how you are feeling before requesting a prediction.')
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('predict/', { text: text.trim() })
      setResult(response.data)
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.text?.[0] ||
        err?.response?.data?.error ||
        'Prediction failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickCheckIn = async (option) => {
    setCheckInLoading(option.label)
    setError('')
    setCheckInMessage('')

    try {
      await axiosInstance.post('save-entry/', {
        text: '',
        prediction: option.prediction,
        confidence: option.confidence,
        date: new Date().toISOString().slice(0, 10),
        entry_source: 'checkin',
      })
      setCheckInMessage(`Saved your ${option.label.toLowerCase()} check-in for today.`)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not save your daily check-in. Please try again.')
    } finally {
      setCheckInLoading('')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-sky-950/20 to-slate-950 px-4 pb-16 pt-28 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-sm text-sky-100">
                <Brain className="h-4 w-4" />
                AI Mental Health Prediction
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white md:text-5xl">Tell us how you are feeling today</h1>
              <p className="mt-4 max-w-3xl text-slate-300">
                Share your thoughts in a few natural sentences. The system will estimate the most likely category and help you save that result to your history automatically.
              </p>
            </div>

            <div className="space-y-4">
              <DisclaimerBanner />
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">Daily check-in</p>
                <p className="mt-3 text-lg font-semibold text-white">Prefer a quick update instead?</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {dailyCheckInOptions.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => handleQuickCheckIn(option)}
                      disabled={checkInLoading === option.label}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="text-3xl">{option.emoji}</div>
                      <p className="mt-3 text-lg font-semibold text-white">{option.label}</p>
                    </button>
                  ))}
                </div>
                {checkInMessage && <p className="mt-4 text-sm text-emerald-200">{checkInMessage}</p>}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="mental-health-text" className="mb-2 block text-sm font-medium text-slate-200">
                    Your message
                  </label>
                  <textarea
                    id="mental-health-text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    rows={9}
                    placeholder="Example: Lately I feel overwhelmed, exhausted, and I cannot stop worrying about work and life."
                    className="w-full rounded-3xl border border-white/15 bg-slate-950/75 px-5 py-5 text-white outline-none transition focus:border-sky-400"
                  />
                  <p className="mt-2 text-sm text-slate-400">Try to be natural and specific. A few complete sentences usually work best.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-400 to-sky-500 px-8 py-3 font-semibold text-slate-950 transition hover:from-emerald-300 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  {loading ? 'Predicting...' : 'Predict Mental Health'}
                </button>
              </form>

              {error && <div className="mt-6 rounded-2xl border border-red-300/35 bg-red-500/10 p-4 text-red-100">{error}</div>}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Smart result display</p>
              {!result ? (
                <div className="mt-5 rounded-3xl border border-dashed border-white/10 p-8 text-slate-300">
                  Your prediction result will appear here with confidence, color-coded severity, and a supportive suggestion.
                </div>
              ) : (
                <section className={`mt-5 rounded-3xl border p-6 text-slate-100 ${currentTheme.surface}`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Prediction</p>
                      <div className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${currentTheme.badge}`}>
                        {result.prediction}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-5 py-4">
                      <p className="text-sm text-slate-300">Confidence</p>
                      <p className="text-3xl font-bold text-white">{confidencePercent}%</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Suggestion</p>
                    <p className="mt-3 leading-7 text-slate-100">{suggestionMessage}</p>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-200">
                    <Save className="h-4 w-4" />
                    Saved to your mood history automatically.
                  </div>

                  {isEmergencyPrediction && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-300/35 bg-red-950/35 p-4 text-red-100">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                      <p>Please seek immediate help. Contact a helpline, emergency services, or a trusted person right away.</p>
                    </div>
                  )}
                </section>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default PredictForm
