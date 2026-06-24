import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Zap,
  Moon,
  Sun,
  Menu,
  X,
  Settings as SettingsIcon,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { logout } from "../lib/auth";
import ConfirmDialog from "./ConfirmDialog";

const NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Analyze", to: "/analyze" },
  { label: "Tracker", to: "/tracker" },
  { label: "Profile", to: "/profile" },
];

export default function AppNavbar() {
  const { darkMode, toggleDark } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const requestLogout = () => {
    setAvatarOpen(false);
    setConfirmLogout(true);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-indigo-600 dark:text-indigo-400"
        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f1117]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">
              AI Job Copilot
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Avatar + dropdown */}
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setAvatarOpen((v) => !v)}
                aria-label="Account menu"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-transparent hover:ring-indigo-500/30 transition-all"
              >
                R
              </button>

              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1a1d2e] shadow-lg dark:shadow-black/40 py-1.5 overflow-hidden origin-top-right animate-scale-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/[0.06]">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      Rimsha Shafique
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      rimsha@example.com
                    </p>
                  </div>
                  <DropdownItem
                    icon={<UserIcon size={15} />}
                    label="Profile"
                    onClick={() => {
                      setAvatarOpen(false);
                      navigate("/profile");
                    }}
                  />
                  <DropdownItem
                    icon={<SettingsIcon size={15} />}
                    label="Settings"
                    onClick={() => {
                      setAvatarOpen(false);
                      navigate("/settings");
                    }}
                  />
                  <div className="my-1 border-t border-slate-100 dark:border-white/[0.06]" />
                  <DropdownItem
                    icon={<LogOut size={15} />}
                    label="Log out"
                    danger
                    onClick={requestLogout}
                  />
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="md:hidden border-t border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0f1117] px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Log out?"
        confirmLabel="Log Out"
        icon={<LogOut size={18} />}
        message="You'll need to sign in again to access your dashboard."
      />
    </header>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
        danger
          ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
