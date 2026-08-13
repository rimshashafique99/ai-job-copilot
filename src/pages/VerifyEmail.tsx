import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MailCheck, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../contexts/AuthContext";

const OTP_LENGTH = 6;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();

  const email = (location.state as { email?: string })?.email;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email) {
      // someone landed here directly without signing up first
      navigate("/signup", { replace: true });
      return;
    }
    inputs.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (i: number, val: string) => {
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
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = [...otp];
    pasted.split("").forEach((d: string, i: number) => {
      next[i] = d;
    });
    setOtp(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }
    if (!email) return;

    setLoading(true);
    setError("");
    try {
      await verifyOtp(email, code);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? typeof err.response?.data?.error === "string"
          ? err.response.data.error
          : undefined
        : undefined;
      setError(message || "Invalid or expired code. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResent(true);
    setError("");
    setOtp(Array(OTP_LENGTH).fill(""));
    try {
      await resendOtp(email);
      inputs.current[0]?.focus();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? typeof err.response?.data?.error === "string"
          ? err.response.data.error
          : undefined
        : undefined;
      setError(message || "Failed to resend code.");
    } finally {
      setTimeout(() => setResent(false), 2000);
    }
  };

  return (
    <AuthLayout showSocialProof={false}>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
          <MailCheck size={26} className="text-brand" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-xs">
          We sent a 6-digit code to{" "}
          {email ? <strong>{email}</strong> : "your email"}. Enter it below to
          verify your account.
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
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`otp-input ${digit ? "filled" : ""}`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-xs text-red-500 font-medium mt-2">
          {error}
        </p>
      )}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="auth-btn-primary mt-5"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Verifying…" : "Verify Email"}
      </button>

      <div className="mt-5 text-center">
        <p className="text-sm text-text-secondary">
          Didn't receive the email?{" "}
          <button
            onClick={handleResend}
            disabled={resent}
            className="auth-link inline-flex items-center gap-1 disabled:opacity-50"
          >
            {resent ? (
              <>
                <RefreshCw size={12} className="animate-spin" /> Sent!
              </>
            ) : (
              "Resend Code"
            )}
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

      <p className="text-center text-xs text-text-muted mt-4">
        This verification process is secured by 256-bit encryption.
      </p>
    </AuthLayout>
  );
}
