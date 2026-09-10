import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Calendar,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Archive,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import ActionsMenu from "../components/ActionsMenu";
import ConfirmDialog from "../components/ConfirmDialog";
import ApplicationFormModal, {
  type ApplicationFormValues,
  type Stage,
} from "../components/ApplicationFormModal";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------
interface Application {
  id: string;
  role: string;
  company: string;
  addedOn: string;
  badge?: string;
  link?: string;
  stage: Stage;
}

// Raw shape returned by the backend (snake_case Postgres row)
interface JobApplicationRow {
  id: string;
  user_id: string;
  role: string | null;
  company_name: string;
  job_title: string | null;
  job_description: string | null;
  job_link: string | null;
  tag: string | null;
  stage: string;
  interview_date: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateTrackerPayload {
  role?: string;
  companyName: string;
  stage: Stage;
  tag?: string;
  jobLink?: string;
}

interface UpdateTrackerPayload {
  role?: string;
  companyName?: string;
  stage?: Stage;
  tag?: string;
  jobLink?: string;
}

const STAGES: { id: Stage; label: string; dot: string }[] = [
  { id: "applied", label: "Applied", dot: "bg-sky-500" },
  { id: "interviewing", label: "Interviewing", dot: "bg-amber-500" },
  { id: "offer", label: "Offer", dot: "bg-emerald-500" },
  { id: "rejected", label: "Rejected", dot: "bg-rose-500" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit" });

// Falls back to "applied" for any stage value the board doesn't render
// (e.g. the backend's "saved" default) so a stray row can't crash byStage.
function mapRowToApplication(row: JobApplicationRow): Application {
  const knownStage = STAGES.some((s) => s.id === row.stage)
    ? (row.stage as Stage)
    : "applied";
  return {
    id: row.id,
    role: row.role || row.job_title || "Untitled Role",
    company: row.company_name,
    addedOn: formatDate(row.created_at),
    badge: row.tag ?? undefined,
    link: row.job_link ?? undefined,
    stage: knownStage,
  };
}

async function fetchTracker(): Promise<Application[]> {
  const res = await api.get<{ success: boolean; data: JobApplicationRow[] }>(
    "/tracker",
  );
  return res.data.data.map(mapRowToApplication);
}

type FormState =
  | { open: false }
  | { open: true; mode: "add"; defaultStage: Stage }
  | { open: true; mode: "edit"; app: Application };

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const Tracker: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: apps = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tracker"],
    queryFn: fetchTracker,
    staleTime: 60000,
    retry: 1,
  });

  const [form, setForm] = useState<FormState>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [clearTarget, setClearTarget] = useState<Stage | null>(null);

