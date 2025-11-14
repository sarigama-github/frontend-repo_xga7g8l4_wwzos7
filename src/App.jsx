import { useState } from 'react'
import Hero from './Hero'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [prompt, setPrompt] = useState('A neon hummingbird made of glass')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    setLoading(true)
    setError('')
    setImage(null)
    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, width: 1024, height: 1024 })
      })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      const data = await res.json()
      setImage(data.image_data_url)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Hero />

      <section className="relative z-10 max-w-5xl mx-auto px-6 -mt-24">
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your image..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/10 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={generate}
              disabled={loading}
              className="px-5 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 font-semibold"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          {error && (
            <p className="text-red-300 text-sm mt-3">{error}</p>
          )}
        </div>

        {image && (
          <div className="mt-8 grid place-items-center">
            <img src={image} alt="Generated" className="rounded-xl shadow-2xl max-w-full border border-white/10" />
          </div>
        )}
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">How it works</h2>
        <p className="text-slate-300">
          Enter a prompt and we create a vibrant, deterministic SVG based on your words. This is a playful demo — you can swap in any model later while keeping the same flow.
        </p>
      </section>
    </div>
  )
}

export default App
