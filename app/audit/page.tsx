'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'

const BUSINESS_TYPES = [
  'Service Business',
  'E-commerce',
  'Agency',
  'Personal Brand',
  'SaaS',
  'Other',
]

const MAIN_GOALS = [
  'Increase Sales',
  'Build Trust',
  'Grow Audience',
  'Generate Leads',
  'Other',
]

const AUDIENCE_TYPES = ['B2B', 'B2C', 'Both']

const CONTEXT_OPTIONS = [
  'Just checking my score',
  'More conversions',
  'Better trust',
  'Better design',
  'Better clarity',
]

function Chip({
  label,
  selected,
  onClick,
  disabled,
}: {
  label: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 select-none"
      style={
        selected
          ? {
              background: '#0c0c0e',
              color: '#f4f4f5',
              border: '1.5px solid #0c0c0e',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            }
          : {
              background: '#f4f4f5',
              color: disabled ? '#d4d4d8' : '#52525b',
              border: '1.5px solid rgba(0,0,0,0.08)',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }
      }
    >
      {label}
    </button>
  )
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: '#a1a1aa' }}
    >
      {text}
      {required && (
        <span className="ml-1" style={{ color: '#f87171' }}>
          *
        </span>
      )}
    </p>
  )
}

export default function AuditPage() {
  const router = useRouter()
  const { isSignedIn } = useUser()

  const [url, setUrl] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [mainGoal, setMainGoal] = useState('')
  const [audienceType, setAudienceType] = useState('')
  const [contexts, setContexts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid =
    url.trim() !== '' &&
    businessType !== '' &&
    mainGoal !== '' &&
    audienceType !== ''

  const toggleContext = (ctx: string) => {
    if (loading) return
    setContexts((prev) =>
      prev.includes(ctx) ? prev.filter((c) => c !== ctx) : [...prev, ctx]
    )
  }

  const handleSubmit = async () => {
    if (!isValid || loading) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, businessType, mainGoal, audienceType, contexts }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Something went wrong. Please try again.')
      }

      router.push(`/results/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
    >
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-5"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <a
          href="/"
          className="text-base font-semibold tracking-tight text-zinc-950 hover:opacity-70 transition-opacity"
        >
          TrustAudit AI
        </a>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950">
              Sign In
            </button>
          </SignInButton>
        )}
      </nav>

      {/* Main content */}
      <main className="flex flex-col items-center px-6 pt-36 pb-24">

        {/* Page header */}
        <div className="text-center mb-12 max-w-xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide mb-6"
            style={{ background: '#f4f4f5', color: '#71717a' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Free · No signup needed
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-zinc-950 mb-4"
            style={{ letterSpacing: '-0.03em', lineHeight: '1.1' }}
          >
            Analyze Your Website
          </h1>
          <p className="text-lg text-zinc-500 leading-relaxed">
            Get a professional website score in seconds.
          </p>
        </div>

        {/* Form card */}
        <div
          className="w-full max-w-xl rounded-3xl px-8 sm:px-10 py-10"
          style={{
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          }}
        >

          {/* URL input */}
          <div className="mb-9">
            <Label text="Website URL" required />
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-150"
              style={{
                border: url ? '1.5px solid #0c0c0e' : '1.5px solid rgba(0,0,0,0.10)',
                background: '#fafafa',
              }}
            >
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#a1a1aa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none"
                style={{ fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div className="mb-9 -mx-2" style={{ height: 1, background: 'rgba(0,0,0,0.05)' }} />

          {/* Business Type */}
          <div className="mb-8">
            <Label text="Business Type" required />
            <div className="flex flex-wrap gap-2">
              {BUSINESS_TYPES.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={businessType === opt}
                  disabled={loading}
                  onClick={() => !loading && setBusinessType(businessType === opt ? '' : opt)}
                />
              ))}
            </div>
          </div>

          {/* Main Goal */}
          <div className="mb-8">
            <Label text="Main Goal" required />
            <div className="flex flex-wrap gap-2">
              {MAIN_GOALS.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={mainGoal === opt}
                  disabled={loading}
                  onClick={() => !loading && setMainGoal(mainGoal === opt ? '' : opt)}
                />
              ))}
            </div>
          </div>

          {/* Audience Type */}
          <div className="mb-8">
            <Label text="Audience Type" required />
            <div className="flex flex-wrap gap-2">
              {AUDIENCE_TYPES.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={audienceType === opt}
                  disabled={loading}
                  onClick={() => !loading && setAudienceType(audienceType === opt ? '' : opt)}
                />
              ))}
            </div>
          </div>

          <div className="mb-8 -mx-2" style={{ height: 1, background: 'rgba(0,0,0,0.05)' }} />

          {/* Additional Context */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#a1a1aa' }}>
                Additional Context
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f0f0f0', color: '#a1a1aa' }}>
                Optional
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CONTEXT_OPTIONS.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={contexts.includes(opt)}
                  disabled={loading}
                  onClick={() => toggleContext(opt)}
                />
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              {error}
            </div>
          )}

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full py-4 rounded-2xl text-sm font-semibold transition-all duration-200"
            style={
              isValid && !loading
                ? {
                    background: '#0c0c0e',
                    color: '#f4f4f5',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                    cursor: 'pointer',
                  }
                : {
                    background: '#f4f4f5',
                    color: '#d4d4d8',
                    cursor: 'not-allowed',
                    border: '1.5px solid rgba(0,0,0,0.05)',
                  }
            }
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin"
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Analyzing your website…
              </span>
            ) : (
              'Get My Website Score →'
            )}
          </button>

          <p className="text-center text-xs mt-4" style={{ color: '#d4d4d8' }}>
            <span style={{ color: '#f87171' }}>*</span> Required fields · Analysis takes ~15 seconds
          </p>
        </div>
      </main>
    </div>
  )
}
