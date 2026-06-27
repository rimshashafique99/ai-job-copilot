/**
 * LogoCloud
 *
 * Social-proof strip shown right under the hero. Text wordmarks keep it
 * dependency-free (no image assets) while still reading as "trusted by".
 */
const companies = ["Google", "Stripe", "Meta", "Airbnb", "Notion", "Shopify"];

export default function LogoCloud() {
  return (
    <section className="py-12 px-4 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-900">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-8">
          Members have landed roles at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {companies.map((name) => (
            <span
              key={name}
              className="text-lg sm:text-xl font-semibold text-gray-400 dark:text-gray-600 grayscale opacity-80 hover:opacity-100 hover:text-gray-600 dark:hover:text-gray-400 transition-all"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
