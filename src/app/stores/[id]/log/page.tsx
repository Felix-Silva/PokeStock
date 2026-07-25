import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function LogStockCheckPage(props: PageProps<"/stores/[id]/log">) {
  const { id } = await props.params;

  async function createStockCheck(formData: FormData) {
    "use server";

    const checkedAt = formData.get("checked_at") as string;
    const score = Number(formData.get("score"));
    const notes = formData.get("notes") as string;

    const { error } = await supabase.from("stock_checks").insert({
      store_id: id,
      checked_at: checkedAt,
      score,
      notes: notes || null,
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/stores/${id}`);
  }

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-6 py-16">
      <h1 className="text-3xl font-semibold">Log Stock Check</h1>
      <form action={createStockCheck} className="flex w-full max-w-md flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="checked_at" className="text-sm text-zinc-400">
            Date &amp; time
          </label>
          <input
            id="checked_at"
            name="checked_at"
            type="datetime-local"
            required
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="score" className="text-sm text-zinc-400">
            Score (0-10)
          </label>
          <input
            id="score"
            name="score"
            type="number"
            min={0}
            max={10}
            required
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-sm text-zinc-400">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-zinc-50 px-4 py-2 font-medium text-zinc-950 hover:bg-zinc-200"
        >
          Log stock check
        </button>
      </form>
    </main>
  );
}
