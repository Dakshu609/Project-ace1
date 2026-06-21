"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface ConversationRow {
  id: string;
  client_id: string;
  freelancer_user_id: string;
  participant_name: string | null;
  participant_avatar_url: string | null;
  last_message: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export function useRealtimeConversations(userId: string | null) {
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setLoading(false);
      return;
    }
    const uid: string = userId;

    let channel: RealtimeChannel;

    async function loadConversations() {
      setLoading(true);
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .or(`client_id.eq.${uid},freelancer_user_id.eq.${uid}`)
        .order("updated_at", { ascending: false });

      setConversations(data || []);
      setLoading(false);
    }

    loadConversations();

    // Subscribe to conversation updates
    channel = supabase
      .channel(`conversations:${uid}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setConversations((current) => [
              payload.new as ConversationRow,
              ...current,
            ]);
          } else if (payload.eventType === "UPDATE") {
            setConversations((current) =>
              current.map((conv) =>
                conv.id === payload.new.id
                  ? (payload.new as ConversationRow)
                  : conv
              )
            );
          } else if (payload.eventType === "DELETE") {
            setConversations((current) =>
              current.filter((conv) => conv.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, supabase]);

  return { conversations, loading };
}
