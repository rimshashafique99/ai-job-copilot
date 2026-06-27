import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string; // gradient classes
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I went from zero callbacks to four interviews in two weeks. The gap analysis told me exactly what my resume was missing for each role.",
    name: "Sarah Chen",
    role: "Frontend Engineer → Stripe",
    avatar: "from-indigo-400 to-indigo-600",
  },
  {
    quote:
      "The cover letters genuinely sound like me, not a robot. I used to spend an hour per application — now it's two minutes.",
    name: "Marcus Webb",
    role: "Product Designer → Notion",
    avatar: "from-violet-400 to-violet-600",
  },
  {
    quote:
      "The cold email templates got me a referral I never would have asked for otherwise. This paid for itself on day one.",
    name: "Priya Nair",
    role: "Data Scientist → Airbnb",
    avatar: "from-emerald-400 to-emerald-600",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 px-4 bg-slate-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            People are landing real offers
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Thousands of job seekers use AI Job Copilot to apply smarter, not harder.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-0.5 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  “{t.quote}”
                </blockquote>
              </div>
              <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                <span
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatar} shrink-0`}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
