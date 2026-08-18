import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Mail,
  ArrowLeft,
  ArrowRight,
  Loader2,
  SendHorizonal,
} from "lucide-react";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setError("");
   try {
    await api.post("/auth/forgot-password", { email });
    navigate("/reset-password", { state: { email } });
  } catch (err: unknown) {
    const message = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
    setError(message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }


    return (
      <AuthLayout showSocialProof={false}>
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
            <SendHorizonal size={26} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-text-secondary mt-2 max-w-xs">
            If an account exists for{" "}
            <span className="font-semibold text-text-primary">{email}</span>,
            we've sent a password reset link. It expires in few minutes.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mt-6"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showSocialProof={false}>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
          <BriefcaseBusiness size={26} className="text-brand" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-xs">
          Enter your email address and we will send you OTP code to reset your
          password.
        </p>
      </div>

      <div>
        <label className="auth-label">Email Address</label>
        <div className="relative">
          <Mail
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="name@company.com"
            className="auth-input auth-input-icon"
          />
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="auth-btn-primary mt-5"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Sending…" : "Send Reset Link"}
        {!loading && <ArrowRight size={15} />}
      </button>

      <div className="mt-5 border-t border-surface-border pt-5 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </div>

      <div className="mt-5 pt-1 flex justify-center gap-5">
        {["Help Center", "Privacy Policy", "Terms of Service"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            {item}
          </a>
        ))}
      </div>
    </AuthLayout>
  );

};
  