import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ToggleSection } from "@/components/ToggleSection";
import { Heatmap } from "@/components/Heatmap";
import { buildHeatmap } from "@/lib/heatmap";

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

type RubricRow = {
  observation: string;
  score: number;
};

const scoringRubric: RubricRow[] = [
  { observation: "Freshly stocked, overflowing, everything available", score: 10 },
  { observation: "Most products available, multiple ETBs", score: 8 },
  { observation: "Some ETBs and good selection", score: 6 },
  { observation: "Mostly blister packs and singles left", score: 4 },
  { observation: "Few items remaining", score: 2 },
  { observation: "Empty", score: 0 },
];

export default async function StorePage(props: PageProps<"/stores/[id]">) {
  const { id } = await props.params;

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("*")
    .eq("id", id)
    .single();

  if (storeError || !store) {
    notFound();
  }

  const { data: stockChecks, error: checksError } = await supabase
    .from("stock_checks")
    .select("*")
    .eq("store_id", id)
    .order("checked_at", { ascending: false });

  if (checksError) {
    throw new Error(checksError.message);
  }

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-6 py-16">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-3xl font-semibold">{store.name}</h1>
        <p className="text-zinc-400">{store.address}</p>
      </div>

      <Link
        href={`/stores/${id}/log`}
        className="rounded-lg bg-zinc-50 px-4 py-2 font-medium text-zinc-950 hover:bg-zinc-200"
      >
        + Log Stock Check
      </Link>
      <div className="center">
        <Heatmap grid={buildHeatmap(stockChecks)} />
      </div>
      

      <div className="flex w-full max-w-4xl flex-col gap-6">
        <ToggleSection label="stock check history">
          <table className="w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-zinc-400">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Day</th>
                <th className="px-4 py-2 font-medium">Score</th>
                <th className="px-4 py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {stockChecks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-zinc-500">
                    No stock checks logged yet.
                  </td>
                </tr>
              ) : (
                stockChecks.map((check: StockCheck) => (
                  <tr key={check.id} style={{ backgroundColor: scoreRowBackground(check.score) }}>
                    <td className="whitespace-nowrap rounded-l-lg px-4 py-3">{formatDateTime(check.checked_at)}</td>
                    <td className="px-4 py-3">{dayOfWeek(check.checked_at)}</td>
                    <td className="px-4 py-3 font-semibold">{check.score}</td>
                    <td className="rounded-r-lg px-4 py-3 text-zinc-400">{check.notes ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ToggleSection>

        <ToggleSection label="score guide">
          <table className="w-full max-w-sm border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-700 text-left text-zinc-400">
                <th className="py-2 pr-4 font-medium">Observation</th>
                <th className="py-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {scoringRubric.map((row) => (
                <tr key={row.score} className="border-b border-zinc-800">
                  <td className="py-2 pr-4">{row.observation}</td>
                  <td className="py-2">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ToggleSection>
      </div>
    </main>
  );
}
