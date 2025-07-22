// File: apps/mobile/api/ai.ts
import { useStore } from '../lib/store';
import Toast from 'react-native-toast-message';
import { BACKEND_URL } from '@env';

if (!BACKEND_URL) {
  console.warn("CRITICAL WARNING: BACKEND_URL is not set in your environment file! The AI chat will not work.");
}

export const sendAiChatMessage = async (chatId: string, message: string): Promise<void> => {
  const session = useStore.getState().session;
  if (!session) {
    Toast.show({ type: 'error', text1: 'Not Authenticated', text2: 'Please log in to chat with the AI.' });
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ chatId, message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send message to AI');
    }
  } catch (error: any) {
    console.error('API Error in sendAiChatMessage:', error);
    Toast.show({ type: 'error', text1: 'AI Connection Error', text2: error.message });
  }
};