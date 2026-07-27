"use client";

import { useState } from "react";

// A <input type="datetime-local"> value has no timezone attached — it's
// just "2026-07-24T14:30", ambiguous about *whose* 2:30pm that is. Postgres
// would otherwise interpret that bare string as UTC, silently shifting it
// by however many hours off UTC the visitor actually is. This component
// resolves it to a real instant using the one place that actually knows
// the visitor's timezone — their own browser — before it's ever submitted.
export function DateTimeLocalField({ name, label }: { name: string; label: string }) {
  const [localValue, setLocalValue] = useState("");

  const isoValue = localValue ? new Date(localValue).toISOString() : "";

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm text-zinc-400">
        {label}
      </label>
      <input
        id={name}
        type="datetime-local"
        required
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
      />
      <input type="hidden" name={name} value={isoValue} />
    </div>
  );
}
