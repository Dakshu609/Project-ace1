"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/database/supabase/server";
import { dashboardPathForRole, safeInternalPath } from "@/server/auth/utils";
import type { UserRole } from "@/shared/types";

function parseSkills(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function requiredText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function currentUser() {
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile };
}

export async function createJobPost(formData: FormData) {
  const { supabase, user, profile } = await currentUser();

  if (!user) {
    redirect(`/auth?redirect=${encodeURIComponent("/post-job")}`);
  }

  const title = requiredText(formData, "title");
  const description = requiredText(formData, "description");
  const category = requiredText(formData, "category");
  const budgetType = requiredText(formData, "budgetType") || "fixed";
  const budgetAmount = Number(requiredText(formData, "budget"));
  const deadline = requiredText(formData, "deadline") || null;
  const skills = parseSkills(formData.get("skills"));

  if (!title || !description || !category || !Number.isFinite(budgetAmount)) {
    redirect("/post-job?error=invalid_job");
  }

  const { error } = await supabase.from("job_posts").insert({
    client_id: user.id,
    client_name: profile?.full_name || user.email?.split("@")[0] || "Client",
    title,
    description,
    category_name: category,
    budget_type: budgetType,
    budget_amount: budgetAmount,
    deadline,
    skills,
    status: "open",
  });

  if (error) {
    console.error("[marketplace:create-job]", error);
    redirect("/post-job?error=save_failed");
  }

  revalidatePath("/");
  revalidatePath("/dashboard/client");
  revalidatePath("/post-job");
  redirect("/dashboard/client?posted=1");
}

export async function sendMessage(formData: FormData) {
  const { supabase, user, profile } = await currentUser();
  if (!user) redirect("/auth?redirect=/messages");

  const conversationId = requiredText(formData, "conversationId");
  const body = requiredText(formData, "message");

  if (!conversationId || !body) return { error: "Message cannot be empty." };

  const senderName = profile?.full_name || user.email?.split("@")[0] || "User";
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    sender_name: senderName,
    sender_avatar_url: profile?.avatar_url,
    body,
  });

  if (error) {
    console.error("[marketplace:send-message]", error);
    return { error: "Could not send message." };
  }

  await supabase
    .from("conversations")
    .update({
      last_message: body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  revalidatePath("/messages");
  return { success: true };
}

export async function updateAvailability(formData: FormData) {
  const { supabase, user } = await currentUser();
  if (!user) redirect("/auth?redirect=/dashboard/freelancer");

  const availability = requiredText(formData, "availability");
  if (!["available", "busy", "away"].includes(availability)) {
    return { error: "Invalid availability." };
  }

  const { error } = await supabase
    .from("freelancer_profiles")
    .update({ availability, updated_at: new Date().toISOString() })
    .eq("profile_id", user.id);

  if (error) {
    console.error("[marketplace:update-availability]", error);
    return { error: "Could not update availability." };
  }

  revalidatePath("/dashboard/freelancer");
  revalidatePath("/freelancers");
  return { success: true };
}

export async function updateFreelancerVerification(formData: FormData) {
  const { supabase, user, profile } = await currentUser();
  if (!user) redirect("/auth?redirect=/admin");

  if ((profile?.role as UserRole | null) !== "admin") {
    redirect(dashboardPathForRole(profile?.role as UserRole | null));
  }

  const freelancerId = requiredText(formData, "freelancerId");
  const status = requiredText(formData, "status");

  if (!freelancerId || !["verified", "rejected", "pending"].includes(status)) {
    return { error: "Invalid verification request." };
  }

  const { error } = await supabase
    .from("freelancer_profiles")
    .update({ verification_status: status, updated_at: new Date().toISOString() })
    .eq("id", freelancerId);

  if (error) {
    console.error("[marketplace:update-verification]", error);
    return { error: "Could not update verification." };
  }

  await supabase.from("admin_events").insert({
    actor_id: user.id,
    actor_label: profile?.full_name || user.email,
    action: `Freelancer ${status}`,
    entity_type: "freelancer_profile",
    entity_id: freelancerId,
  });

  revalidatePath("/admin");
  revalidatePath("/freelancers");
  return { success: true };
}

export async function redirectToSafePath(formData: FormData) {
  redirect(safeInternalPath(requiredText(formData, "redirect"), "/"));
}
