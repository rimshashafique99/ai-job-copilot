/**
 * Stats
 *
 * Compact metrics band that adds a sense of scale / credibility between the
 * "how it works" and feature sections.
 */
const stats = [
  { value: "15,000+", label: "Active job seekers" },
  { value: "120K+", label: "Applications tailored" },
  { value: "3.4×", label: "More interview calls" },
  { value: "< 30s", label: "Avg. turnaround" },
];

export default function Stats() {
  return (
    <section className="px-4 py-16 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-gray-900 px-6 py-8 text-center"
            >
              <p className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
