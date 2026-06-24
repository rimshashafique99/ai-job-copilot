import React, { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import Modal from "./Modal";

export type Stage = "applied" | "interviewing" | "offer" | "rejected";

export interface ApplicationFormValues {
  role: string;
  company: string;
  stage: Stage;
  badge: string;
  link: string;
}

interface StageOption {
  id: Stage;
  label: string;
}

interface ApplicationFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  stages: StageOption[];
  initialValues?: Partial<ApplicationFormValues>;
  onClose: () => void;
  onSubmit: (values: ApplicationFormValues) => void;
}

const EMPTY: ApplicationFormValues = {
  role: "",
  company: "",
  stage: "applied",
  badge: "",
  link: "",
};

export default function ApplicationFormModal({
  open,
  mode,
  stages,
  initialValues,
  onClose,
  onSubmit,
}: ApplicationFormModalProps) {
  const [values, setValues] = useState<ApplicationFormValues>(EMPTY);
  const [error, setError] = useState("");

  // Reset the form whenever the modal is (re)opened
  useEffect(() => {
    if (open) {
      setValues({ ...EMPTY, ...initialValues });
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (key: keyof ApplicationFormValues, val: string) =>
    setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = () => {
    if (!values.role.trim() || !values.company.trim()) {
      setError("Role and company are required.");
      return;
    }
    onSubmit({
      ...values,
      role: values.role.trim(),
      company: values.company.trim(),
      link: normalizeUrl(values.link.trim()),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "add" ? "New Application" : "Edit Application"}
      description={
        mode === "add"
          ? "Track a new opportunity in your pipeline."
          : "Update the details of this application."
      }
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.1] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            {mode === "add" ? "Add Application" : "Save Changes"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Role">
          <input
            autoFocus
            value={values.role}
            onChange={(e) => set("role", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. Senior Frontend Engineer"
            className="profile-input"
          />
        </Field>

        <Field label="Company">
          <input
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. Stripe"
            className="profile-input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Stage">
            <select
              value={values.stage}
              onChange={(e) => set("stage", e.target.value)}
              className="profile-input cursor-pointer"
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tag (optional)">
            <input
              value={values.badge}
              onChange={(e) => set("badge", e.target.value)}
              placeholder="e.g. Round 2"
              className="profile-input"
            />
          </Field>
        </div>

        <Field label="Job posting link (optional)">
          <div className="relative">
            <Link2
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="url"
              value={values.link}
              onChange={(e) => set("link", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="https://… where you saw this job"
              className="profile-input pl-9"
            />
          </div>
        </Field>

        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
      </div>
    </Modal>
  );
}

/** Prepend https:// when the user omits the protocol so links open correctly. */
function normalizeUrl(url: string): string {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      {children}
    </div>
  );
}
