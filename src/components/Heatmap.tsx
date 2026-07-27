"use client";

import { Fragment, useState } from "react";
import { buildHeatmap } from "@/lib/heatmap";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Compact label for the narrow column headers, e.g. 0 -> "12a", 13 -> "1p".
function hourLabelShort(hour: number): string {
  const period = hour < 12 ? "a" : "p";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}${period}`;
}

// Fuller label for tooltips, e.g. 13 -> "1:00 PM".
function hourLabelFull(hour: number): string {
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${period}`;
}

// Linear interpolation from red (0) to green (1).
function heatColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const red = { r: 239, g: 68, b: 68 };
  const green = { r: 34, g: 197, b: 94 };
  const r = Math.round(red.r + (green.r - red.r) * clamped);
  const g = Math.round(red.g + (green.g - red.g) * clamped);
  const b = Math.round(red.b + (green.b - red.b) * clamped);
  return `rgb(${r}, ${g}, ${b})`;
}

export function Heatmap({ checks }: { checks: { checked_at: string; score: number }[] }) {
  const [metric, setMetric] = useState<"score" | "likelihood">("score");
  
  const grid = buildHeatmap(checks);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMetric("score")}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
            metric === "score"
              ? "border-zinc-50 bg-zinc-50 text-zinc-950"
              : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          Average Score
        </button>
        <button
          type="button"
          onClick={() => setMetric("likelihood")}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
            metric === "likelihood"
              ? "border-zinc-50 bg-zinc-50 text-zinc-950"
              : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          Likelihood of Stock
        </button>
      </div>

      <div className="flex w-full justify-center overflow-x-auto">
        <div className="inline-grid grid-cols-[2.5rem_repeat(24,minmax(1.75rem,1fr))] gap-1">
          <div />
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="text-center text-[10px] text-zinc-500">
              {hourLabelShort(hour)}
            </div>
          ))}
          {grid.map((row, day) => (
            <Fragment key={day}>
              <div className="flex items-center text-xs text-zinc-400">{DAY_LABELS[day]}</div>
              {row.map((cell) => {
                const value = metric === "score" ? cell.avgScore : cell.hitRate;
                const normalized = value === null ? null : metric === "score" ? value / 10 : value;
                return (
                  <div
                    key={cell.hour}
                    title={
                      cell.count === 0
                        ? `${DAY_LABELS[day]} ${hourLabelFull(cell.hour)} — no data`
                        : `${DAY_LABELS[day]} ${hourLabelFull(cell.hour)} — ${cell.count} check${cell.count === 1 ? "" : "s"}`
                    }
                    className="aspect-square rounded"
                    style={{
                      backgroundColor: normalized === null ? "#27272a" : heatColor(normalized),
                    }}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
