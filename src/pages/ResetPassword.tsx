import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import AuthLayout from "../components/AuthLayout";

function CheckItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="check-item">
      {met ? (
        <CheckCircle2 size={14} className="text-brand shrink-0" />
      ) : (
        <Circle size={14} className="text-text-muted shrink-0" />
      )}
      <span className={met ? "text-text-primary" : "text-text-muted"}>
        {label}
      </span>
    </div>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checks = {
    length: form.password.length >= 8,
    number: /[0-9]/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
    casing: /[A-Z]/.test(form.password) && /[a-z]/.test(form.password),
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.password || !form.confirm) {
      setError("Please fill in both fields.");
      return;
    }
    if (!Object.values(checks).every(Boolean)) {
      setError("Password does not meet all requirements.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/email-verified");
  };

  return (
    <AuthLayout showSocialProof={false}>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
          <ShieldCheck size={26} className="text-brand" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Create new password
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-xs">
          Please choose a strong password to secure your account.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="auth-label">New Password</label>
          <div className="relative">
            <KeyRound
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              name="password"
              type={show.password ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="auth-input auth-input-icon pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, password: !s.password }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {show.password ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="auth-label">Confirm Password</label>
          <div className="relative">
            <ShieldCheck
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              name="confirm"
              type={show.confirm ? "text" : "password"}
              value={form.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              className="auth-input auth-input-icon pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Security checklist */}
      {form.password && (
        <div className="mt-4 p-3.5 rounded-xl bg-surface-subtle border border-surface-border">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2.5">
            Security Checklist
          </p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <CheckItem met={checks.length} label="8+ characters" />
            <CheckItem met={checks.number} label="One number" />
            <CheckItem met={checks.special} label="Special symbol" />
            <CheckItem met={checks.casing} label="Upper & lower" />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs text-red-500 font-medium">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="auth-btn-primary mt-5"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Updating…" : "Update Password"}
        {!loading && <ArrowRight size={15} />}
      </button>

      <div className="mt-5 border-t border-surface-border pt-5 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
