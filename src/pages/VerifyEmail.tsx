import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import AuthLayout from "../components/AuthLayout";

const OTP_LENGTH = 6;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

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
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/email-verified");
  };

  const handleResend = async () => {
    setResent(true);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputs.current[0]?.focus();
    await new Promise((r) => setTimeout(r, 2000));
    setResent(false);
  };

  return (
    <AuthLayout showSocialProof={false}>
      {/* Icon */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
          <MailCheck size={26} className="text-brand" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-xs">
          We sent a 6-digit code to your email. Enter it below to verify your
          account.
        </p>
      </div>

      {/* OTP inputs */}
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
