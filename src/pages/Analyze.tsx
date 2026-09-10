import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FilePlus2 } from 'lucide-react';
import JobInputPanel from '../components/JobinPutPanel';
import AIOutputCard, { OutputType } from '../components/AIoutputCard';
import api from '../services/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ApplicationCreatedData {
  id: string;
  companyName: string;
  role: string;
  jobDescription: string;
  stage: string;
}

interface ChunkData { type: string; token: string; }
interface DoneData { type: string; outputId: string; }
interface StreamErrorData { type: string; message: string; }
interface FatalErrorData { message: string; }

interface OutputState {
  content: string;
  isStreaming: boolean;
  isLoading: boolean;
}

interface AiOutputRow {
  id: string;
  application_id: string;
  type: string;
  content: string;
  created_at: string;
}

interface JobApplicationWithOutputs {
  id: string;
  role: string | null;
  company_name: string;
  job_title: string | null;
  job_description: string | null;
  stage: string;
  aiOutputs: AiOutputRow[];
}

const INITIAL_OUTPUTS: Record<OutputType, OutputState> = {
  cover_letter: { content: '', isStreaming: false, isLoading: false },
  cold_email:   { content: '', isStreaming: false, isLoading: false },
  gap_analysis: { content: '', isStreaming: false, isLoading: false },
  cv_rewrite:   { content: '', isStreaming: false, isLoading: false },
};

const OUTPUT_ORDER: OutputType[] = ['cover_letter', 'cold_email', 'gap_analysis', 'cv_rewrite'];

const TYPE_FROM_BACKEND: Record<string, OutputType> = {
  coverLetter: 'cover_letter',
  coldEmail: 'cold_email',
  gapAnalysis: 'gap_analysis',
  cvBullets: 'cv_rewrite',
};

const TYPE_TO_BACKEND: Record<OutputType, string> = {
  cover_letter: 'coverLetter',
  cold_email: 'coldEmail',
  gap_analysis: 'gapAnalysis',
  cv_rewrite: 'cvBullets',
};

const OUTPUT_TYPE_FROM_DB: Record<string, OutputType> = {
  cover_letter: 'cover_letter',
  cold_email: 'cold_email',
  gap_analysis: 'gap_analysis',
  cv_bullets: 'cv_rewrite',
};

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

async function fetchJobApplication(id: string): Promise<JobApplicationWithOutputs> {
  const res = await api.get<{ success: boolean; data: JobApplicationWithOutputs }>(`/tracker/${id}`);
  return res.data.data;
}

// ---------------------------------------------------------------------------
// SSE frame parser
// ---------------------------------------------------------------------------
async function consumeSSE(
  response: Response,
  onEvent: (event: string, data: unknown) => void
) {
  if (!response.body) throw new Error('No response body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      if (!frame.trim()) continue;

      let eventName = 'message';
      let dataLine = '';

      for (const line of frame.split('\n')) {
        if (line.startsWith('event:')) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          dataLine += line.slice(5).trim();
        }
      }

      if (!dataLine) continue;

      let parsed: unknown;
      try {
        parsed = JSON.parse(dataLine);
      } catch {
        continue;
      }

      onEvent(eventName, parsed);
    }
  }
}

