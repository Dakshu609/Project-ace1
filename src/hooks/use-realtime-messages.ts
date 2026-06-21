"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string | null;
  sender_avatar_url: string | null;
  body: string;
  read_at: string | null;
  created_at: string;
}

export function useRealtimeMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    const cid: string = conversationId;

    let channel: RealtimeChannel;

    async function loadMessages() {
      setLoading(true);
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", cid)
        .order("created_at", { ascending: true });

      setMessages(data || []);
      setLoading(false);
    }

    loadMessages();

    // Subscribe to new messages
    channel = supabase
      .channel(`messages:${cid}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${cid}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as MessageRow]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, supabase]);

  return { messages, loading };
}
