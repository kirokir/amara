import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Profile } from '../lib/store';
import { useFocusEffect } from 'expo-router';

// This function now needs to be a callable RPC
// Create a new RPC in Supabase SQL Editor:
/*
CREATE OR REPLACE FUNCTION get_couple_chat_details()
RETURNS TABLE (
  chat_id UUID,
  partner_id UUID,
  partner_username TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id as chat_id,
    p.id as partner_id,
    p.username as partner_username
  FROM
    public.chats c
  JOIN
    public.chat_participants cp1 ON c.id = cp1.chat_id
  JOIN
    public.chat_participants cp2 ON c.id = cp2.chat_id
  JOIN
    public.profiles p ON cp2.user_id = p.id
  WHERE
    c.chat_type = 'COUPLE' AND
    cp1.user_id = auth.uid() AND
    cp2.user_id != auth.uid();
END;
$$ LANGUAGE plpgsql;
*/

export function useCoupleChat() {
  const { user } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [partner, setPartner] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChatInfo = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_couple_chat_details');
      if (error) throw error;
      
      if (data && data.length > 0) {
        const chatDetails = data[0];
        setChatId(chatDetails.chat_id);
        setPartner({ id: chatDetails.partner_id, username: chatDetails.partner_username });

        const { data: messageData, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatDetails.chat_id)
          .order('created_at', { ascending: false })
          .limit(50);
        if (msgError) throw msgError;
        setMessages(messageData || []);
      } else {
        // No partner found, reset state
        setChatId(null);
        setPartner(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching couple chat info:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refetch chat info whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchChatInfo();
    }, [fetchChatInfo])
  );

  // Real-time subscription
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`couple-chat:${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          setMessages((currentMessages) => [payload.new, ...currentMessages]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  return { loading, chatId, partner, messages, setMessages };
}