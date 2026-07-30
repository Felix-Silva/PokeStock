"use client";

import { useState } from "react";
import { deleteStore } from "@/lib/storeActions";

export function StoreActionsMenu({ storeId }: { storeId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-zinc-300 hover:bg-zinc-700"
        aria-label="Store actions"
      >
        ⋯
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-zinc-700 bg-zinc-800 py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              if (
                confirm(
                  "Delete this store? This also permanently deletes all of its logged stock checks. This can't be undone.",
                )
              ) {
                deleteStore(storeId);
              }
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-700"
          >
            Delete store
          </button>
        </div>
      )}
    </div>
  );
}
