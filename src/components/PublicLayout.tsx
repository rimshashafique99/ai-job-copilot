import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "../contexts/ThemeContext";

/**
 * PublicLayout
 *
 * Wraps all public/marketing pages (landing, pricing, etc.).
 * Theme state is owned by the shared ThemeProvider so the toggle stays
 * in sync across the marketing site and the authenticated app.
 */
export default function PublicLayout() {
  const { darkMode, toggleDark } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f1117]">
      <Navbar darkMode={darkMode} onToggleDark={toggleDark} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
