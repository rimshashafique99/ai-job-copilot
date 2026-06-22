import React, { useState } from 'react';
import {
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Check,
  FileText,
  Mail,
  AlertCircle,
  Pencil,
} from 'lucide-react';

export type OutputType = 'cover_letter' | 'cold_email' | 'gap_analysis' | 'cv_rewrite';

interface AIOutputCardProps {
  type: OutputType;
  content: string;
  isStreaming?: boolean;
  isLoading?: boolean;
  onRegenerate?: () => void;
}

const TYPE_META: Record<
  OutputType,
  { label: string; icon: React.ReactNode; accent: string; iconBg: string }
> = {
  cover_letter: {
    label: 'Cover Letter',
    icon: <FileText size={14} />,
    accent: 'text-indigo-400',
    iconBg: 'bg-indigo-500/15',
  },
  cold_email: {
    label: 'Cold Email',
    icon: <Mail size={14} />,
    accent: 'text-sky-400',
    iconBg: 'bg-sky-500/15',
  },
  gap_analysis: {
    label: 'Gap Analysis',
    icon: <AlertCircle size={14} />,
    accent: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
  },
  cv_rewrite: {
    label: 'CV Bullets',
    icon: <Pencil size={14} />,
    accent: 'text-violet-400',
    iconBg: 'bg-violet-500/15',
  },
};

const AIOutputCard: React.FC<AIOutputCardProps> = ({
  type,
  content,
  isStreaming = false,
  isLoading = false,
  onRegenerate,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const meta = TYPE_META[type];

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1a1d2e] border border-white/[0.06] rounded-xl flex flex-col overflow-hidden h-full">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-md ${meta.iconBg} ${meta.accent}`}>
            {meta.icon}
          </span>
          <span className={`text-sm font-semibold ${meta.accent}`}>{meta.label}</span>
          {isStreaming && (
            <span className="flex gap-0.5 items-end h-3 ml-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`w-0.5 rounded-full ${meta.accent.replace('text-', 'bg-')} animate-bounce`}
                  style={{ animationDelay: `${i * 0.15}s`, height: i === 1 ? '12px' : '8px' }}
                />
              ))}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {content && (
            <>
              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-all"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
              <button
                onClick={onRegenerate}
                title="Regenerate"
                disabled={isStreaming || isLoading}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw size={13} className={isStreaming ? 'animate-spin' : ''} />
              </button>
            </>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-all"
          >
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>
      </div>

      {/* Card body */}
      {!collapsed && (
        <div className="flex-1 p-4 overflow-y-auto max-h-72 custom-scroll">
          {isLoading && !content ? (
            <div className="flex flex-col gap-2 animate-pulse">
              {[100, 90, 95, 80, 70].map((w, i) => (
                <div key={i} className="h-3 rounded-full bg-white/[0.06]" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : content ? (
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {content}
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
              )}
            </p>
          ) : (
            <p className="text-sm text-slate-600 italic">Output will appear here after analysis…</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AIOutputCard;