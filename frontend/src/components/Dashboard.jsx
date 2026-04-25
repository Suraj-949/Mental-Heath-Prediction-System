import { useEffect, useMemo, useState } from 'react'
import { Activity, CalendarDays, ChartPie, Sparkles } from 'lucide-react'
import { Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import axiosInstance from '../axiosInstance'
import { chartPalette, disclaimerText, getMoodTheme } from '../lib/mentalHealth'
import DisclaimerBanner from './DisclaimerBanner'
import Header from './Landing Page Component/Header'
import QuotesSlider from './QuotesSlider'

const Dashboard = () => {
  const [history, setHistory] = useState([])
  const [trend, setTrend] = useState([])
  const [distribution, setDistribution] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Pull the dashboard payload once on mount and split it into UI-friendly slices.
    const fetchHistory = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await axiosInstance.get('mood-history/')
        setHistory(response.data.entries || [])
        setTrend(response.data.trend || [])
        setDistribution(response.data.distribution || [])
      } catch (err) {
        setError(err?.response?.data?.detail || 'Could not load your dashboard right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const latestEntry = history[0]
  const latestTheme = latestEntry ? getMoodTheme(latestEntry.prediction) : null

  // Keep the summary card value stable unless the history data changes.
  const averageConfidence = useMemo(() => {
    if (!history.length) return 0
    
    const sum = history.reduce((total, entry) => total + Number(entry.confidence || 0), 0)
    return Math.round((sum / history.length) * 100)
  }, [history])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-sky-950/25 to-slate-950 px-4 pb-16 pt-28 md:px-10 xl:pl-[21rem]">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-sm text-sky-100">
                <Sparkles className="h-4 w-4" />
                Dashboard
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">Track how your mood changes over time</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Your dashboard combines AI predictions and daily check-ins so you can notice trends, patterns, and shifts earlier.
              </p>
            </div>

            <div className="space-y-6">
              <QuotesSlider />
            </div>
          </section>

          {error && <div className="rounded-2xl border border-red-300/35 bg-red-500/10 p-4 text-red-100">{error}</div>}

          {loading ? (
            <div className="rounded-4xl border border-white/10 bg-white/5 p-10 text-center text-slate-200">
              Loading your mood history...
            </div>
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Total entries</span>
                    <CalendarDays className="h-5 w-5 text-sky-200" />
                  </div>
                  <p className="mt-4 text-4xl font-bold text-white">{history.length}</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Average confidence</span>
                    <Activity className="h-5 w-5 text-emerald-200" />
                  </div>
                  <p className="mt-4 text-4xl font-bold text-white">{averageConfidence}%</p>
                </div>
                <div className={`rounded-[1.75rem] border bg-white/5 p-6 ${latestTheme?.surface || 'border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Latest mood</span>
                    <ChartPie className="h-5 w-5 text-amber-200" />
                  </div>
                  <p className="mt-4 text-2xl font-bold text-white">{latestEntry?.prediction || 'No entries yet'}</p>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-4xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white">Mood trend</h2>
                  <p className="mt-2 text-sm text-slate-300">Higher scores indicate more severe emotional distress.</p>
                  <div className="mt-6 h-90">
                    <ResponsiveContainer width="100%" height="100%">
                      {/* Compare mood severity and model confidence on the same timeline. */}
                      <LineChart data={trend}>
                        <XAxis dataKey="date" stroke="#cbd5e1" />
                        <YAxis domain={[1, 4]} ticks={[1, 2, 3, 4]} stroke="#cbd5e1" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px' }}
                          labelStyle={{ color: '#f8fafc' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="mood_score" name="Mood score" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                        <Line
                          type="monotone"
                          dataKey="average_confidence"
                          name="Confidence"
                          stroke="#34d399"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-4xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white">Mood distribution</h2>
                  <p className="mt-2 text-sm text-slate-300">How frequently each category appears in your saved history.</p>
                  <div className="mt-6 h-90">
                    <ResponsiveContainer width="100%" height="100%">
                      {/* Show the relative share of each saved mood label. */}
                      <PieChart>
                        <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={75} outerRadius={115} paddingAngle={3}>
                          {distribution.map((entry, index) => (
                            <Cell key={entry.name} fill={getMoodTheme(entry.name).color || chartPalette[index % chartPalette.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, data) => [`${value} entries (${data.payload.percentage}%)`, name]}
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              <section className="rounded-4xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Recent entries</h2>
                    <p className="mt-2 text-sm text-slate-300">{disclaimerText}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4">
                  {history.length ? (
                    history.slice(0, 6).map((entry) => {
                      // Reuse the shared mood theme map so badges and borders stay consistent.
                      const theme = getMoodTheme(entry.prediction)

                      return (
                        <article key={entry.id} className={`rounded-2xl border p-4 ${theme.surface}`}>
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${theme.badge}`}>
                                {entry.prediction}
                              </div>
                              <p className="mt-3 text-sm text-slate-200">
                                {entry.text || 'Quick daily check-in saved without a text note.'}
                              </p>
                            </div>
                            <div className="text-sm text-slate-300">
                              <p>{entry.date}</p>
                              <p className="capitalize">{entry.entry_source}</p>
                              <p>{Math.round(Number(entry.confidence || 0) * 100)}% confidence</p>
                            </div>
                          </div>
                        </article>
                      )
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-slate-300">
                      No history yet. Make a prediction or use the daily check-in to start building your dashboard.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default Dashboard
