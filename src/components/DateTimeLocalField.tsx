"use client";

import { useState } from "react";

// This component resolves datetime to a real instant using their own browser for the local timezone
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
