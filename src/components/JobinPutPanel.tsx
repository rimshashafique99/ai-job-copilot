import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface JobInputPanelProps {
  companyName: string;
  jobDescription: string;
  isAnalyzing: boolean;
  onCompanyChange: (val: string) => void;
  onJDChange: (val: string) => void;
  onAnalyze: () => void;
}

const JobInputPanel: React.FC<JobInputPanelProps> = ({
  companyName,
  jobDescription,
  isAnalyzing,
  onCompanyChange,
  onJDChange,
  onAnalyze,
}) => {
  const canAnalyze = jobDescription.trim().length > 30 && !isAnalyzing;

  return (
    <div className="flex flex-col gap-5 h-full">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Job Analysis</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Paste the job details below and let AI optimize your application strategy.
        </p>
      </div>

      {/* Company Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Company Name
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => onCompanyChange(e.target.value)}
          placeholder="e.g. Acme Tech Corp"
          className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
        />
      </div>

      {/* Job Description */}
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Paste Job Description here
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => onJDChange(e.target.value)}
          placeholder="Paste the full job posting text here…"
          className="flex-1 min-h-[180px] w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all leading-relaxed"
        />
        <p className="text-xs text-slate-400 dark:text-slate-600 text-right">
          {jobDescription.length} characters
        </p>
      </div>

      {/* Analyze button */}
      <button
        onClick={onAnalyze}
        disabled={!canAnalyze}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20"
      >
        {isAnalyzing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analyzing…
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Analyze
          </>
        )}
      </button>
    </div>
  );
};

export default JobInputPanel;
