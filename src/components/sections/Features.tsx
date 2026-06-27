import { LucideIcon, FileText, Mail, Search, Edit3 } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: FileText,
    iconBg: "bg-indigo-50 dark:bg-indigo-950",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    title: "Cover Letter",
    description:
      "Generates human-like, persuasive cover letters that highlight your specific accomplishments relative to the role.",
  },
  {
    icon: Mail,
    iconBg: "bg-violet-50 dark:bg-violet-950",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Cold Email",
    description:
      "Draft high-conversion networking emails for recruiters and hiring managers based on your shared background.",
  },
  {
    icon: Search,
    iconBg: "bg-orange-50 dark:bg-orange-950",
    iconColor: "text-orange-600 dark:text-orange-400",
    title: "Gap Analysis",
    description:
      "Instantly spot keywords and skills you're missing from your resume before you hit the submit button.",
  },
  {
    icon: Edit3,
    iconBg: "bg-emerald-50 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    title: "CV Rewriter",
    description:
      "Bullet point optimization that emphasizes metrics and outcomes, tailored specifically to the target job description.",
  },
];

export default function Features() {
  return (
    <section className="py-20 sm:py-28 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Powerful Tools for Every Application
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Stop sending generic applications. Our suite of AI agents tailors
            your professional identity for every single submission.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-200"
            >
              <div
                className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
              >
                <f.icon size={18} className={f.iconColor} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
