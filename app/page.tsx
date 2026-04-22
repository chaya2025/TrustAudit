import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Trust Analysis",
    desc: "We scan every corner of your site for trust signals — security badges, social proof, clear policies — and show you exactly what's missing.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    title: "Conversion Insights",
    desc: "Discover exactly why visitors leave without converting. Get data-backed, prioritised fixes that improve your funnel from the first audit.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
      </svg>
    ),
    title: "Design Feedback",
    desc: "AI reviews your layout, colour palette, and typography against proven conversion principles and gives you a clear, actionable score.",
  },
];

const scoreBreakdown = [
  { label: "Trust Score", value: 91, color: "#4ade80", glow: "#4ade8066" },
  { label: "Conversion", value: 74, color: "#60a5fa", glow: "#60a5fa66" },
  { label: "Design", value: 88, color: "#c084fc", glow: "#c084fc66" },
];

// Circle circumference: 2π × r=42 ≈ 263.9
const CIRCUMFERENCE = 263.9;
const SCORE = 83;

export default async function Home() {
  const { userId } = await auth()
  return (
    <div className="min-h-screen bg-white text-zinc-900" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>

      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-5"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <span className="text-base font-semibold tracking-tight text-zinc-950">TrustAudit AI</span>
        {userId ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950">
              Sign In
            </button>
          </SignInButton>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-44 pb-24">

        {/* Live-pulse badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-500 text-xs font-medium tracking-wide mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          AI-Powered Website Intelligence
        </div>

        {/* Main headline */}
        <h1
          className="text-5xl sm:text-7xl font-bold leading-none text-zinc-950 mb-6"
          style={{ letterSpacing: "-0.03em" }}
        >
          Build Trust.<br />Grow Results.
        </h1>

        {/* Sub-headline */}
        <p className="text-lg sm:text-xl text-zinc-500 max-w-lg mb-10 leading-relaxed">
          TrustAudit AI gives your website an instant score on trust, conversions, and design — so more visitors become paying customers.
        </p>

        {/* Primary CTA */}
        <Link
          href="/audit"
          className="px-8 py-4 rounded-full bg-zinc-950 text-white text-sm font-semibold transition-all duration-200 hover:bg-zinc-700 hover:-translate-y-0.5"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
        >
          Start Free Audit →
        </Link>

        {/* Trust micro-copy */}
        <p className="mt-6 text-xs text-zinc-400 font-medium tracking-wide">
          No credit card required &nbsp;·&nbsp; Results in 30 seconds
        </p>
      </section>

      {/* ── Demo Score Card ── */}
      <section className="flex justify-center px-6 pb-28">
        <div
          className="w-full max-w-2xl rounded-3xl overflow-hidden"
          style={{ background: "#0c0c0e", boxShadow: "0 32px 80px rgba(0,0,0,0.28)" }}
        >
          {/* Fake macOS browser chrome */}
          <div
            className="flex items-center gap-2 px-6 pt-5 pb-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
            <div
              className="flex-1 ml-4 rounded-full px-4 py-1.5 text-xs font-mono"
              style={{ background: "rgba(255,255,255,0.06)", color: "#71717a" }}
            >
              yourwebsite.com
            </div>
          </div>

          {/* Score content */}
          <div className="flex flex-col sm:flex-row items-center gap-8 px-8 py-8">

            {/* Circular dial */}
            <div
              className="relative flex-shrink-0 flex items-center justify-center"
              style={{ width: 144, height: 144 }}
            >
              <svg width="144" height="144" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.07)" strokeWidth="8" fill="none" />
                <circle
                  cx="50" cy="50" r="42"
                  stroke="#a3e635"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - SCORE / 100)}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold" style={{ color: "#f4f4f5", letterSpacing: "-0.04em" }}>
                  {SCORE}
                </span>
                <span className="text-xs" style={{ color: "#52525b" }}>/ 100</span>
              </div>
            </div>

            {/* Bar breakdown */}
            <div className="flex-1 w-full space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#52525b" }}>
                Score Breakdown
              </p>
              {scoreBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: "#a1a1aa" }}>{item.label}</span>
                    <span className="font-semibold" style={{ color: "#f4f4f5" }}>{item.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.value}%`, background: item.color, boxShadow: `0 0 8px ${item.glow}` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div
            className="flex items-center justify-between px-8 py-4 text-xs"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#52525b" }}
          >
            <span>Audited by TrustAudit AI</span>
            <span className="font-medium" style={{ color: "#a3e635" }}>Good standing</span>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="px-6 pb-28 mx-auto" style={{ maxWidth: 1024 }}>
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4"
            style={{ letterSpacing: "-0.025em" }}
          >
            Everything you need to earn trust
          </h2>
          <p className="text-zinc-500 text-lg max-w-md mx-auto">
            Three pillars of a website that converts visitors into customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map((card) => (
            <div
              key={card.title}
              className="p-8 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-5 text-zinc-700"
                style={{ background: "#f0f0f4" }}
              >
                {card.icon}
              </div>
              <h3 className="text-base font-semibold text-zinc-950 mb-2">{card.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 pb-28 mx-auto" style={{ maxWidth: 1024 }}>
        <div
          className="rounded-3xl px-10 py-16 flex flex-col items-center text-center"
          style={{ background: "#0c0c0e" }}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.025em" }}
          >
            Ready to see your score?
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-md">
            Get a full audit of your website in 30 seconds. Free, no credit card needed.
          </p>
          <Link
            href="/audit"
            className="px-8 py-4 rounded-full bg-zinc-50 text-zinc-950 text-sm font-semibold transition-all duration-200 hover:bg-white hover:-translate-y-0.5"
            style={{ boxShadow: "0 2px 12px rgba(255,255,255,0.12)" }}
          >
            Start Free Audit →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="flex flex-col sm:flex-row items-center justify-between px-8 sm:px-10 py-7 text-sm text-zinc-400"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <span className="font-semibold text-zinc-700 mb-2 sm:mb-0">TrustAudit AI</span>
        <span>© 2026 TrustAudit AI. All rights reserved.</span>
      </footer>

    </div>
  );
}
