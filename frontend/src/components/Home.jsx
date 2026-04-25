import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarRange, ChevronLeft, ChevronRight, HeartPulse, LoaderCircle, PlayCircle, RefreshCw, Video } from 'lucide-react'

import axiosInstance from '../axiosInstance'
import { disclaimerText, getMoodForRecommendations, getMoodTheme, suggestionMap } from '../lib/mentalHealth'
import DisclaimerBanner from './DisclaimerBanner'
import Header from './Landing Page Component/Header'
import QuotesSlider from './QuotesSlider'

const Home = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [recommendedVideos, setRecommendedVideos] = useState([])
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState('')
  const sliderRef = useRef(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await axiosInstance.get('mood-history/')
        setHistory(response.data.entries || [])
      } catch (err) {
        setError(err?.response?.data?.detail || 'Could not load your home page right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const currentMonthLabel = useMemo(
    () => new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    [],
  )

  const monthlyEntries = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return history.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear
    })
  }, [history])

  const currentMood = history[0] || null
  const currentMoodTheme = currentMood ? getMoodTheme(currentMood.prediction) : null

  const monthlyRecap = useMemo(() => {
    if (!monthlyEntries.length) {
      return {
        totalEntries: 0,
        topMood: 'No entries yet',
        averageConfidence: 0,
      }
    }

    const moodCounts = monthlyEntries.reduce((counts, entry) => {
      counts[entry.prediction] = (counts[entry.prediction] || 0) + 1
      return counts
    }, {})

    const topMood =
      Object.entries(moodCounts).sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1])[0]?.[0] || 'Normal'

    const averageConfidence = Math.round(
      (monthlyEntries.reduce((total, entry) => total + Number(entry.confidence || 0), 0) / monthlyEntries.length) * 100,
    )

    return {
      totalEntries: monthlyEntries.length,
      topMood,
      averageConfidence,
    }
  }, [monthlyEntries])

  const currentMoodLabel = useMemo(
    () => getMoodForRecommendations({ currentMood, monthlyTopMood: monthlyRecap.topMood }),
    [currentMood, monthlyRecap.topMood],
  )

  useEffect(() => {
    const fetchRecommendedVideo = async () => {
      setVideoLoading(true)
      setVideoError('')

      try {
        const response = await axiosInstance.get('video-recommendation/', {
          params: { mood: currentMoodLabel, limit: 5 },
        })
        setRecommendedVideos(response.data.videos || [])
      } catch (err) {
        setRecommendedVideos([])
        setVideoError(err?.response?.data?.detail || 'Could not load a mood-based YouTube video right now.')
      } finally {
        setVideoLoading(false)
      }
    }

    fetchRecommendedVideo()
  }, [currentMoodLabel])

  const handleRefreshVideo = async () => {
    setVideoLoading(true)
    setVideoError('')

    try {
      const response = await axiosInstance.get('video-recommendation/', {
        params: { mood: currentMoodLabel, limit: 5 },
      })
      setRecommendedVideos(response.data.videos || [])
    } catch (err) {
      setRecommendedVideos([])
      setVideoError(err?.response?.data?.detail || 'Could not load a mood-based YouTube video right now.')
    } finally {
      setVideoLoading(false)
    }
  }

  const scrollVideos = (direction) => {
    if (!sliderRef.current) return

    const containerWidth = sliderRef.current.clientWidth
    const scrollAmount = Math.max(containerWidth * 0.85, 320)
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-sky-950/20 to-slate-950 px-4 pb-16 pt-28 md:px-10 xl:pl-[21rem]">
        <div className="mx-auto max-w-6xl space-y-8">
          <QuotesSlider />

          {error && <div className="rounded-2xl border border-red-300/35 bg-red-500/10 p-4 text-red-100">{error}</div>}

          {loading ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-slate-200">Loading your home page...</div>
          ) : (
            <>
              <section className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-100">
                    <CalendarRange className="h-4 w-4" />
                    Monthly recap
                  </div>
                  <h1 className="mt-4 text-3xl font-bold text-white">{currentMonthLabel}</h1>
                  <p className="mt-3 text-slate-300">
                    A quick summary of how your check-ins and predictions have looked this month.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                      <p className="text-sm text-slate-300">Entries</p>
                      <p className="mt-3 text-3xl font-bold text-white">{monthlyRecap.totalEntries}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                      <p className="text-sm text-slate-300">Top mood</p>
                      <p className="mt-3 text-xl font-semibold text-white">{monthlyRecap.topMood}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                      <p className="text-sm text-slate-300">Avg confidence</p>
                      <p className="mt-3 text-3xl font-bold text-white">{monthlyRecap.averageConfidence}%</p>
                    </div>
                  </div>
                </article>

                <article
                  className={`rounded-[2rem] border bg-white/5 p-6 backdrop-blur-xl md:p-8 ${
                    currentMoodTheme?.surface || 'border-white/10'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-sm text-sky-100">
                    <HeartPulse className="h-4 w-4" />
                    Current mood
                  </div>
                  <h2 className="mt-4 text-3xl font-bold text-white">
                    {currentMood?.prediction || 'No mood recorded yet'}
                  </h2>
                  <p className="mt-3 text-slate-200">
                    {currentMood ? suggestionMap[currentMood.prediction] : 'Make a prediction or save a quick check-in to see your latest mood here.'}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                      <p className="text-sm text-slate-300">Saved on</p>
                      <p className="mt-3 text-lg font-semibold text-white">{currentMood?.date || 'Not available'}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                      <p className="text-sm text-slate-300">Confidence</p>
                      <p className="mt-3 text-3xl font-bold text-white">
                        {currentMood ? `${Math.round(Number(currentMood.confidence || 0) * 100)}%` : '--'}
                      </p>
                    </div>
                  </div>
                </article>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-sm text-amber-100">
                      <Video className="h-4 w-4" />
                      Recommended videos
                    </div>
                    <h2 className="mt-4 text-3xl font-bold text-white">YouTube videos for your current mood</h2>
                    <p className="mt-3 max-w-3xl text-slate-300">
                      These recommendations are fetched live from YouTube using your latest mood, and refreshing will pull a new random set.
                    </p>
                  </div>
                  <div className="flex max-w-sm flex-col gap-3">
                    <DisclaimerBanner />
                    <button
                      type="button"
                      onClick={handleRefreshVideo}
                      disabled={videoLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {videoLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      {videoLoading ? 'Refreshing...' : 'Refresh video'}
                    </button>
                  </div>
                </div>

                <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  Showing up to 5 videos for: <span className="ml-2 font-semibold text-white">{currentMoodLabel}</span>
                </div>

                <div className="mt-8">
                  {videoLoading && !recommendedVideos.length ? (
                    <div className="flex items-center justify-center rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-10 text-slate-200">
                      <LoaderCircle className="mr-3 h-5 w-5 animate-spin" />
                      Fetching YouTube recommendations...
                    </div>
                  ) : videoError ? (
                    <div className="rounded-[1.75rem] border border-red-300/35 bg-red-500/10 p-6 text-red-100">{videoError}</div>
                  ) : recommendedVideos.length ? (
                    <div className="space-y-5">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => scrollVideos('left')}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollVideos('right')}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>

                      <div
                        ref={sliderRef}
                        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      >
                        {recommendedVideos.map((video) => (
                          <article
                            key={video.videoId}
                            className="min-w-full snap-start overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/40 md:min-w-[calc(50%-0.75rem)] xl:min-w-[calc(33.333%-1rem)]"
                          >
                            <div className="aspect-video">
                              <iframe
                                className="h-full w-full"
                                src={video.embedUrl}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                            <div className="p-5">
                              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                                <PlayCircle className="h-4 w-4" />
                                {video.channel}
                              </div>
                              <h3 className="mt-4 text-xl font-semibold text-white">{video.title}</h3>
                              <p className="mt-3 text-sm text-slate-300">{disclaimerText}</p>
                              <a
                                href={video.watchUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/20"
                              >
                                <Video className="h-4 w-4" />
                                Watch on YouTube
                              </a>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-6 text-slate-200">
                      No recommendations are available yet.
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

export default Home
