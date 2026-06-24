import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  SlidersHorizontal,
  AlertTriangle,
  Bell,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  Trash2,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { logout } from "../lib/auth";
import ConfirmDialog from "../components/ConfirmDialog";

const Settings: React.FC = () => {
  const { darkMode, toggleDark } = useTheme();
  const navigate = useNavigate();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [account, setAccount] = useState({
    email: "alex.dev@example.com",
    fullName: "Alex Rivera",
    currentPassword: "",
    newPassword: "",
  });

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleDelete = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6 animate-fade-up">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your account preferences and subscription details.
          </p>
        </div>

        {/* Account Settings */}
        <Card>
          <CardHeader icon={<User size={16} />} title="Account Settings" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email Address">
              <input
                type="email"
                value={account.email}
                onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))}
                className="profile-input"
              />
            </Field>
            <Field label="Full Name">
              <input
                type="text"
                value={account.fullName}
                onChange={(e) => setAccount((a) => ({ ...a, fullName: e.target.value }))}
                className="profile-input"
              />
            </Field>
          </div>

          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Password Update
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Current Password">
              <input
                type="password"
                value={account.currentPassword}
                onChange={(e) => setAccount((a) => ({ ...a, currentPassword: e.target.value }))}
                placeholder="••••••••"
                className="profile-input"
              />
            </Field>
            <Field label="New Password">
              <input
                type="password"
                value={account.newPassword}
                onChange={(e) => setAccount((a) => ({ ...a, newPassword: e.target.value }))}
                placeholder="Min. 8 characters"
                className="profile-input"
              />
            </Field>
          </div>

          <div className="flex justify-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader icon={<SlidersHorizontal size={16} />} title="Preferences" />

          <PreferenceRow
            title="Email Notifications"
            description="Alerts for job matches"
            control={<Toggle on={emailAlerts} onToggle={() => setEmailAlerts((v) => !v)} />}
            icon={<Bell size={15} />}
          />
          <PreferenceRow
            title="System Theme"
            description={darkMode ? "Dark mode active" : "Light mode active"}
            icon={darkMode ? <Moon size={15} /> : <Sun size={15} />}
            control={
              <button
                onClick={toggleDark}
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            }
          />
          <PreferenceRow
            title="AI Insights"
            description="Real-time suggestions"
            icon={<Sparkles size={15} />}
            control={<Toggle on={aiInsights} onToggle={() => setAiInsights((v) => !v)} />}
            last
          />
        </Card>

        {/* Session */}
        <Card>
          <CardHeader icon={<LogOut size={16} />} title="Session" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign out of your account on this device.
            </p>
            <button
              onClick={() => setConfirmLogout(true)}
              className="inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04] text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shrink-0"
            >
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        </Card>

        {/* Danger Zone */}
        <div className="bg-rose-50 dark:bg-rose-500/[0.07] border border-rose-200 dark:border-rose-500/25 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-500/15 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-300">Danger Zone</h3>
              <p className="mt-0.5 text-xs text-rose-600/80 dark:text-rose-400/70 leading-relaxed">
                Permanently delete your account and all associated job tracking data.
              </p>
            </div>
          </div>
          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* ---- Confirmation dialogs ---- */}
      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Log out?"
        confirmLabel="Log Out"
        icon={<LogOut size={18} />}
        message="You'll need to sign in again to access your dashboard."
      />

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        danger
        title="Delete your account?"
        confirmLabel="Delete Account"
        icon={<Trash2 size={18} />}
        message="This permanently deletes your account and all associated job tracking data. This action cannot be undone."
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-xl p-6 shadow-sm dark:shadow-none flex flex-col gap-5">
      {children}
    </div>
  );
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-indigo-600 dark:text-indigo-400">{icon}</span>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      {children}
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  control,
  icon,
  last = false,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
  icon: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        last ? "" : "pb-4 border-b border-slate-100 dark:border-white/[0.06]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center text-slate-500 dark:text-slate-400">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      {control}
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        on ? "bg-indigo-600" : "bg-slate-300 dark:bg-white/[0.15]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default Settings;
