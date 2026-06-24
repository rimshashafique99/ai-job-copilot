import React, { useEffect, useId, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

interface ActionsMenuProps {
  items: ActionItem[];
  /** Custom trigger icon (defaults to a vertical three-dot button). */
  trigger?: React.ReactNode;
  /** Horizontal alignment of the menu relative to the trigger. */
  align?: "left" | "right";
  buttonClassName?: string;
}

/**
 * ActionsMenu
 *
 * Lightweight, accessible dropdown used for row/card "Actions" buttons.
 * Closes on outside click or Escape and animates in with `scale-in`.
 */
export default function ActionsMenu({
  items,
  trigger,
  align = "right",
  buttonClassName = "",
}: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={
          buttonClassName ||
          "flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
        }
      >
        {trigger ?? <MoreVertical size={16} />}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={`absolute z-50 mt-1.5 w-44 origin-top rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1a1d2e] shadow-lg dark:shadow-black/40 py-1 animate-scale-in ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, i) => (
            <button
              key={i}
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                item.onClick?.();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                item.danger
                  ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
