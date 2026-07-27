"use client";

import { deleteStockCheck } from "@/lib/stockChecks";

type StockCheck = {
  id: string;
  checked_at: string;
  score: number;
  notes: string | null;
};

function formatDateTime(datetime: string): string {
  return new Date(datetime).toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function dayOfWeek(datetime: string): string {
  return new Date(datetime).toLocaleDateString("en-US", { weekday: "long" });
}

// Linear interpolation from red (score 0) to green (score 10), returned as
// a translucent background tint rather than a solid color, so row text
// stays readable against it.
function scoreRowBackground(score: number): string {
  const t = Math.max(0, Math.min(10, score)) / 10;
  const red = { r: 239, g: 68, b: 68 }; // Tailwind red-500
  const green = { r: 34, g: 197, b: 94 }; // Tailwind green-500
  const r = Math.round(red.r + (green.r - red.r) * t);
  const g = Math.round(red.g + (green.g - red.g) * t);
  const b = Math.round(red.b + (green.b - red.b) * t);
  return `rgba(${r}, ${g}, ${b}, 0.15)`;
}

export function StockCheckTable({
  stockChecks,
  storeId,
}: {
  stockChecks: StockCheck[];
  storeId: string;
}) {
  return (
    <table className="w-full border-separate border-spacing-y-2 text-sm">
      <thead>
        <tr className="text-left text-zinc-400">
          <th className="px-4 py-2 font-medium">Date</th>
          <th className="px-4 py-2 font-medium">Day</th>
          <th className="px-4 py-2 font-medium">Score</th>
          <th className="px-4 py-2 font-medium">Notes</th>
          <th className="px-4 py-2 font-medium" />
        </tr>
      </thead>
      <tbody>
        {stockChecks.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-4 py-3 text-zinc-500">
              No stock checks logged yet.
            </td>
          </tr>
        ) : (
          stockChecks.map((check) => (
            <tr key={check.id} style={{ backgroundColor: scoreRowBackground(check.score) }}>
              <td className="whitespace-nowrap rounded-l-lg px-4 py-3">{formatDateTime(check.checked_at)}</td>
              <td className="px-4 py-3">{dayOfWeek(check.checked_at)}</td>
              <td className="px-4 py-3 font-semibold">{check.score}</td>
              <td className="px-4 py-3 text-zinc-400">{check.notes ?? "—"}</td>
              <td className="rounded-r-lg px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this stock check? This can't be undone.")) {
                      deleteStockCheck(check.id, storeId);
                    }
                  }}
                  className="text-zinc-500 hover:text-red-400"
                  aria-label="Delete stock check"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
