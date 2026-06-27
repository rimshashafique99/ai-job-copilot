import { ClipboardPaste, Cpu, Send, LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: ClipboardPaste,
    step: "01",
    title: "Paste the job description",
    description:
      "Drop in any job posting from LinkedIn, Indeed, or a company site. No formatting needed — we read it all.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI analyzes the fit",
    description:
      "Our models compare the role against your profile, surface missing keywords, and score your match in seconds.",
  },
  {
    icon: Send,
    step: "03",
    title: "Get application-ready assets",
    description:
      "Receive a tailored cover letter, cold email, gap report, and a rewritten CV — ready to copy, edit, and send.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 px-4 bg-slate-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            From posting to applied in three steps
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            No prompt engineering, no copy-pasting between tools. Just paste and go.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-800 to-transparent"
            aria-hidden="true"
          />
          {steps.map((s) => (
            <div key={s.step} className="relative text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-5">
                <div className="relative z-10 w-14 h-14 shrink-0 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-center">
                  <s.icon
                    size={22}
                    className="text-indigo-600 dark:text-indigo-400"
                    strokeWidth={1.8}
                  />
                </div>
                <span className="text-4xl font-bold text-gray-200 dark:text-gray-800 md:hidden">
                  {s.step}
                </span>
              </div>
              <span className="hidden md:block text-xs font-bold tracking-widest text-indigo-500/70 dark:text-indigo-400/70 mb-2">
                STEP {s.step}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto md:mx-0">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
