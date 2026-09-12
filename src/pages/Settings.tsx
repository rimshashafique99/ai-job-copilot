import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  SlidersHorizontal,
  AlertTriangle,
 
  Sun,
  Moon,
 
  LogOut,
  Trash2,
  Pencil,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { settingsService, SettingsData } from "../services/settingService";
import ConfirmDialog from "../components/ConfirmDialog";

const Settings: React.FC = () => {
  const { darkMode, toggleDark } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<SettingsData>({
    queryKey: ["settings"],
    queryFn: settingsService.getSettings,
  });

  // ---- Account section (edit toggle) ----
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [account, setAccount] = useState({ email: "", fullName: "" });

  useEffect(() => {
    if (settings) {
      setAccount({ email: settings.email, fullName: settings.fullName });
    }
  }, [settings]);

  const accountMutation = useMutation({
    mutationFn: settingsService.updateAccount,
    onSuccess: (data) => {
      queryClient.setQueryData<SettingsData>(["settings"], (old) =>
        old ? { ...old, ...data } : old
      );
      setIsEditingAccount(false);
      setAccountError(null);
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        setAccountError(err.response?.data?.error ?? "Failed to update account");
      }
    },
  });
  const [accountError, setAccountError] = useState<string | null>(null);

  const cancelAccountEdit = () => {
    if (settings) setAccount({ email: settings.email, fullName: settings.fullName });
    setAccountError(null);
    setIsEditingAccount(false);
  };

  // ---- Password ----
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const passwordMutation = useMutation({
    mutationFn: settingsService.updatePassword,
    onSuccess: () => {
      setPasswords({ currentPassword: "", newPassword: "" });
      setPasswordError(null);
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        setPasswordError(err.response?.data?.error ?? "Failed to update password");
      }
    },
  });

  // ---- Preferences (instant toggle, no edit mode needed) ----
  // const preferencesMutation = useMutation({
  //   mutationFn: settingsService.updatePreferences,
  //   onSuccess: (data) => {
  //     queryClient.setQueryData<SettingsData>(["settings"], (old) =>
  //       old ? { ...old, ...data } : old
  //     );
  //   },
  // });

  // const toggleEmailAlerts = () => {
  //   if (!settings) return;
  //   preferencesMutation.mutate({
  //     emailNotifications: !settings.emailNotifications,
  //     aiInsights: settings.aiInsights,
  //   });
  // };

  // const toggleAiInsights = () => {
  //   if (!settings) return;
  //   preferencesMutation.mutate({
  //     emailNotifications: settings.emailNotifications,
  //     aiInsights: !settings.aiInsights,
  //   });
  // };

  // ---- Logout / Delete ----
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const deleteMutation = useMutation({
    mutationFn: () => settingsService.deleteAccount(deletePassword || undefined),
    onSuccess: () => {
      navigate("/", { replace: true });
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        setDeleteError(err.response?.data?.error ?? "Failed to delete account");
      }
    },
  });

  if (isLoading || !settings) {
    return <div className="px-4 sm:px-6 lg:px-8 py-8 text-slate-400 text-sm">Loading settings…</div>;
  }

  const isGoogleAccount = settings.authProvider === "google";

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6 animate-fade-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your account preferences and subscription details.
          </p>
        </div>

        {/* Account Settings */}
        <Card>
          <div className="flex items-center justify-between">
            <CardHeader icon={<User size={16} />} title="Account Settings" />
            {!isEditingAccount ? (
              <button
                onClick={() => setIsEditingAccount(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                aria-label="Edit account settings"
              >
                <Pencil size={15} />
              </button>
            ) : (
              <button
                onClick={cancelAccountEdit}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                aria-label="Cancel editing"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email Address">
              <input
                type="email"
                value={account.email}
                disabled={!isEditingAccount}
                onChange={(e) => setAccount((a) => ({ ...a, email: e.target.value }))}
                className="profile-input disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </Field>
            <Field label="Full Name">
              <input
                type="text"
                value={account.fullName}
                disabled={!isEditingAccount}
                onChange={(e) => setAccount((a) => ({ ...a, fullName: e.target.value }))}
                className="profile-input disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </Field>
          </div>

          {accountError && <p className="text-xs text-rose-500">{accountError}</p>}

          {isEditingAccount && (
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelAccountEdit}
                className="text-sm font-medium px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => accountMutation.mutate(account)}
                disabled={accountMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                {accountMutation.isPending ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}

          {!isGoogleAccount && (
            <>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                Password Update
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Current Password">
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
                    }
                    placeholder="••••••••"
                    className="profile-input"
                  />
                </Field>
                <Field label="New Password">
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min. 8 characters"
                    className="profile-input"
                  />
                </Field>
              </div>

              {passwordError && <p className="text-xs text-rose-500">{passwordError}</p>}
              {passwordSuccess && (
                <p className="text-xs text-emerald-500">Password updated successfully.</p>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => passwordMutation.mutate(passwords)}
                  disabled={
                    passwordMutation.isPending ||
                    !passwords.currentPassword ||
                    !passwords.newPassword
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  {passwordMutation.isPending ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader icon={<SlidersHorizontal size={16} />} title="Preferences" />

          {/* <PreferenceRow
            title="Email Notifications"
            description="Alerts for job matches"
            control={<Toggle on={settings.emailNotifications} onToggle={toggleEmailAlerts} />}
            icon={<Bell size={15} />}
          /> */}
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
          {/* <PreferenceRow
            title="AI Insights"
            description="Real-time suggestions"
            icon={<Sparkles size={15} />}
            control={<Toggle on={settings.aiInsights} onToggle={toggleAiInsights} />}
            last
          /> */}
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
        <div className="bg-rose-50 dark:bg-rose-500/[0.07] border border-rose-200 dark:border-rose-500/25 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

          {!isGoogleAccount && confirmDelete && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-rose-700 dark:text-rose-300">
                Confirm your password to continue
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="••••••••"
                className="profile-input"
              />
              {deleteError && <p className="text-xs text-rose-500">{deleteError}</p>}
            </div>
          )}
        </div>
      </div>

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
        onClose={() => {
          setConfirmDelete(false);
          setDeletePassword("");
          setDeleteError(null);
        }}
        onConfirm={() => deleteMutation.mutate()}
        danger
        title="Delete your account?"
        confirmLabel={deleteMutation.isPending ? "Deleting…" : "Delete Account"}
        icon={<Trash2 size={18} />}
        message="This permanently deletes your account and all associated job tracking data. This action cannot be undone."
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Reusable bits (unchanged)
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

// function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
//   return (
//     <button
//       onClick={onToggle}
//       role="switch"
//       aria-checked={on}
//       className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
//         on ? "bg-indigo-600" : "bg-slate-300 dark:bg-white/[0.15]"
//       }`}
//     >
//       <span
//         className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
//           on ? "translate-x-5" : "translate-x-0"
//         }`}
//       />
//     </button>
//   );
// }

export default Settings;