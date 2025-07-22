import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { supabaseAdmin } from '../utils/SupabaseClient';
import { aiService } from '../services/ai/AiService';
import { logger } from '../utils/logger';

const router = Router();

// This endpoint is for the private 1-on-1 Amara AI chat
router.post('/chat', authMiddleware, async (req, res) => {
  const { chatId, message } = req.body;
  const user = (req as any).user;

  if (!chatId || !message) {
    return res.status(400).json({ error: 'chatId and message are required.' });
  }

  try {
    // 1. Verify user is a participant of this chat
    const { data: participant, error: pError } = await supabaseAdmin
      .from('chat_participants')
      .select('chat_id')
      .eq('chat_id', chatId)
      .eq('user_id', user.id)
      .single();

    if (pError || !participant) {
      return res.status(403).json({ error: 'Forbidden: You are not a member of this chat.' });
    }

    // 2. Save the user's message
    await supabaseAdmin.from('messages').insert({
        chat_id: chatId,
        user_id: user.id,
        content: message
    });

    // 3. Get chat history for AI context
    const { data: historyData } = await supabaseAdmin
        .from('messages')
        .select('user_id, content')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .limit(10);
    
    // --- THIS IS THE CORRECTED TYPING ---
    const history: { role: 'user' | 'assistant'; content: string }[] = (historyData || []).reverse().map(msg => ({
        role: msg.user_id === user.id ? 'user' : 'assistant',
        content: msg.content
    }));
    // --- END OF CORRECTION ---

    // 4. Get AI response
    const systemPrompt = `You are Amara, a supportive and insightful AI assistant focused on relationship wellness. You are speaking privately with one partner. Be empathetic, encouraging, and provide constructive advice. Keep your responses concise and conversational.`;
    // The history is now correctly typed, so this call is valid.
    const aiResponse = await aiService.getProvider().generateResponse(systemPrompt, history);
    
    // 5. Save AI's response to the database
    await supabaseAdmin.from('messages').insert({
        chat_id: chatId,
        user_id: null,
        content: aiResponse,
    });

    res.status(200).json({ message: 'Response processed.' });
  } catch (error) {
    logger.error('Error in /api/ai/chat:', error);
    res.status(500).json({ error: 'An internal error occurred.' });
  }
});

export default router;