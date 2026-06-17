import { Link } from "react-router-dom";
import { Lightbulb } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  showSocialProof?: boolean;
}

// const AVATARS = [
//   { initials: "AS", bg: "#4F46E5" },
//   { initials: "MK", bg: "#7C3AED" },
//   { initials: "RJ", bg: "#2563EB" },
// ];

export default function AuthLayout({
  children,
  // showSocialProof = true,
}: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen bg-surface-subtle flex flex-col"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 60% 0%, rgba(79,70,229,0.07) 0%, transparent 60%)",
      }}
    >
      {/* Top logo bar */}
      <div className="flex justify-center pt-10 pb-2">
        <Link to="/login" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-md group-hover:bg-brand-hover transition-colors duration-150">
            <Lightbulb size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-brand tracking-tight">
            AI Job Copilot
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-card border border-surface-border/60 p-8">
          {children}
        </div>

        {/* Social proof */}
        {/* {showSocialProof && (
          <div className="mt-6 flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {AVATARS.map((a) => (
                <div
                  key={a.initials}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: a.bg }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <p className="text-xs text-text-secondary font-medium">
              Joined by{" "}
              <span className="text-text-primary font-semibold">2,000+</span>{" "}
              developers this week
            </p>
          </div>
        )} */}
      </div>

      {/* Footer */}
      {/* <div className="pb-6 flex justify-center gap-6">
        {["Privacy", "Terms", "Help"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-xs text-text-muted hover:text-text-secondary transition-colors duration-150"
          >
            {item}
          </a>
        ))}
      </div> */}
    </div>
  );
}
