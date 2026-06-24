import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="px-4 pb-16 sm:pb-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-16 sm:py-20 text-center"
          style={{
            background:
              "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)",
          }}
        >
          {/* Subtle mesh overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, rgba(167,139,250,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.3) 0%, transparent 50%)",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Ready to hack your hiring process?
            </h2>
            <p className="text-indigo-200 text-base sm:text-lg mb-8 max-w-md mx-auto">
              Join 15,000+ developers landing interviews at Top Tech companies.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white font-semibold text-sm px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-900/40"
            >
              Create Free Account
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
