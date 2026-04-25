import { useEffect, useState } from 'react'
import { LoaderCircle, Save, UserRound } from 'lucide-react'

import axiosInstance from '../axiosInstance'
import Header from './Landing Page Component/Header'

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await axiosInstance.get('profile/')
        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
        })
      } catch (err) {
        setError(err?.response?.data?.detail || 'Could not load your profile right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentValue) => ({ ...currentValue, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await axiosInstance.patch('profile/', formData)
      setFormData({
        username: response.data.username || '',
        email: response.data.email || '',
      })
      setSuccessMessage('Your profile details were updated successfully.')
    } catch (err) {
      const message =
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.detail ||
        'Could not update your profile right now.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-sky-950/20 to-slate-950 px-4 pb-16 pt-28 md:px-10 xl:pl-[21rem]">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-sm text-sky-100">
              <UserRound className="h-4 w-4" />
              Profile settings
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">Manage your profile</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Update the basic account details that appear across your mental wellness workspace.
            </p>

            {loading ? (
              <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/40 p-8 text-slate-200">
                Loading your profile...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-300">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                    placeholder="johndoe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                    placeholder="john@example.com"
                  />
                </div>

                {error && <p className="rounded-2xl border border-red-300/35 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
                {successMessage && (
                  <p className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    {successMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-400 to-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:from-emerald-300 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {saving ? 'Saving changes...' : 'Save changes'}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
    </>
  )
}

export default EditProfile
