import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden bg-gradient-to-b from-slate-50 via-indigo-50/40 to-white dark:from-gray-950 dark:via-indigo-950/20 dark:to-gray-950">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        {/* <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-4 py-1.5 rounded-full mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Beta Access Now Live
        </div> */}

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-6">
          Paste a job description.{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            Get everything else.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Get a personalized cover letter, cold email, gap analysis, and a
          rewritten CV tailored to any role — in under 30 seconds. Powered by
          industry-leading LLMs.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
          >
            Get Started Free
            <ArrowRight size={15} />
          </Link>
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors">
            <Play size={13} className="fill-current" />
            Watch Demo
          </button>
        </div>
      </div>

      {/* Dashboard preview image */}
      <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto px-4">
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl shadow-gray-200/60 dark:shadow-black/40">
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
                <div className="mt-8 bg-indigo-600 text-white text-xs font-medium text-center py-2 rounded-lg">
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
              "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
