import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "../services/api";

export interface User {
  id: string;
  email: string;
  full_name: string;
  target_role: string | null;
  created_at: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    fullName: string;
    targetRole?: string;
  }) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refetchUser() {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data.user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    (async () => {
      await refetchUser();
      setLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.data.user);
  }

  async function signup(data: {
    email: string;
    password: string;
    fullName: string;
    targetRole?: string;
  }) {
    await api.post("/auth/signup", data);
    // no user set yet — not verified until OTP confirmed
  }

  async function verifyOtp(email: string, otp: string) {
    const res = await api.post("/auth/verify-otp", { email, otp });
    setUser(res.data.data.user);
  }

  async function resendOtp(email: string) {
    await api.post("/auth/resend-otp", { email });
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, verifyOtp, resendOtp, logout, refetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}