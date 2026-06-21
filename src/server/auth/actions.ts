"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/server/lib/supabase";
import { now } from "@/shared/utils";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth");
}

export async function updateUserRole(role: "client" | "freelancer") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role, updated_at: now() })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  await supabase.auth.updateUser({
    data: { role },
  });

  revalidatePath("/", "layout");

  return { success: true };
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}