// ---------------------------------------------------------------------------
// Analyze page
// ---------------------------------------------------------------------------
const Analyze: React.FC = () => {
  const { jobApplicationId: routeId } = useParams<{ jobApplicationId: string }>();
  const navigate = useNavigate();

  const [companyName, setCompanyName]     = useState('');
  const [jobDescription, setJD]           = useState('');
  const [role, setRole]                   = useState('');
  const [isAnalyzing, setIsAnalyzing]     = useState(false);
  const [outputs, setOutputs]             = useState<Record<OutputType, OutputState>>(INITIAL_OUTPUTS);
  const [jobApplicationId, setJobAppId]   = useState<string | null>(null);
  const [fatalError, setFatalError]       = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const currentAppIdRef = useRef<string | null>(null);

  // ---------------------------------------------------------------------------
  // Resume: load an existing job application + its saved AI outputs
  // ---------------------------------------------------------------------------
  const {
    data: existingApplication,
    isLoading: isLoadingExisting,
    isError: isLoadErrorExisting,
  } = useQuery({
    queryKey: ['jobApplication', routeId],
    queryFn: () => fetchJobApplication(routeId as string),
    enabled: !!routeId,
    retry: false, // a 404 (deleted/invalid id) shouldn't retry — go straight to the not-found state
  });

  useEffect(() => {
    if (!existingApplication) return;

    currentAppIdRef.current = existingApplication.id;
    setJobAppId(existingApplication.id);
    setCompanyName(existingApplication.company_name || '');
    setRole(existingApplication.role || existingApplication.job_title || '');
    setJD(existingApplication.job_description || '');

    const nextOutputs: Record<OutputType, OutputState> = {
      cover_letter: { content: '', isStreaming: false, isLoading: false },
      cold_email:   { content: '', isStreaming: false, isLoading: false },
      gap_analysis: { content: '', isStreaming: false, isLoading: false },
      cv_rewrite:   { content: '', isStreaming: false, isLoading: false },
    };

    for (const output of existingApplication.aiOutputs || []) {
      const type = OUTPUT_TYPE_FROM_DB[output.type];
      if (!type) continue;
      nextOutputs[type] = { content: output.content, isStreaming: false, isLoading: false };
    }

    setOutputs(nextOutputs);
  }, [existingApplication]);

  const setOutput = (type: OutputType, patch: Partial<OutputState>) => {
    setOutputs((prev) => ({ ...prev, [type]: { ...prev[type], ...patch } }));
  };

  // ---------------------------------------------------------------------------
  // Shared event handler for both /analyze and /analyze/:id/regenerate streams
  // ---------------------------------------------------------------------------
  const handleStreamEvent = (event: string, data: unknown) => {
    switch (event) {
      case 'application_created': {
        const payload = data as ApplicationCreatedData;
        currentAppIdRef.current = payload.id;
        setJobAppId(payload.id);
        if (payload.role) setRole(payload.role);
        break;
      }
      case 'chunk': {
        const payload = data as ChunkData;
        const type = TYPE_FROM_BACKEND[payload.type];
        if (!type) break;
        setOutputs((prev) => ({
          ...prev,
          [type]: {
            content: prev[type].content + payload.token,
            isStreaming: true,
            isLoading: false,
          },
        }));
        break;
      }
      case 'done': {
        const payload = data as DoneData;
        const type = TYPE_FROM_BACKEND[payload.type];
        if (!type) break;
        setOutput(type, { isStreaming: false, isLoading: false });
        break;
      }
      case 'error': {
        const payload = data as StreamErrorData;
        const type = TYPE_FROM_BACKEND[payload.type];
        if (!type) break;
        setOutput(type, {
          content: '⚠️ Failed to generate this output. Please try again.',
          isStreaming: false,
          isLoading: false,
        });
        break;
      }
      case 'fatal_error': {
        const payload = data as FatalErrorData;
        setFatalError(payload.message || 'Something went wrong during analysis.');
        setIsAnalyzing(false);
        setOutputs((prev) => {
          const next = { ...prev };
          for (const type of OUTPUT_ORDER) {
            if (next[type].isLoading || next[type].isStreaming) {
              next[type] = { ...next[type], isLoading: false, isStreaming: false };
            }
          }
          return next;
        });
        break;
      }
      case 'complete': {
        setIsAnalyzing(false);
        // Item 2: a fresh draft that just became a real, saved application
        // gets its own URL — /analyze is a compose screen, not a permanent home.
        if (!routeId && currentAppIdRef.current) {
          navigate(`/analyze/${currentAppIdRef.current}`, { replace: true });
        }
        break;
      }
      default:
        break;
    }
  };

  // ---------------------------------------------------------------------------
  // Main analyze handler
  // ---------------------------------------------------------------------------
  const handleAnalyze = async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFatalError(null);
    setIsAnalyzing(true);
    setOutputs({
      cover_letter: { content: '', isStreaming: true, isLoading: true },
      cold_email:   { content: '', isStreaming: true, isLoading: true },
      gap_analysis: { content: '', isStreaming: true, isLoading: true },
      cv_rewrite:   { content: '', isStreaming: true, isLoading: true },
    });

    try {
      const res = await fetch(`${BASE_URL}/analyze`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          role,
          jobDescription,
          ...(jobApplicationId ? { jobApplicationId } : {}),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to start analysis.');
      }

      await consumeSSE(res, handleStreamEvent);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Failed to start analysis.';
      setFatalError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Single-card regenerate
  // ---------------------------------------------------------------------------
  const handleRegenerate = async (type: OutputType) => {
    if (!jobApplicationId) {
      setFatalError('Run a full analysis first before regenerating a section.');
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setOutput(type, { content: '', isStreaming: true, isLoading: true });

    try {
      const res = await fetch(`${BASE_URL}/analyze/${jobApplicationId}/regenerate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: TYPE_TO_BACKEND[type] }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to regenerate.');
      }

      await consumeSSE(res, handleStreamEvent);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setOutput(type, {
        content: '⚠️ Failed to generate output. Please try again.',
        isStreaming: false,
        isLoading: false,
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Item 3: loading state while fetching a saved application
  // ---------------------------------------------------------------------------
  if (routeId && isLoadingExisting) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        Loading your analysis…
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Item 4: invalid/deleted id — dedicated not-found screen, not a broken page
  // ---------------------------------------------------------------------------
  if (routeId && isLoadErrorExisting) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Analysis not found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This application may have been deleted or no longer exists.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate('/tracker')}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
          >
            Back to Tracker
          </button>
          <button
            onClick={() => navigate('/analyze')}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            New Analysis
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Item 7: current-application context header — only once we have a real, saved id */}
        {jobApplicationId && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <button
                onClick={() => navigate('/tracker')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
              >
                <ArrowLeft size={13} />
                Back to Tracker
              </button>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                {role || 'Untitled Role'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {companyName || 'Unknown Company'}
              </p>
            </div>
            <button
              onClick={() => navigate('/analyze')}
              className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              <FilePlus2 size={14} />
              New Analysis
            </button>
          </div>
        )}

        {fatalError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {fatalError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">

          {/* Left: Job input panel */}
          <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 animate-fade-up">
            <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-xl p-6 lg:sticky lg:top-20 shadow-sm dark:shadow-none">
              <JobInputPanel
                companyName={companyName}
                role={role}
                jobDescription={jobDescription}
                isAnalyzing={isAnalyzing}
                onCompanyChange={setCompanyName}
                onRoleChange={setRole}
                onJDChange={setJD}
                onAnalyze={handleAnalyze}
              />
            </div>
          </div>

          {/* Right: 2×2 output cards grid */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;