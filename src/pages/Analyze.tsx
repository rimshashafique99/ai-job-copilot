import React, { useState, useRef } from 'react';
import JobInputPanel from '../components/JobinPutPanel';
import AIOutputCard, { OutputType } from '../components/AIoutputCard';
// import { Wand2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface OutputState {
  content: string;
  isStreaming: boolean;
  isLoading: boolean;
}

const INITIAL_OUTPUTS: Record<OutputType, OutputState> = {
  cover_letter: { content: '', isStreaming: false, isLoading: false },
  cold_email:   { content: '', isStreaming: false, isLoading: false },
  gap_analysis: { content: '', isStreaming: false, isLoading: false },
  cv_rewrite:   { content: '', isStreaming: false, isLoading: false },
};

const OUTPUT_ORDER: OutputType[] = ['cover_letter', 'cold_email', 'gap_analysis', 'cv_rewrite'];

// ---------------------------------------------------------------------------
// Analyze page
// ---------------------------------------------------------------------------
const Analyze: React.FC = () => {
  const [companyName, setCompanyName]   = useState('');
  const [jobDescription, setJD]         = useState('');
  const [isAnalyzing, setIsAnalyzing]   = useState(false);
  const [outputs, setOutputs]           = useState<Record<OutputType, OutputState>>(INITIAL_OUTPUTS);

  // Ref to abort ongoing streams if user triggers again
  const abortRef = useRef<AbortController | null>(null);

  // ---------------------------------------------------------------------------
  // SSE streaming helper
  // ---------------------------------------------------------------------------
  const streamOutput = async (type: OutputType, signal: AbortSignal) => {
    const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
    const token = localStorage.getItem('access_token');

    setOutputs((prev) => ({
      ...prev,
      [type]: { content: '', isStreaming: true, isLoading: true },
    }));

    try {
      // The real endpoint is POST /api/analyze (SSE) — this helper
      // handles one output type as a standalone regenerate call
      const res = await fetch(`${BASE_URL}/analyze/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type, jobDescription, companyName }),
        signal,
      });

      if (!res.body) throw new Error('No response body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // SSE format: "data: <token>\n\n"
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const token = line.slice(6);
            if (token === '[DONE]') break;
            accumulated += token;
            setOutputs((prev) => ({
              ...prev,
              [type]: { content: accumulated, isStreaming: true, isLoading: false },
            }));
          }
        }
      }

      setOutputs((prev) => ({
        ...prev,
        [type]: { content: accumulated, isStreaming: false, isLoading: false },
      }));
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error(`Stream error for ${type}:`, err);
      setOutputs((prev) => ({
        ...prev,
        [type]: {
          content: '⚠️ Failed to generate output. Please try again.',
          isStreaming: false,
          isLoading: false,
        },
      }));
    }
  };

  // ---------------------------------------------------------------------------
  // Main analyze handler — fires all 4 streams in parallel (Promise.all)
  // ---------------------------------------------------------------------------
  const handleAnalyze = async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsAnalyzing(true);

    // Mark all as loading immediately
    setOutputs({
      cover_letter: { content: '', isStreaming: true, isLoading: true },
      cold_email:   { content: '', isStreaming: true, isLoading: true },
      gap_analysis: { content: '', isStreaming: true, isLoading: true },
      cv_rewrite:   { content: '', isStreaming: true, isLoading: true },
    });

    try {
      // Fire all 4 in parallel — mirrors the backend Promise.all approach
      await Promise.all(
        OUTPUT_ORDER.map((type) => streamOutput(type, controller.signal))
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Single card regenerate
  const handleRegenerate = (type: OutputType) => {
    const controller = new AbortController();
    abortRef.current = controller;
    streamOutput(type, controller.signal);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ---- Two-column layout ---- */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">

          {/* Left: Job input panel */}
          <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 animate-fade-up">
            <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-xl p-6 lg:sticky lg:top-20 shadow-sm dark:shadow-none">
              <JobInputPanel
                companyName={companyName}
                jobDescription={jobDescription}
                isAnalyzing={isAnalyzing}
                onCompanyChange={setCompanyName}
                onJDChange={setJD}
                onAnalyze={handleAnalyze}
              />
            </div>
          </div>

          {/* Right: 2×2 output cards grid */}
          <div className="flex-1 min-w-0">

            {/* Empty state */}
            {/* {OUTPUT_ORDER.every((t) => !outputs[t].content && !outputs[t].isLoading) && (
              <div className="hidden lg:flex flex-col items-center justify-center h-64 gap-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center">
                  <Wand2 size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-500 text-sm max-w-xs">
                  Paste a job description on the left and click <span className="text-indigo-600 dark:text-indigo-400 font-medium">Analyze</span> to generate all 4 outputs instantly.
                </p>
              </div>
            )} */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OUTPUT_ORDER.map((type, i) => (
                <div
                  key={type}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <AIOutputCard
                    type={type}
                    content={outputs[type].content}
                    isStreaming={outputs[type].isStreaming}
                    isLoading={outputs[type].isLoading}
                    onRegenerate={() => handleRegenerate(type)}
                  />
                </div>
              ))}
            </div>

            {/* Bottom upsell strip */}
            {/* <div className="mt-6 border border-slate-200 dark:border-white/[0.06] rounded-xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#1a1d2e] shadow-sm dark:shadow-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center shrink-0">
                  <Wand2 size={15} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Need a specific asset?</p>
                  <p className="text-xs text-slate-500">
                    Request custom technical summaries or interview prep notes.
                  </p>
                </div>
              </div>
              <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 uppercase tracking-wider transition-colors whitespace-nowrap">
                Explore More Tools →
              </button>
            </div> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;