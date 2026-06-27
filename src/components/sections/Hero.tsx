import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles, Check, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-4 overflow-hidden bg-gradient-to-b from-slate-50 via-indigo-50/40 to-white dark:from-gray-950 dark:via-indigo-950/20 dark:to-gray-950">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.14) 0%, transparent 70%)",
        }}
      />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.25]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.07) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 75%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-xs font-medium px-4 py-1.5 rounded-full mb-8 shadow-sm animate-fade-in">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
          </span>
          Powered by industry-leading LLMs
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6 animate-fade-up">
          Paste a job description.{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Get everything else.
            </span>
            <svg
              className="absolute -bottom-1.5 left-0 w-full"
              height="8"
              viewBox="0 0 200 8"
              fill="none"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path
                d="M1 5.5C40 2 80 2 120 4C150 5.5 180 6 199 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="text-indigo-400/60 dark:text-indigo-500/60"
              />
            </svg>
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          Get a personalized cover letter, cold email, gap analysis, and a
          rewritten CV tailored to any role in under 30 seconds. Stop sending
          generic applications.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <Link
            to="/signup"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-300/50 dark:shadow-indigo-900/40 hover:shadow-xl hover:shadow-indigo-300/60 hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors">
            <Play size={13} className="fill-current" />
            Watch Demo
          </button>
        </div>

        {/* Social proof */}
        {/* <div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <div className="flex items-center -space-x-2.5">
            {[
              "from-indigo-400 to-indigo-600",
              "from-violet-400 to-violet-600",
              "from-emerald-400 to-emerald-600",
              "from-orange-400 to-orange-600",
              "from-rose-400 to-rose-600",
            ].map((g, i) => (
              <span
                key={i}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} ring-2 ring-white dark:ring-gray-950`}
              />
            ))}
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-current" />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Loved by <span className="font-semibold text-gray-700 dark:text-gray-300">15,000+</span> job seekers
            </p>
          </div>
        </div> */}
      </div>

      {/* Dashboard preview image */}
      <div
        className="relative z-10 mt-16 w-full max-w-5xl mx-auto px-4 animate-fade-up"
        style={{ animationDelay: "320ms" }}
      >
        {/* Floating stat card — top left */}
        <div className="hidden md:flex absolute -left-4 lg:-left-10 top-16 z-20 items-center gap-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200/80 dark:border-gray-700 rounded-xl px-3.5 py-2.5 shadow-xl shadow-gray-200/50 dark:shadow-black/40 animate-fade-up" style={{ animationDelay: "520ms" }}>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <Check size={16} className="text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">3.4× more</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">interview calls</p>
          </div>
        </div>

        {/* Floating stat card — bottom right */}
        <div className="hidden md:flex absolute -right-4 lg:-right-10 bottom-12 z-20 items-center gap-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200/80 dark:border-gray-700 rounded-xl px-3.5 py-2.5 shadow-xl shadow-gray-200/50 dark:shadow-black/40 animate-fade-up" style={{ animationDelay: "640ms" }}>
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
            <Zap size={16} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">Under 30s</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">per application</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl shadow-indigo-200/40 dark:shadow-black/50">
          {/* Browser chrome bar */}
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div className="flex-1 mx-4 bg-white dark:bg-gray-700 rounded-md h-5 text-xs text-gray-400 flex items-center px-3">
              app.aijobcopilot.io/analyze
            </div>
          </div>
          {/* App mockup — shows analyze page preview */}
          <div className="bg-white dark:bg-gray-900 flex">
            {/* Sidebar */}
            <div className="hidden sm:flex flex-col w-48 border-r border-gray-100 dark:border-gray-800 p-4 gap-1 shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900" />
                <div className="h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
              {[true, false, false, false].map((active, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${
                    active ? "bg-indigo-50 dark:bg-indigo-950" : ""
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded ${active ? "bg-indigo-400" : "bg-gray-200 dark:bg-gray-700"}`}
                  />
                  <div
                    className={`h-2.5 rounded-full ${active ? "bg-indigo-300 w-20" : "bg-gray-200 dark:bg-gray-700 w-14"}`}
                  />
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-0 min-h-[300px]">
              {/* Input pane */}
              <div className="p-5 border-r border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 font-medium mb-3">
                  Input Job Description
                </p>
                <div className="space-y-2 mb-4">
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full w-full" />
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full w-4/5" />
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full w-3/5" />
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full w-full mt-4" />
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full w-2/3" />
                </div>
                <div className="mt-8 bg-indigo-600 text-white text-xs font-medium text-center py-2 rounded-lg flex items-center justify-center gap-1.5">
                  <Sparkles size={12} />
                  Analyze Now
                </div>
              </div>

              {/* Output pane */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    AI Insight: Gap Analysis
                  </p>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                    92% Match
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    &gt; Missing Keywords Identified:
                  </p>
                  <p className="pl-2 text-gray-600 dark:text-gray-400">
                    • Kubernetes (Cloud Infrastructure)
                  </p>
                  <p className="pl-2 text-gray-600 dark:text-gray-400">
                    • Terraform (IaC)
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-2">
                    &gt; Recommended CV Pivot:
                  </p>
                  <p className="pl-2 text-gray-500 dark:text-gray-500 leading-relaxed">
                    Emphasize high-scale deployment patterns in the "Experience"
                    section to align with Tier 1 requirements...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glow under image */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
