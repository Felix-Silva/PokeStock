import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ToggleSection } from "@/components/ToggleSection";
import { Heatmap } from "@/components/Heatmap";
import { StockCheckTable } from "@/components/StockCheckTable";
import { storeColorHex } from "@/lib/stores";

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
        <h1 className="text-3xl font-semibold" style={{ color: storeColorHex(store.color) }}>
          {store.name}
        </h1>
        <p className="text-zinc-400">{store.address}</p>
      </div>

      <Link
        href={`/stores/${id}/log`}
        className="rounded-lg bg-zinc-50 px-4 py-2 font-medium text-zinc-950 hover:bg-zinc-200"
      >
        + Log Stock Check
      </Link>

      <Heatmap checks={stockChecks} />

      <div className="flex w-full max-w-4xl flex-col gap-6">
        <ToggleSection label="stock check history">
          <StockCheckTable stockChecks={stockChecks} />
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
