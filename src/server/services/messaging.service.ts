"use server";

import { db } from "@/server/lib/supabase";
import { sendNewMessageNotification } from "./email.service";
import { revalidatePath } from "next/cache";

export interface SendMessageParams {
  conversationId: string;
  body: string;
}

export interface CreateConversationParams {
  freelancerUserId: string;
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(params: SendMessageParams) {
  try {
    const supabase = await db();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify user is part of conversation
    const { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", params.conversationId)
      .or(`client_id.eq.${user.id},freelancer_user_id.eq.${user.id}`)
      .single();

    if (!conversation) {
      return { success: false, error: "Conversation not found" };
    }

    // Get sender profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    // Insert message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: params.conversationId,
        sender_id: user.id,
        sender_name: profile?.full_name || "User",
        sender_avatar_url: profile?.avatar_url,
        body: params.body,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Update conversation last_message
    await supabase
      .from("conversations")
      .update({
        last_message: params.body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.conversationId);

    // Send email notification to recipient
    const recipientId =
      conversation.client_id === user.id
        ? conversation.freelancer_user_id
        : conversation.client_id;

    if (!recipientId) return;

    const { data: recipient } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", recipientId)
      .single();

    if (recipient?.email) {
      await sendNewMessageNotification(
        recipient.email,
        profile?.full_name || "A user",
        params.body
      );
    }

    revalidatePath("/messages");

    return { success: true, message };
  } catch (error) {
    console.error("Send message failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Create or get existing conversation
 */
export async function createOrGetConversation(
  params: CreateConversationParams
) {
  try {
    const supabase = await db();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `and(client_id.eq.${user.id},freelancer_user_id.eq.${params.freelancerUserId}),and(freelancer_user_id.eq.${user.id},client_id.eq.${params.freelancerUserId})`
      )
      .maybeSingle();

    if (existing) {
      return { success: true, conversation: existing };
    }

    // Get freelancer profile info
    const { data: freelancerProfile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", params.freelancerUserId)
      .single();

    // Create new conversation
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        client_id: user.id,
        freelancer_user_id: params.freelancerUserId,
        participant_name: freelancerProfile?.full_name || "User",
        participant_avatar_url: freelancerProfile?.avatar_url,
        last_message: "",
        unread_count: 0,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/messages");

    return { success: true, conversation };
  } catch (error) {
    console.error("Create conversation failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(conversationId: string) {
  try {
    const supabase = await db();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Mark all unread messages in conversation as read
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id)
      .is("read_at", null);

    // Reset unread count
    await supabase
      .from("conversations")
      .update({ unread_count: 0 })
      .eq("id", conversationId);

    revalidatePath("/messages");

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Get conversation messages with real-time support
 */
export async function getConversationMessages(conversationId: string) {
  const supabase = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { messages: [], error: "Unauthorized" };
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return { messages: messages || [], error };
}

/**
 * Get user conversations
 */
export async function getUserConversations() {
  const supabase = await db();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { conversations: [], error: "Unauthorized" };
  }

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`client_id.eq.${user.id},freelancer_user_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  return { conversations: conversations || [], error };
}
