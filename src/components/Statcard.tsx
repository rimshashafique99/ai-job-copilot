import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: string;
  icon: React.ReactNode;
  accentColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  trend,
  icon,
  accentColor = 'text-indigo-500 dark:text-indigo-400',
}) => {
  return (
    <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-xl p-5 flex flex-col gap-3 shadow-sm dark:shadow-none hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span className={accentColor}>{icon}</span>
      </div>
      <div>
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
        {trend && (
          <span className="ml-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {trend}
          </span>
        )}
      </div>
      {sublabel && (
        <p className="text-xs text-slate-500 dark:text-slate-500">{sublabel}</p>
      )}
    </div>
  );
};

export default StatCard;
