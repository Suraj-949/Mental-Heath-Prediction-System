import React, { useMemo, useState } from 'react'
import { AlertTriangle, Brain, HeartPulse, LoaderCircle, ShieldAlert } from 'lucide-react'

import Header from './Landing Page Component/Header'
import axiosInstance from '../axiosInstance'

const suggestionMap = {
  Anxiety: 'You may be experiencing anxiety. Grounding exercises and speaking with someone you trust may help.',
  Bipolar: 'Your text reflects signs that may need professional attention. Please consider reaching out to a qualified mental health professional.',
  Depression: 'You may be feeling low or depressed. Gentle self-care and talking to a mental health professional can help.',
  Normal: 'Your response looks emotionally balanced right now. Keep maintaining healthy routines and social support.',
  'Personality disorder': 'This pattern may benefit from professional evaluation. Consider speaking with a licensed mental health expert.',
  Stress: 'You may be experiencing stress. Try relaxation techniques and talk to someone.',
  Suicidal: 'Please seek immediate help. Contact a helpline or a trusted person right away.',
}

const severityTheme = {
  Normal: {
    accent: 'emerald',
    badge: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
    panel: 'border-emerald-400/30 bg-emerald-500/10',
  },
  Anxiety: {
    accent: 'amber',
    badge: 'bg-amber-500/15 text-amber-100 border-amber-300/30',
    panel: 'border-amber-400/30 bg-amber-500/10',
  },
  Stress: {
    accent: 'amber',
    badge: 'bg-amber-500/15 text-amber-100 border-amber-300/30',
    panel: 'border-amber-400/30 bg-amber-500/10',
  },
  Suicidal: {
    accent: 'rose',
    badge: 'bg-rose-500/15 text-rose-100 border-rose-300/30',
    panel: 'border-rose-400/35 bg-rose-500/10',
  },
  Depression: {
    accent: 'rose',
    badge: 'bg-rose-500/15 text-rose-100 border-rose-300/30',
    panel: 'border-rose-400/35 bg-rose-500/10',
  },
  Bipolar: {
    accent: 'rose',
    badge: 'bg-rose-500/15 text-rose-100 border-rose-300/30',
    panel: 'border-rose-400/35 bg-rose-500/10',
  },
  'Personality disorder': {
    accent: 'rose',
    badge: 'bg-rose-500/15 text-rose-100 border-rose-300/30',
    panel: 'border-rose-400/35 bg-rose-500/10',
  },
}

const PredictForm = () => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const confidencePercent = useMemo(() => {
    if (!result) return 0
    return Math.round((result.confidence || 0) * 100)
  }, [result])

  const currentTheme = result ? severityTheme[result.prediction] || severityTheme.Depression : null
  const suggestionMessage = result ? suggestionMap[result.prediction] || 'Please consider speaking with a professional for guidance.' : ''
  const isEmergencyPrediction = result?.prediction === 'Suicidal'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setResult(null)

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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-purple-900/20 to-slate-950 px-4 pb-16 pt-28 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-sm text-purple-200">
                  <Brain className="h-4 w-4" />
                  AI Mental Health Prediction
                </div>
                <h1 className="text-3xl font-bold text-white md:text-4xl">Describe how you are feeling today</h1>
                <p className="mt-2 max-w-2xl text-slate-300">
                  Share your thoughts in a few sentences and the model will estimate the most likely mental health category.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 md:max-w-sm">
                <div className="flex items-start gap-3">
                  <HeartPulse className="mt-0.5 h-5 w-5 text-pink-300" />
                  <p>This is not a medical diagnosis. Please consult a professional.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="mental-health-text" className="mb-2 block text-sm font-medium text-slate-200">
                  Your message
                </label>
                <textarea
                  id="mental-health-text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={8}
                  placeholder="Example: Lately I feel overwhelmed, exhausted, and I cannot stop worrying about work and life."
                  className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-4 text-white outline-none transition focus:border-purple-400"
                />
                <p className="mt-2 text-sm text-slate-400">Try to be as natural as possible. A few complete sentences usually work best.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-500 to-purple-600 px-8 py-3 font-semibold text-white transition hover:from-purple-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ShieldAlert className="h-5 w-5" />}
                {loading ? 'Predicting...' : 'Predict Mental Health'}
              </button>
            </form>

            {error && (
              <div className="mt-6 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-rose-200">
                {error}
              </div>
            )}

            {result && (
              <section className={`mt-6 rounded-2xl border p-6 text-slate-100 ${currentTheme.panel}`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Prediction Result</p>
                    <div className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${currentTheme.badge}`}>
                      {result.prediction}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-5 py-4">
                    <p className="text-sm text-slate-300">Confidence</p>
                    <p className="text-3xl font-bold text-white">{confidencePercent}%</p>
                  </div>
                </div>

                <p className="mt-5 text-base leading-7 text-slate-100">{suggestionMessage}</p>

                {isEmergencyPrediction && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-300/35 bg-rose-950/35 p-4 text-rose-100">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>Please seek immediate help. Contact a helpline, emergency services, or a trusted person right away.</p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default PredictForm
