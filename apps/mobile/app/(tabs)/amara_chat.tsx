import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, IMessage, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { ColorTheme } from '../../constants/ColorTheme';
import { sendAiChatMessage } from '../../api/ai';
import { Ionicons } from '@expo/vector-icons';

// --- START: MISSING PIECES - NOW INCLUDED ---

// Define the Amara AI user profile for GiftedChat. This is essential.
const AMARA_AI_USER = {
  _id: 'amara-ai', // A unique ID for the AI user
  name: 'Amara',
  // IMPORTANT: Ensure you have an image at this path or the app will crash.
  // Create `apps/mobile/assets/images/amara-logo.png`
  avatar: require('../../assets/images/amara-logo.png'),
};

// A more robust helper to format DB messages for the UI
const formatAIMessage = (msg: any, currentUserId: string): IMessage => {
  const isAIMessage = !msg.user_id;
  return {
    _id: msg.id,
    text: msg.content,
    createdAt: new Date(msg.created_at),
    user: isAIMessage ? AMARA_AI_USER : { _id: currentUserId },
  };
};

// --- END: MISSING PIECES ---


export default function AmaraChatScreen() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [aiChatId, setAiChatId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    // Find/create AI chat and subscribe to messages
    useEffect(() => {
        if (!user) return;
        let channel: any;

        const setup = async () => {
            setLoading(true);
            const { data: chatId, error: rpcError } = await supabase.rpc('find_or_create_private_ai_chat');
            if (rpcError) {
                console.error("RPC Error:", rpcError);
                setLoading(false);
                return;
            }
            setAiChatId(chatId);

            const { data: initialMessages, error: msgError } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: false }).limit(50);
            if (msgError) console.error("Message Fetch Error:", msgError);
            else setMessages(initialMessages || []);
            
            channel = supabase.channel(`ai-chat:${chatId}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, payload => {
                    // Only process new messages that aren't already in the state
                    setMessages(current => {
                        if (current.find(m => m.id === payload.new.id)) {
                            return current;
                        }
                        setIsTyping(false);
                        return [payload.new, ...current];
                    });
                }).subscribe();
            
            setLoading(false);
        };
        
        setup();
        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [user]);

    const onSend = useCallback(async (newMessages: IMessage[] = []) => {
        if (!aiChatId || !user) return;
        const content = newMessages[0].text;
        setIsTyping(true);
        // This flow is correct: Send to backend, let realtime handle the UI update for a single source of truth.
        await sendAiChatMessage(aiChatId, content);
    }, [aiChatId, user]);

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={ColorTheme.violet} /></View>;
    }

    const giftedChatMessages = messages.map(msg => formatAIMessage(msg, user!.id));

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={giftedChatMessages}
                onSend={msgs => onSend(msgs)}
                user={{ _id: user!.id }}
                isTyping={isTyping}
                renderBubble={props => (
                    <Bubble {...props} wrapperStyle={{ right: { backgroundColor: ColorTheme.cerulean }, left: { backgroundColor: ColorTheme.offGray }}} textStyle={{right: {color: ColorTheme.white}, left: {color: ColorTheme.lightText}}}/>
                )}
                renderInputToolbar={props => (
                    <InputToolbar {...props} containerStyle={styles.inputToolbar} primaryStyle={{ alignItems: 'center' }} />
                )}
                 renderSend={(props) => (
                    <Send {...props} containerStyle={{ justifyContent: 'center' }}>
                        <Ionicons name="send" size={24} color={ColorTheme.violet} style={{ marginRight: 10 }} />
                    </Send>
                )}
                messagesContainerStyle={{ paddingBottom: 10 }}
                placeholder="Talk to Amara..."
            />
            {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorTheme.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: ColorTheme.offGray },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: ColorTheme.white,
    paddingVertical: 5,
  },
});