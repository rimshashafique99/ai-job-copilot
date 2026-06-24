import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const footerLinks = [
  { label: "Terms", to: "/terms" },
  { label: "Privacy", to: "/privacy" },
  { label: "Support", to: "/support" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
            <Zap size={12} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            AI Job Copilot
          </span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-400 dark:text-gray-500 order-last sm:order-none">
          © {new Date().getFullYear()} AI Job Copilot. All rights reserved.
        </p>

        {/* Links */}
        <nav className="flex items-center gap-5">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}