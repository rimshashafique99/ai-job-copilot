import React, { useRef, useState } from "react";
import { FileUp, Download, Info } from "lucide-react";

const Profile: React.FC = () => {
  const [form, setForm] = useState({
    fullName: "John Doe",
    targetRole: "Senior Frontend Engineer",
    summary: "",
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File | null) => {
    if (file) setFileName(file.name);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6 animate-fade-up">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information and resume to improve AI job matching.
          </p>
        </div>

        {/* Personal Info card */}
        <SectionCard title="Personal Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="profile-input"
              />
            </Field>
            <Field label="Target Role">
              <input
                type="text"
                value={form.targetRole}
                onChange={(e) => setForm((f) => ({ ...f, targetRole: e.target.value }))}
                className="profile-input"
              />
            </Field>
          </div>

          <Field label="Professional Summary">
            <textarea
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              placeholder="Briefly describe your expertise…"
              rows={4}
              className="profile-input resize-none"
            />
          </Field>

          <div className="flex justify-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        </SectionCard>

        {/* CV card */}
        <SectionCard
          title="Your CV"
          action={
            <button className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              <Download size={14} />
              Download CV
            </button>
          }
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
              dragOver
                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                : "border-slate-300 dark:border-white/[0.12] hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-white/[0.03]"
            }`}
          >
            <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center">
              <FileUp size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {fileName ?? "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">PDF, DOCX up to 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </button>

          <div className="flex items-start gap-2 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] px-3.5 py-3">
            <Info size={15} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our AI uses your CV to tailor cover letters and optimize your applications. Ensure
              your document is up-to-date for best results.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------
function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-xl p-6 shadow-sm dark:shadow-none flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-1 h-5 rounded-full bg-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      {children}
    </div>
  );
}

export default Profile;