  // Drag & drop
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);

  const byStage = useMemo(() => {
    const map: Record<Stage, Application[]> = {
      applied: [],
      interviewing: [],
      offer: [],
      rejected: [],
    };
    apps.forEach((a) => map[a.stage].push(a));
    return map;
  }, [apps]);

  // const [activity, setActivity] = useState<{ id: number; text: string; time: string }[]>([]);

  // const logActivity = (text: string) =>
  //   setActivity((prev) => [{ id: Date.now(), text, time: "Just now" }, ...prev].slice(0, 6));

  // ---- Mutations ----
  const createMutation = useMutation({
    mutationFn: (payload: CreateTrackerPayload) =>
      api.post("/tracker", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tracker"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTrackerPayload;
    }) => api.patch(`/tracker/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tracker"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tracker/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tracker"] }),
  });

  const moveMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: Stage }) =>
      api.patch(`/tracker/${id}`, { stage }),
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: ["tracker"] });
      const previous = queryClient.getQueryData<Application[]>(["tracker"]);
      queryClient.setQueryData<Application[]>(["tracker"], (old) =>
        old ? old.map((a) => (a.id === id ? { ...a, stage } : a)) : old,
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(["tracker"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tracker"] });
    },
  });

  // ---- CRUD ----
  const submitForm = (values: ApplicationFormValues) => {
    if (form.open && form.mode === "edit") {
      updateMutation.mutate(
        {
          id: form.app.id,
          payload: {
            role: values.role,
            companyName: values.company,
            stage: values.stage,
            tag: values.badge || undefined,
            jobLink: values.link || undefined,
          },
        },
        { onSuccess: () => {} },
      );
    } else {
      createMutation.mutate(
        {
          role: values.role,
          companyName: values.company,
          stage: values.stage,
          tag: values.badge || undefined,
          jobLink: values.link || undefined,
        },
        { onSuccess: () => {} },
      );
    }
  };

  const deleteApp = (app: Application) => {
    deleteMutation.mutate(app.id, {
      onSuccess: () => {},
    });
  };

  const clearStage = async (stage: Stage) => {
    // const label = STAGES.find((s) => s.id === stage)?.label ?? stage;
    const ids = byStage[stage].map((a) => a.id);
    await Promise.all(ids.map((id) => deleteMutation.mutateAsync(id)));
    // logActivity(`Cleared the **${label}** column`);
  };

  const moveApp = (id: string, stage: Stage) => {
    const app = apps.find((a) => a.id === id);
    if (!app || app.stage === stage) return;
    // const label = STAGES.find((s) => s.id === stage)?.label ?? stage;
    moveMutation.mutate({ id, stage });
    // logActivity(`Moved **${app.role}** to ${label}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 animate-fade-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Application Pipeline
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your active opportunities and track progress.
              <span className="hidden sm:inline">
                {" "}
                Drag a card to move it between stages.
              </span>
            </p>
          </div>
          <button
            onClick={() =>
              setForm({ open: true, mode: "add", defaultStage: "applied" })
            }
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <Plus size={16} />
            New Application
          </button>
        </div>

        {isLoading && (
          <div className="text-sm text-slate-400 dark:text-slate-500">
            Loading your pipeline…
          </div>
        )}
        {isError && (
          <div className="text-sm text-rose-500">
            Couldn't load your applications. Try refreshing the page.
          </div>
        )}

        {/* Kanban board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAGES.map((col, i) => (
            <div
              key={col.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <KanbanColumn
                label={col.label}
                dot={col.dot}
                cards={byStage[col.id]}
                isDragOver={dragOverStage === col.id}
                onAdd={() =>
                  setForm({ open: true, mode: "add", defaultStage: col.id })
                }
                onClear={() =>
                  byStage[col.id].length > 0 && setClearTarget(col.id)
                }
                onEdit={(app) => setForm({ open: true, mode: "edit", app })}
                onView={(app) => navigate(`/analyze/${app.id}`)}
                onDelete={(app) => setDeleteTarget(app)}
                onDragStartCard={(id) => setDragId(id)}
                onDragEndCard={() => {
                  setDragId(null);
                  setDragOverStage(null);
                }}
                onDragOver={() => setDragOverStage(col.id)}
                onDragLeave={() =>
                  setDragOverStage((s) => (s === col.id ? null : s))
                }
                onDrop={() => {
                  if (dragId) moveApp(dragId, col.id);
                  setDragId(null);
                  setDragOverStage(null);
                }}
              />
            </div>
          ))}
        </div>

        {/* Footer insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* <CopilotInsight />
          <RecentActivity items={activity} /> */}
        </div>
      </div>

      {/* ---- Modals ---- */}
      <ApplicationFormModal
        open={form.open}
        mode={form.open ? form.mode : "add"}
        stages={STAGES}
        initialValues={
          form.open && form.mode === "edit"
            ? {
                role: form.app.role,
                company: form.app.company,
                stage: form.app.stage,
                badge: form.app.badge ?? "",
                link: form.app.link ?? "",
              }
            : form.open && form.mode === "add"
              ? { stage: form.defaultStage }
              : undefined
        }
        onClose={() => setForm({ open: false })}
        onSubmit={submitForm}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteApp(deleteTarget)}
        danger
        title="Delete application?"
        confirmLabel="Delete"
        message={
          deleteTarget ? (
            <>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {deleteTarget.role}
              </span>{" "}
              at {deleteTarget.company} will be permanently removed from your
              pipeline.
            </>
          ) : null
        }
      />

      <ConfirmDialog
        open={clearTarget !== null}
        onClose={() => setClearTarget(null)}
        onConfirm={() => clearTarget && clearStage(clearTarget)}
        danger
        title="Clear this column?"
        confirmLabel="Clear all"
        message={
          clearTarget
            ? `All applications in the "${
                STAGES.find((s) => s.id === clearTarget)?.label
              }" column will be removed.`
            : null
        }
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Column
// ---------------------------------------------------------------------------
interface ColumnProps {
  label: string;
  dot: string;
  cards: Application[];
  isDragOver: boolean;
  onAdd: () => void;
  onClear: () => void;
  onEdit: (app: Application) => void;
  onView: (app: Application) => void;
  onDelete: (app: Application) => void;
  onDragStartCard: (id: string) => void;
  onDragEndCard: () => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: () => void;
}

function KanbanColumn({
  label,
  dot,
  cards,
  isDragOver,
  onAdd,
  onClear,
  onEdit,
  onView,
  onDelete,
  onDragStartCard,
  onDragEndCard,
  onDragOver,
  onDragLeave,
  onDrop,
}: ColumnProps) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      className={`rounded-xl p-3 flex flex-col gap-3 border transition-colors ${
        isDragOver
          ? "border-indigo-400 dark:border-indigo-500/60 bg-indigo-50/60 dark:bg-indigo-500/[0.06]"
          : "border-slate-200 dark:border-white/[0.06] bg-slate-100/70 dark:bg-white/[0.02]"
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {label}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-white/[0.06] rounded-full px-1.5">
            {cards.length}
          </span>
        </div>
        <ActionsMenu
          align="right"
          trigger={<MoreHorizontal size={16} />}
          buttonClassName="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center justify-center w-6 h-6 rounded-md hover:bg-slate-200/60 dark:hover:bg-white/[0.06]"
          items={[
            {
              label: "Add Application",
              icon: <Plus size={15} />,
              onClick: onAdd,
            },
            {
              label: "Clear Column",
              icon: <Archive size={15} />,
              danger: true,
              onClick: onClear,
            },
          ]}
        />
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5 min-h-[60px]">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onEdit={() => onEdit(card)}
            onView={() => onView(card)}
            onDelete={() => onDelete(card)}
            onDragStart={() => onDragStartCard(card.id)}
            onDragEnd={onDragEndCard}
          />
        ))}

        {cards.length === 0 && (
          <div className="flex items-center justify-center py-4 text-xs text-slate-400 dark:text-slate-600">
            Drop a card here
          </div>
        )}

        {/* Add task */}
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-dashed border-slate-300 dark:border-white/[0.1] text-xs font-medium text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Plus size={13} />
          Add Task
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
function KanbanCard({
  card,
  onEdit,
  onView,
  onDelete,
  onDragStart,
  onDragEnd,
}: {
  card: Application;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", card.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-lg p-3 flex flex-col gap-2 shadow-sm dark:shadow-none hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 min-w-0">
          <GripVertical
            size={14}
            className="mt-0.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors shrink-0"
          />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
            {card.role}
          </h3>
        </div>
        <ActionsMenu
          align="right"
          trigger={<MoreHorizontal size={14} />}
          buttonClassName="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors shrink-0 flex items-center justify-center w-6 h-6 rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.06]"
          items={[
            { label: "Edit", icon: <Pencil size={15} />, onClick: onEdit },
            { label: "View Details", icon: <Eye size={15} />, onClick: onView },
            {
              label: "Delete",
              icon: <Trash2 size={15} />,
              danger: true,
              onClick: onDelete,
            },
          ]}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 pl-5">
        {card.company}
      </p>

      {card.link && (
        <a
          href={card.link}
          target="_blank"
          rel="noopener noreferrer"
          draggable={false}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          title={card.link}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline w-fit pl-5 transition-colors"
        >
          <ExternalLink size={11} />
          View posting
        </a>
      )}

      <div className="flex items-center justify-between mt-1 pl-5">
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
          <Calendar size={11} />
          Added {card.addedOn}
        </span>
        {card.badge && (
          <span className="text-[11px] font-medium text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/15 rounded-full px-2 py-0.5">
            {card.badge}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Footer widgets
// ---------------------------------------------------------------------------
// function CopilotInsight() {
//   return (
//     <div className="bg-indigo-50 dark:bg-indigo-500/[0.07] border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-5 flex flex-col gap-3">
//       <div className="flex items-start gap-3">
//         <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center shrink-0">
//           <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
//         </div>
//         <div>
//           <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Copilot Insight</h3>
//           <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
//             Your interview conversion rate has increased by 15% this month. Try applying to
//             "Growth" stage companies next.
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
//         <TrendingUp size={13} />
//         Optimization Active
//       </div>
//     </div>
//   );
// }

// function RecentActivity({ items }: { items: { id: number; text: string; time: string }[] }) {
//   return (
//     <div className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/[0.06] rounded-xl p-5 shadow-sm dark:shadow-none">
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
//         <span className="text-[11px] text-slate-400 dark:text-slate-500">Live</span>
//       </div>
//       <ul className="flex flex-col gap-3">
//         {items.length === 0 ? (
//           <li className="text-xs text-slate-400 dark:text-slate-500">
//             No activity yet — actions you take will show up here.
//           </li>
//         ) : (
//           items.map((item) => (
//             <li key={item.id} className="flex items-center justify-between gap-3">
//               <span
//                 className="text-xs text-slate-600 dark:text-slate-300"
//                 dangerouslySetInnerHTML={{
//                   __html: item.text.replace(
//                     /\*\*(.+?)\*\*/g,
//                     '<span class="font-semibold text-slate-900 dark:text-white">$1</span>'
//                   ),
//                 }}
//               />
//               <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
//                 {item.time}
//               </span>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }

export default Tracker;
