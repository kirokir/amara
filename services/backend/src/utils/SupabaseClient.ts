import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { logger } from './logger'; // <-- ADD THIS LINE

export const supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceKey);

logger.info('Supabase admin client initialized.');