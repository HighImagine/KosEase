"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconChevronDown } from "@tabler/icons-react";

type SearchDropdownProps = {
  label: string;
  icon?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export default function SearchDropdown({ label, icon, open, onOpenChange, children }: SearchDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary hover:bg-primary-light"
      >
        <span className="flex min-w-0 items-center gap-2">
          {icon}
          <span className="truncate">{label}</span>
        </span>
        <IconChevronDown size={16} className={`shrink-0 text-text-secondary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-surface p-3 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}
