

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import LandingPage from "./pages/LandingPage";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Commented out - pages not yet created
// import ProtectedLayout from "./components/ProtectedLayout";
// import Dashboard from "./pages/Dashboard";
// import Analyze from "./pages/Analyze";
// import Tracker from "./pages/Tracker";
// import Profile from "./pages/Profile";

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

        {/* ─── Protected app routes (use your ProtectedLayout) ─── */}
        {/* <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/profile" element={<Profile />} />
        </Route> */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}