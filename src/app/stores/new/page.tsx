import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { STORE_COLORS } from "@/lib/stores";

async function createStore(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const color = formData.get("color") as string;

  const { data, error } = await supabase
    .from("stores")
    .insert({ name, address, color })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/stores/${data.id}`);
}

export default function NewStorePage() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-6 py-16">
      <h1 className="text-3xl font-semibold">Add Store</h1>
      <form action={createStore} className="flex w-full max-w-md flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm text-zinc-400">
            Store name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="rounded-lg bg-zinc-900 px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm text-zinc-400">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            className="rounded-lg bg-zinc-900 px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-600"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">Color</span>
          <div className="flex gap-3">
            {STORE_COLORS.map((color) => (
              <label key={color.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="color"
                  value={color.value}
                  defaultChecked={color.value === "gray"}
                  className="peer sr-only"
                />
                <span
                  className="block h-8 w-8 rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-zinc-950 peer-checked:ring-zinc-50"
                  style={{ backgroundColor: color.hex }}
                />
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="mt-2 rounded-lg bg-zinc-50 px-4 py-2 font-medium text-zinc-950 hover:bg-zinc-200"
        >
          Add store
        </button>
      </form>
    </main>
  );
}
