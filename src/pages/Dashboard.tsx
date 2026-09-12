import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, Briefcase, TrendingUp } from 'lucide-react';
import StatCard from '../components/Statcard';
import QuickActions from '../components/QuickAction';
import RecentApplications from '../components/RecentApplications';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface DashboardStats {
  totalApplications: number;
  totalApplicationsGrowthPercent: number | null;
  interviewing: { count: number; scheduledThisWeek: number };
  offers: { count: number };
  recentApplications: Array<{
    id: string;
    company_name: string;
    job_title: string;
    created_at: string;
   stage: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  }>;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await api.get('/dashboard');
  return res.data.data;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(' ')[0] ?? 'there';

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return <div className="px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-400">Loading dashboard…</div>;
  }

  if (isError || !stats) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 text-sm text-red-500">
        Could not load dashboard stats.
      </div>
    );
  }

  const growth = stats.totalApplicationsGrowthPercent;
  const growthLabel =
    growth === null
      ? 'No data from last month'
      : `${growth >= 0 ? '↑' : '↓'} ${Math.abs(growth)}% this month`;

  const statCards = [
    {
      label: 'Total Applications',
      value: stats.totalApplications,
      trend: growthLabel,
      icon: <Briefcase size={18} />,
      accentColor: 'text-indigo-500 dark:text-indigo-400',
    },
    {
      label: 'Interviewing',
      value: stats.interviewing.count,
      sublabel: `${stats.interviewing.scheduledThisWeek} scheduled for this week`,
      icon: <TrendingUp size={18} />,
      accentColor: 'text-amber-500 dark:text-amber-400',
    },
    {
      label: 'Offers',
      value: stats.offers.count,
      sublabel: stats.offers.count > 0 ? 'Active negotiation in progress' : 'No offers yet',
      icon: <LayoutGrid size={18} />,
      accentColor: 'text-emerald-500 dark:text-emerald-400',
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="animate-fade-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {firstName} 
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((stat, i) => (
            <div key={stat.label} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
          <QuickActions />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '320ms' }}>
          <RecentApplications applications={stats.recentApplications} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;