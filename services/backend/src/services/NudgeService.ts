import { aiService } from './ai/AiService';
import { supabaseAdmin } from '../utils/SupabaseClient';
import { logger } from '../utils/logger';

const AMARA_AI_USER_ID = null;

async function getChatHistory(chatId: string, limit = 25): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('content')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error('Error fetching chat history', error, { chatId });
    return 'Error fetching messages.';
  }
  if (!data) {
    return 'No messages found.';
  }
  return data.reverse().map(m => m.content).join('\n');
}

export async function generateNudgeForCouple(coupleChatId: string): Promise<void> {
  logger.info(`[Nudge Service] Starting analysis for couple chat: ${coupleChatId}`);
  try {
    const { data: participants, error: pError } = await supabaseAdmin
      .from('chat_participants')
      .select('user_id')
      .eq('chat_id', coupleChatId);

    if (pError || !participants || participants.length !== 2) { // <-- ADDED NULL CHECKS
      logger.warn(`[Nudge Service] Could not find two participants for chat ${coupleChatId}.`, { error: pError });
      return;
    }
    const [partnerA_id, partnerB_id] = participants.map(p => p.user_id);
    
    // --- THIS IS THE CORRECTED QUERY LOGIC ---
    // Find the IDs of all private AI chats first
    const { data: privateChatIds, error: privateChatIdError } = await supabaseAdmin
        .from('chats')
        .select('id')
        .eq('chat_type', 'PRIVATE_AI');

    if (privateChatIdError || !privateChatIds) {
        logger.error('[Nudge Service] Could not fetch private chat IDs.', privateChatIdError);
        return;
    }
    const aiChatIdList = privateChatIds.map(c => c.id);
    
    // Now find the specific private chats for our two partners
    const { data: privateChats, error: pcError } = await supabaseAdmin
      .from('chat_participants')
      .select('chat_id, user_id')
      .in('user_id', [partnerA_id, partnerB_id])
      .in('chat_id', aiChatIdList);
    // --- END OF CORRECTED QUERY ---
      
    if (pcError) throw pcError; // Let the catch block handle this

    const partnerA_privateChatId = privateChats?.find(c => c.user_id === partnerA_id)?.chat_id;
    const partnerB_privateChatId = privateChats?.find(c => c.user_id === partnerB_id)?.chat_id;
    
    // Fetch histories
    const coupleChatHistory = await getChatHistory(coupleChatId);
    const partnerA_privateHistory = partnerA_privateChatId ? await getChatHistory(partnerA_privateChatId) : "No private chat history.";
    const partnerB_privateHistory = partnerB_privateChatId ? await getChatHistory(partnerB_privateChatId) : "No private chat history.";
    
    const megaPrompt = `
      You are Amara, a relationship therapist AI. Your goal is to promote empathy and healthy communication. Your output must be concise. You MUST NOT reveal secrets or specific details from private chats. Instead, you must synthesize the underlying emotions or themes and transform them into gentle, forward-looking nudges, questions, or affirmations for the couple's shared chat.

      Context: The couple's shared conversation is:
      ---
      ${coupleChatHistory}
      ---
      Context: Partner A's private thoughts are:
      ---
      ${partnerA_privateHistory}
      ---
      Context: Partner B's private thoughts are:
      ---
      ${partnerB_privateHistory}
      ---
      Task: Based on ALL of the above context, analyze the emotional state and communication patterns. Generate ONE short, helpful, and subtle message to post in the couple's chat. The message should encourage positive interaction, spark a healthy conversation, or offer a moment of shared reflection. Examples: "What's one thing you appreciate about each other today?", "This might be a good time to talk about plans for the weekend.". If no nudge is needed, your ONLY output should be the single word 'NULL'.`;

    const nudgeContent = await aiService.getProvider().generateNudge(megaPrompt);

    if (nudgeContent) {
      logger.info(`[Nudge Service] Generated nudge for ${coupleChatId}: "${nudgeContent}"`);
      await supabaseAdmin.from('messages').insert({
        chat_id: coupleChatId,
        user_id: AMARA_AI_USER_ID,
        content: nudgeContent,
      });
    } else {
      logger.info(`[Nudge Service] No nudge needed for chat ${coupleChatId}.`);
    }
  } catch (err) {
    logger.error(`[Nudge Service] Error during processing for chat ${coupleChatId}:`, err);
  }
}