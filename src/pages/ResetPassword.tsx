import { ChangeEvent, KeyboardEvent, ClipboardEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  MailCheck,
} from "lucide-react";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";
import api from "../services/api";

const OTP_LENGTH = 6;

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
  const location = useLocation();
  const email = (location.state as { email?: string })?.email;

  const [step, setStep] = useState<"otp" | "password">("otp");
  const [resetToken, setResetToken] = useState<string | null>(null);

  // OTP state
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [otpLoading, setOtpLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  // Password state
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
      return;
    }
    inputs.current[0]?.focus();
  }, [email, navigate]);

  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    setError("");
    if (digit && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...otp];
    pasted.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }
    if (!email) return;

    setOtpLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/verify-reset-otp", { email, otp: code });
      setResetToken(res.data.data.resetToken);
      setStep("password");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
      setError(message || "Invalid or expired code. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResent(true);
    setError("");
    setOtp(Array(OTP_LENGTH).fill(""));
    try {
      await api.post("/auth/forgot-password", { email });
      inputs.current[0]?.focus();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
      setError(message || "Failed to resend code.");
    } finally {
      setTimeout(() => setResent(false), 2000);
    }
  };

  const checks = {
    length: form.password.length >= 8,
    number: /[0-9]/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
    casing: /[A-Z]/.test(form.password) && /[a-z]/.test(form.password),
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleUpdatePassword = async () => {
    if (!email || !resetToken) {
      setError("Session expired. Please start again.");
      return;
    }
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
    setPwLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { email, resetToken, password: form.password });
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
      setError(message || "Something went wrong. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  if (!email) return null;

  if (step === "otp") {
    return (
      <AuthLayout showSocialProof={false}>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
            <MailCheck size={26} className="text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Enter reset code
          </h1>
          <p className="text-sm text-text-secondary mt-2 max-w-xs">
            We sent a 6-digit code to <strong>{email}</strong>. Enter it below
            to continue.
          </p>
        </div>

        <div className="flex justify-center gap-2.5 mb-2" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`otp-input ${digit ? "filled" : ""}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-xs text-red-500 font-medium mt-2">{error}</p>
        )}

        <button
          onClick={handleVerifyOtp}
          disabled={otpLoading}
          className="auth-btn-primary mt-5"
        >
          {otpLoading ? <Loader2 size={16} className="animate-spin" /> : null}
          {otpLoading ? "Verifying…" : "Verify Code"}
        </button>

        <div className="mt-5 text-center">
          <p className="text-sm text-text-secondary">
            Didn't receive it?{" "}
            <button
              onClick={handleResend}
              disabled={resent}
              className="auth-link disabled:opacity-50"
            >
              {resent ? "Sent!" : "Resend Code"}
            </button>
          </p>
        </div>

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
            <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              name="password"
              type={show.password ? "text" : "password"}
              value={form.password}
              onChange={handleFormChange}
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
            <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              name="confirm"
              type={show.confirm ? "text" : "password"}
              value={form.confirm}
              onChange={handleFormChange}
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

      {error && <p className="mt-3 text-xs text-red-500 font-medium">{error}</p>}

      <button
        onClick={handleUpdatePassword}
        disabled={pwLoading}
        className="auth-btn-primary mt-5"
      >
        {pwLoading ? <Loader2 size={16} className="animate-spin" /> : null}
        {pwLoading ? "Updating…" : "Update Password"}
        {!pwLoading && <ArrowRight size={15} />}
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