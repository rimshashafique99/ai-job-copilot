import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LayoutGrid } from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Analyze card */}
      <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden shadow-sm dark:shadow-none hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 dark:from-indigo-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-indigo-500/5 pointer-events-none" />

        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-600/20 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400" />
        </div>

        <div>
          <h3 className="text-slate-900 dark:text-white font-semibold text-base mb-1">
            Analyze a New Job
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Paste a JD or upload a PDF to get instant AI-powered compatibility score and
            tailored resume keywords.
          </p>
        </div>

        <button
          onClick={() => navigate('/analyze')}
          className="mt-auto self-start flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Sparkles size={14} />
          Launch Analyzer
        </button>
      </div>

      {/* Tracker card */}
      <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden shadow-sm dark:shadow-none hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 dark:from-violet-600/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-violet-500/5 pointer-events-none" />

        <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-600/20 flex items-center justify-center shrink-0">
          <LayoutGrid size={18} className="text-violet-600 dark:text-violet-400" />
        </div>

        <div>
          <h3 className="text-slate-900 dark:text-white font-semibold text-base mb-1">
            View Tracker
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Manage your pipeline, update statuses, and track follow-up tasks for your active
            applications.
          </p>
        </div>

        <button
          onClick={() => navigate('/tracker')}
          className="mt-auto self-start flex items-center gap-2 border border-slate-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/40 hover:bg-violet-50 dark:hover:bg-violet-500/10 text-slate-700 dark:text-slate-300 hover:text-violet-700 dark:hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
        >
          <LayoutGrid size={14} />
          Open Pipeline
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
