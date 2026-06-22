import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// App pages
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Tracker from "./pages/Tracker";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Public / marketing ─── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* ─── Auth pages (use your AuthLayout) ─── */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ─── App pages ─── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <Analyze />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracker"
          element={
            <ProtectedRoute>
              <Tracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
