"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function deleteStore(id: string) {
  const { error } = await supabase.from("stores").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}
