"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function deleteStockCheck(id: string, storeId: string) {
  const { error } = await supabase.from("stock_checks").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/stores/${storeId}`);
}
