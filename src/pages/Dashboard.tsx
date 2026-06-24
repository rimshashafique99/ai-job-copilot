import React from 'react';
import { LayoutGrid, Briefcase, TrendingUp } from 'lucide-react';
import StatCard from '../components/Statcard';
import QuickActions from '../components/QuickAction';
import RecentApplications from '../components/RecentApplications';

// Replace with real auth context user
const MOCK_USER = { full_name: 'Rimsha' };

const Dashboard: React.FC = () => {
  // Swap this with useAuth() when wiring up AuthContext
  const user = MOCK_USER;
  const firstName = user.full_name?.split(' ')[0] ?? 'there';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Welcome header */}
        <div className="animate-fade-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your AI Copilot has prepared 4 new job matches and updated 2 status changes since your last visit.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Applications',
              value: 128,
              trend: '↑ 12% this month',
              icon: <Briefcase size={18} />,
              accentColor: 'text-indigo-500 dark:text-indigo-400',
            },
            {
              label: 'Interviewing',
              value: 8,
              sublabel: '3 scheduled for this week',
              icon: <TrendingUp size={18} />,
              accentColor: 'text-amber-500 dark:text-amber-400',
            },
            {
              label: 'Offers',
              value: 2,
              sublabel: 'Active negotiation in progress',
              icon: <LayoutGrid size={18} />,
              accentColor: 'text-emerald-500 dark:text-emerald-400',
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
          <QuickActions />
        </div>

        {/* Recent applications */}
        <div className="animate-fade-up" style={{ animationDelay: '320ms' }}>
          <RecentApplications />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;