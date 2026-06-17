import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * PublicLayout
 *
 * Wraps all public/marketing pages (landing, pricing, etc.)
 * Owns dark mode state so Navbar toggle can propagate class to <html>.
 *
 * Usage in your router:
 *   <Route element={<PublicLayout />}>
 *     <Route path="/" element={<LandingPage />} />
 *   </Route>
 */
export default function PublicLayout() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode((v) => !v)} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
