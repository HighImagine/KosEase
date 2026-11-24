"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markNotifikasiReadAction(_prev: unknown, formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !id) return { error: "Notifikasi tidak ditemukan" };
  const { error } = await supabase.from("notifikasi").update({ dibaca_at: new Date().toISOString() }).eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  for (const locale of ["id", "en"]) revalidatePath(`/${locale}/dashboard/notifikasi`);
  return { success: true };
}
