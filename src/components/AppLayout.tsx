import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";

/**
 * AppLayout
 *
 * Shared shell for all authenticated app screens (Dashboard, Analyze,
 * Tracker, Profile, Settings). Provides the consistent top navbar and the
 * page background so individual pages only render their own content.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1117] text-slate-900 dark:text-white">
      <AppNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
