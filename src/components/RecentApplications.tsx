import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, ExternalLink } from 'lucide-react';

type Status = 'interviewing' | 'applied' | 'offer' | 'rejected';

interface Application {
  id: string;
  company: string;
  companyInitial: string;
  companyColor: string;
  role: string;
  dateApplied: string;
  status: Status;
  matchScore: number;
}

const PLACEHOLDER_APPS: Application[] = [
  {
    id: '1',
    company: 'Google',
    companyInitial: 'G',
    companyColor: 'bg-blue-500',
    role: 'Senior Frontend Engineer',
    dateApplied: 'Oct 24, 2024',
    status: 'interviewing',
    matchScore: 94,
  },
  {
    id: '2',
    company: 'Stripe',
    companyInitial: 'S',
    companyColor: 'bg-indigo-500',
    role: 'Staff Software Engineer',
    dateApplied: 'Oct 22, 2024',
    status: 'applied',
    matchScore: 88,
  },
  {
    id: '3',
    company: 'Airbnb',
    companyInitial: 'A',
    companyColor: 'bg-rose-500',
    role: 'Product Developer',
    dateApplied: 'Oct 19, 2024',
    status: 'offer',
    matchScore: 91,
  },
];

const STATUS_STYLES: Record<Status, string> = {
  interviewing: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  applied:      'bg-sky-400/10 text-sky-400 border border-sky-400/20',
  offer:        'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
  rejected:     'bg-rose-400/10 text-rose-400 border border-rose-400/20',
};

const SCORE_COLOR = (score: number) => {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 75) return 'bg-amber-400';
  return 'bg-rose-400';
};

const RecentApplications: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1a1d2e] border border-white/[0.06] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <h2 className="text-white font-semibold text-base">Recent Applications</h2>
        <button
          onClick={() => navigate('/tracker')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          View All
          <ExternalLink size={11} />
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {['Company', 'Role', 'Date Applied', 'Status', 'Match Score', 'Actions'].map((h) => (
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
            {PLACEHOLDER_APPS.map((app, idx) => (
              <tr
                key={app.id}
                className={`hover:bg-white/[0.02] transition-colors ${
                  idx < PLACEHOLDER_APPS.length - 1 ? 'border-b border-white/[0.04]' : ''
                }`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-md ${app.companyColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                    >
                      {app.companyInitial}
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{app.company}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-indigo-400 font-medium">{app.role}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-400">{app.dateApplied}</span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[app.status]}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${SCORE_COLOR(app.matchScore)}`}
                        style={{ width: `${app.matchScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">{app.matchScore}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <button className="text-slate-500 hover:text-slate-300 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-white/[0.04]">
        {PLACEHOLDER_APPS.map((app) => (
          <div key={app.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-md ${app.companyColor} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {app.companyInitial}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{app.company}</p>
                  <p className="text-xs text-indigo-400">{app.role}</p>
                </div>
              </div>
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[app.status]}`}
              >
                {app.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{app.dateApplied}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${SCORE_COLOR(app.matchScore)}`}
                    style={{ width: `${app.matchScore}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-300">{app.matchScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplications;