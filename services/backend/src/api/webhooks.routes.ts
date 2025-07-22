import { Router } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';
import { generateNudgeForCouple } from '../services/NudgeService';

const router = Router();

// Simple counter to trigger nudge engine not on every message.
// In a real production system, this state would be moved to Redis or a database table.
const messageCounters: Record<string, number> = {};
const NUDGE_THRESHOLD = 5; // Trigger nudge engine after this many messages

router.post('/new-message', (req, res) => {
  // 1. Secure the webhook
  const webhookSecret = req.headers['x-webhook-secret'];
  if (webhookSecret !== config.server.webhookSecret) {
    logger.warn('Webhook received with invalid secret.');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Process the payload
  const { type, record } = req.body;
  if (type === 'INSERT' && record.chat_id) {
    const chatId = record.chat_id;

    // Check if it's a couple chat
    // A better way would be to join this info in the webhook payload if possible,
    // but for now, we assume we need to check.
    if (record.user_id) { // Don't trigger on AI's own messages
        messageCounters[chatId] = (messageCounters[chatId] || 0) + 1;
        logger.info(`Message counter for chat ${chatId} is now ${messageCounters[chatId]}`);
    
        if (messageCounters[chatId] >= NUDGE_THRESHOLD) {
            logger.info(`Nudge threshold reached for chat ${chatId}. Triggering nudge service.`);
            // Reset counter
            messageCounters[chatId] = 0;
            // Trigger the service asynchronously, don't make Supabase wait for the LLM
            generateNudgeForCouple(chatId).catch(err => {
                logger.error('Async nudge generation failed', err);
            });
        }
    }
  }

  res.status(200).json({ message: 'Webhook received.' });
});

export default router;