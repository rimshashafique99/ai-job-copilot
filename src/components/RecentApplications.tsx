import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Eye, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';
import ActionsMenu from './ActionsMenu';

type Status = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';

interface ApplicationDTO {
  id: string;
  company_name: string;
  job_title: string;
  created_at: string;
  stage: Status;
}

interface RecentApplicationsProps {
  applications: ApplicationDTO[];
}

const STATUS_STYLES: Record<Status, string> = {
  saved:
    'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/[0.05] dark:text-slate-400 dark:border-white/[0.08]',
  applied:
    'bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-400/10 dark:text-sky-400 dark:border-sky-400/20',
  interviewing:
    'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20',
  offer:
    'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20',
  rejected:
    'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-400/10 dark:text-rose-400 dark:border-rose-400/20',
};

const DEFAULT_STATUS_STYLE =
  'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/[0.04] dark:text-slate-400 dark:border-white/[0.06]';

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-indigo-500', 'bg-rose-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-violet-500', 'bg-sky-500',
];

const colorForCompany = (name: string) => {
  const hash = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const RecentApplications: React.FC<RecentApplicationsProps> = ({ applications }) => {
  const navigate = useNavigate();

  const buildActions = (app: ApplicationDTO) => [
    { label: 'View Details', icon: <Eye size={15} />, onClick: () => navigate('/tracker') },
    { label: 'Edit', icon: <Pencil size={15} /> },
    { label: 'Change Status', icon: <ArrowRightLeft size={15} /> },
    {
      label: 'Delete',
      icon: <Trash2 size={15} />,
      danger: true,
      onClick: () => window.confirm(`Remove your ${app.company_name} application?`),
    },
  ];

  if (applications.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-xl p-8 text-center shadow-sm dark:shadow-none">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No applications yet. Paste a job description on the Analyze page to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-xl overflow-hidden shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/[0.06]">
        <h2 className="text-slate-900 dark:text-white font-semibold text-base">
          Recent Applications
        </h2>
        <button
          onClick={() => navigate('/tracker')}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          View All
          <ExternalLink size={11} />
        </button>
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/[0.04]">
              {['Company', 'Role', 'Date Applied', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app, idx) => (
              <tr
                key={app.id}
                className={`hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors ${
                  idx < applications.length - 1
                    ? 'border-b border-slate-100 dark:border-white/[0.04]'
                    : ''
                }`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-md ${colorForCompany(app.company_name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                    >
                      {app.company_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                      {app.company_name || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    {app.job_title || 'Untitled role'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(app.created_at)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[app.stage] ?? DEFAULT_STATUS_STYLE}`}
                  >
                    {app.stage}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <ActionsMenu items={buildActions(app)} align="right" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden divide-y divide-slate-100 dark:divide-white/[0.04]">
        {applications.map((app) => (
          <div key={app.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-md ${colorForCompany(app.company_name)} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {app.company_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {app.company_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">
                    {app.job_title || 'Untitled role'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[app.stage] ?? DEFAULT_STATUS_STYLE}`}
                >
                  {app.stage}
                </span>
                <ActionsMenu items={buildActions(app)} align="right" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{formatDate(app.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplications;