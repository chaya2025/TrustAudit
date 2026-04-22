'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import type { CategoryScore, Improvement } from '@/lib/types'

const CIRCUMFERENCE = 263.9

interface ResultsClientProps {
  result: {
    overallScore: number
    url: string
    categories: CategoryScore[]
    improvements: Improvement[]
    analyzedItems: string[]
    insightText: string
  }
}

const CATEGORY_ICONS: Record<string, React.ReactElement> = {
  Trust: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Messaging: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Conversion: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  UX: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
    </svg>
  ),
  Authority: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
    </svg>
  ),
}

function scoreColor(s: number) {
  if (s >= 80) return '#4ade80'
  if (s >= 70) return '#fbbf24'
  return '#f87171'
}

function scoreGradient(s: number) {
  if (s >= 80) return 'linear-gradient(90deg, #4ade80, #a3e635)'
  if (s >= 70) return 'linear-gradient(90deg, #fbbf24, #f59e0b)'
  return 'linear-gradient(90deg, #f87171, #ef4444)'
}

function scoreGlow(s: number) {
  if (s >= 80) return 'rgba(74,222,128,0.15)'
  if (s >= 70) return 'rgba(251,191,36,0.15)'
  return 'rgba(248,113,113,0.15)'
}

function scoreGlowStrong(s: number) {
  if (s >= 80) return 'rgba(74,222,128,0.28)'
  if (s >= 70) return 'rgba(251,191,36,0.28)'
  return 'rgba(248,113,113,0.28)'
}

function scoreLabel(s: number) {
  if (s >= 85) return 'Excellent'
  if (s >= 75) return 'Good'
  if (s >= 65) return 'Fair'
  return 'Needs work'
}

function overallLabel(s: number) {
  if (s >= 85) return 'Excellent'
  if (s >= 70) return 'Above average'
  if (s >= 55) return 'Average'
  return 'Needs improvement'
}

function percentile(s: number) {
  if (s >= 90) return 'Top 5%'
  if (s >= 80) return 'Top 25%'
  if (s >= 70) return 'Top 45%'
  if (s >= 60) return 'Top 60%'
  return 'Below average'
}

