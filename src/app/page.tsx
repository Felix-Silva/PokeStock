import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { storeColorBackground, type Store } from "@/lib/stores";
import { ToggleSection } from "@/components/ToggleSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: stores, error } = await supabase
    .from("stores")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-6 py-16">
      <Link
        href="/stores/new"
        className="rounded-lg bg-zinc-50 px-4 py-2 font-medium text-zinc-950 hover:bg-zinc-200"
      >
        + Add store
      </Link>

      {stores.length === 0 ? (
        <p className="text-zinc-400">No stores yet.</p>
      ) : (
        <ul className="flex w-full max-w-md flex-col gap-3">
          {stores.map((store: Store) => (
            <li key={store.id}>
              <Link
                href={`/stores/${store.id}`}
                style={{ backgroundColor: storeColorBackground(store.color) }}
                className="flex flex-col rounded-lg px-4 py-3 hover:brightness-125"
              >
                <span>{store.name}</span>
                <span className="text-sm text-zinc-400">{store.address}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
