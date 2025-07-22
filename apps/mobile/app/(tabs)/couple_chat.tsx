import React, { useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, IMessage, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useCoupleChat } from '../../hooks/useCoupleChat';
import { ColorTheme } from '../../constants/ColorTheme';
import NoPartnerCTA from '../../components/partner/NoPartnerCTA';

const formatMessage = (msg: any, partnerId: string | undefined): IMessage => ({
  _id: msg.id,
  text: msg.content,
  createdAt: new Date(msg.created_at),
  user: {
    _id: msg.user_id || 'amara-ai',
    name: msg.user_id === partnerId ? 'Partner' : 'You',
  },
  system: !msg.user_id,
});

export default function CoupleChatScreen() {
  const { user, profile } = useAuth();
  const { loading, chatId, partner, messages, setMessages } = useCoupleChat();

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!chatId || !user) return;
    const content = newMessages[0].text;
    const messageForUI = {
        id: Math.random(), // temp id
        chat_id: chatId,
        user_id: user.id,
        content,
        created_at: new Date().toISOString()
    };
    setMessages(previousMessages => [messageForUI, ...previousMessages]);

    await supabase.from('messages').insert({
      chat_id: chatId,
      user_id: user.id,
      content: content,
    });
  }, [chatId, user, setMessages]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={ColorTheme.violet} /></View>;
  }

  if (!partner || !chatId) {
    return <NoPartnerCTA />;
  }

  const giftedChatMessages = messages.map(msg => formatMessage(msg, partner?.id));

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={giftedChatMessages}
        onSend={msgs => onSend(msgs)}
        user={{ _id: user!.id, name: profile?.username || 'You' }}
        renderBubble={props => (
          <Bubble {...props} wrapperStyle={{ right: { backgroundColor: ColorTheme.violet }, left: { backgroundColor: ColorTheme.offGray }}} />
        )}
        renderInputToolbar={props => (
          <InputToolbar {...props} containerStyle={styles.inputToolbar} primaryStyle={{ alignItems: 'center' }} />
        )}
        messagesContainerStyle={{ paddingBottom: 10 }}
        placeholder="Type your message..."
      />
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ColorTheme.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  inputToolbar: { borderTopWidth: 1, borderTopColor: '#E0E0E0', backgroundColor: ColorTheme.white, padding: 5 },
});