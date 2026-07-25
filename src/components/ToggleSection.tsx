"use client";

import { useState } from "react";

export function ToggleSection({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700"
      >
        {open ? `Hide ${label}` : `Show ${label}`}
      </button>
      {open && children}
    </div>
  );
}