export default function ResultsClient({ result }: ResultsClientProps) {
  const { isSignedIn } = useUser()
  const [ready, setReady] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)

  const OVERALL = result.overallScore

  useEffect(() => {
    const delay = setTimeout(() => {
      setReady(true)
      const start = performance.now()
      const duration = 1400
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayScore(Math.round(eased * OVERALL))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, 250)
    return () => clearTimeout(delay)
  }, [OVERALL])

  const ringOffset = ready ? CIRCUMFERENCE * (1 - OVERALL / 100) : CIRCUMFERENCE
  const issueCount = result.improvements.filter((i) => i.priority === 'High').length

  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', background: '#f8f8f9' }}>

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-5"
        style={{
          background: 'rgba(248,248,249,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <a href="/" className="text-base font-semibold tracking-tight text-zinc-950 hover:opacity-70 transition-opacity">
          TrustAudit AI
        </a>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
              Sign In
            </button>
          </SignInButton>
        )}
      </nav>

      <main className="flex flex-col items-center px-4 sm:px-6 pt-36 pb-28 mx-auto" style={{ maxWidth: 820 }}>

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide mb-6"
            style={{ background: 'rgba(0,0,0,0.05)', color: '#71717a', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#a3e635', boxShadow: '0 0 6px #a3e635' }} />
            Analysis complete
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-950 mb-3" style={{ letterSpacing: '-0.03em', lineHeight: '1.1' }}>
            TrustAudit AI Results
          </h1>
          <p className="text-sm text-zinc-400 font-mono truncate max-w-sm mx-auto">{result.url}</p>
        </div>

        {/* Overall score card */}
        <div
          className="w-full rounded-3xl overflow-hidden mb-6"
          style={{
            background: 'linear-gradient(160deg, #111114 0%, #0c0c0e 55%, #0f0f12 100%)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.42), 0 0 160px rgba(163,230,53,0.05)',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)' }} />
          <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, #4ade80 35%, #a3e635 65%, transparent 100%)', position: 'relative', zIndex: 1 }} />

          <div className="flex items-center justify-between px-8 sm:px-10 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#52525b' }}>Overall Score</span>
            <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full" style={{ background: 'rgba(163,230,53,0.09)', color: '#a3e635', border: '1px solid rgba(163,230,53,0.2)', letterSpacing: '0.01em' }}>
              {overallLabel(OVERALL)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12 px-8 sm:px-10 py-10 sm:py-12" style={{ position: 'relative', zIndex: 1 }}>
            {/* Ring */}
            <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 200, height: 200 }}>
              <div className="absolute rounded-full" style={{ width: 200, height: 200, background: 'radial-gradient(circle, rgba(163,230,53,0.06) 0%, transparent 65%)', opacity: ready ? 1 : 0, transition: 'opacity 1.4s ease 0.5s' }} />
              <div className="absolute rounded-full" style={{ width: 130, height: 130, background: 'radial-gradient(circle, rgba(74,222,128,0.09) 0%, transparent 70%)', opacity: ready ? 1 : 0, transition: 'opacity 1.4s ease 0.7s' }} />
              <svg width="200" height="200" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#a3e635" />
                  </linearGradient>
                  <filter id="ringGlow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <circle cx="50" cy="50" r="47" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.06)" strokeWidth="7" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="url(#ringGrad)" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={ringOffset} filter="url(#ringGlow)" style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)' }} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-bold tabular-nums" style={{ fontSize: 54, lineHeight: 1, color: '#f4f4f5', letterSpacing: '-0.05em' }}>{displayScore}</span>
                <span className="text-xs mt-2 font-medium tracking-wide" style={{ color: '#3f3f46' }}>out of 100</span>
              </div>
            </div>

            {/* Context */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                <p className="text-3xl font-bold" style={{ color: '#f4f4f5', letterSpacing: '-0.03em' }}>{overallLabel(OVERALL)}</p>
                <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(163,230,53,0.1)', color: '#a3e635', border: '1px solid rgba(163,230,53,0.18)' }}>{percentile(OVERALL)}</span>
              </div>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#71717a', maxWidth: 340 }}>
                {result.insightText}
              </p>

              {/* Benchmark bar */}
              <div>
                <div className="flex justify-between text-xs mb-3" style={{ color: '#3f3f46' }}>
                  <span>0</span>
                  <span style={{ color: '#a3e635', fontWeight: 700 }}>{OVERALL} — Your Score</span>
                  <span>100</span>
                </div>
                <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="absolute top-0 bottom-0 w-px" style={{ left: '61%', background: 'rgba(255,255,255,0.15)', zIndex: 2 }} />
                  <div className="h-full rounded-full" style={{ width: ready ? `${OVERALL}%` : '0%', background: 'linear-gradient(90deg, #4ade80, #a3e635)', boxShadow: '0 0 18px rgba(163,230,53,0.55)', transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1)' }} />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-4 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
                  <span className="text-xs" style={{ color: '#3f3f46' }}>Industry average: 61</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-3 divide-x px-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Categories', value: String(result.categories.length) },
              { label: 'Issues found', value: String(issueCount) },
              { label: 'Percentile', value: percentile(OVERALL).replace('Top ', '').replace('%', 'th') },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center py-5 px-4" style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span className="text-lg font-bold tabular-nums" style={{ color: '#f4f4f5', letterSpacing: '-0.03em' }}>{stat.value}</span>
                <span className="text-xs mt-1" style={{ color: '#3f3f46' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="w-full rounded-3xl overflow-hidden mb-6" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between px-8 sm:px-10 py-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Category Breakdown</h2>
            <span className="text-xs text-zinc-400">{result.categories.length} categories</span>
          </div>
          <div className="px-8 sm:px-10 py-8 flex flex-col" style={{ gap: 30 }}>
            {result.categories.map((cat, i) => {
              const color = scoreColor(cat.score)
              const gradient = scoreGradient(cat.score)
              const glow = scoreGlow(cat.score)
              const glowStrong = scoreGlowStrong(cat.score)
              const label = scoreLabel(cat.score)
              return (
                <div key={cat.label} style={{ opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(10px)', transition: `opacity 0.55s ease ${i * 90}ms, transform 0.55s ease ${i * 90}ms` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0" style={{ background: glow, color, border: `1px solid ${glowStrong}` }}>
                        {CATEGORY_ICONS[cat.label]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-800">{cat.label}</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: glow, color, border: `1px solid ${glowStrong}` }}>{label}</span>
                        </div>
                        <span className="text-xs text-zinc-400 mt-0.5 block">{cat.description}</span>
                      </div>
                    </div>
                    <span className="text-2xl font-bold tabular-nums flex-shrink-0" style={{ color: '#0c0c0e', letterSpacing: '-0.04em', minWidth: 36, textAlign: 'right' }}>{cat.score}</span>
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
                    <div className="h-full rounded-full relative" style={{ width: ready ? `${cat.score}%` : '0%', background: gradient, boxShadow: `0 0 12px ${glowStrong}`, transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 90 + 180}ms` }}>
                      <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 60%)' }} />
                    </div>
                  </div>
                  <div className="flex justify-between mt-1.5 px-0.5">
                    {[0, 25, 50, 75, 100].map((tick) => (
                      <span key={tick} className="text-[10px]" style={{ color: '#d4d4d8' }}>{tick}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* What Was Analyzed */}
        <div className="w-full rounded-3xl overflow-hidden mb-6" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between px-8 sm:px-10 py-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">What Was Analyzed</h2>
            <span className="text-xs text-zinc-400">{result.analyzedItems.length} checks</span>
          </div>
          <div className="px-8 sm:px-10 py-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.analyzedItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3" style={{ opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(6px)', transition: `opacity 0.45s ease ${i * 70}ms, transform 0.45s ease ${i * 70}ms` }}>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(163,230,53,0.12)', border: '1px solid rgba(163,230,53,0.25)' }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#a3e635" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="w-full rounded-3xl mb-6 overflow-hidden" style={{ background: '#0c0c0e', boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.18)' }}>
          <div className="flex items-center gap-3 px-8 sm:px-10 pt-8 mb-5">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#a3e635', boxShadow: '0 0 8px #a3e635' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#3f3f46' }}>AI Insight</span>
          </div>
          <div className="px-8 sm:px-10 pb-8">
            <div className="text-6xl font-serif leading-none mb-2" style={{ color: 'rgba(163,230,53,0.18)', lineHeight: 0.8 }}>"</div>
            <p className="text-base leading-relaxed" style={{ color: '#a1a1aa', fontStyle: 'italic', maxWidth: 600 }}>
              {result.insightText}
            </p>
          </div>
        </div>

        {/* Top Improvements */}
        <div className="w-full mb-14">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-950" style={{ letterSpacing: '-0.02em' }}>Top Opportunities to Improve</h2>
            <span className="text-xs text-zinc-400 font-medium">Prioritized by impact</span>
          </div>
          <div className="flex flex-col gap-3">
            {result.improvements.map((item, i) => (
              <div key={i} className="group flex gap-5 rounded-2xl px-6 py-6 transition-all duration-200 hover:-translate-y-0.5" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#0c0c0e', color: '#f4f4f5', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <p className="text-sm font-semibold text-zinc-950">{item.title}</p>
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                      style={
                        item.priority === 'High'
                          ? { background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.16)' }
                          : item.priority === 'Medium'
                          ? { background: 'rgba(217,119,6,0.08)', color: '#d97706', border: '1px solid rgba(217,119,6,0.16)' }
                          : { background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.16)' }
                      }
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="w-full rounded-3xl px-8 sm:px-10 py-10 mb-6 flex flex-col items-center text-center" style={{ background: 'linear-gradient(160deg, #111114 0%, #0c0c0e 100%)', boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 16px 48px rgba(0,0,0,0.28)' }}>
          <p className="text-2xl font-bold mb-2" style={{ color: '#f4f4f5', letterSpacing: '-0.025em' }}>Ready to take action?</p>
          <p className="text-sm mb-8" style={{ color: '#71717a', maxWidth: 360 }}>Run a fresh audit on another URL.</p>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <Link href="/audit" className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto text-center" style={{ background: 'rgba(255,255,255,0.07)', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.1)' }}>
              Run Another Audit
            </Link>
          </div>
          <p className="text-xs mt-5" style={{ color: '#3f3f46' }}>Free · No account required</p>
        </div>
      </main>

      <footer className="flex flex-col sm:flex-row items-center justify-between px-8 sm:px-10 py-7 text-sm text-zinc-400" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', maxWidth: 820, margin: '0 auto' }}>
        <span className="font-semibold text-zinc-700 mb-2 sm:mb-0">TrustAudit AI</span>
        <span>© 2026 TrustAudit AI. All rights reserved.</span>
      </footer>
    </div>
  )
}
