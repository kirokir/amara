import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../utils/SupabaseClient';
import { logger } from '../utils/logger';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      logger.warn('Auth middleware: Invalid token received.', { error: error?.message });
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }

    // Attach user to the request object for use in downstream handlers
    (req as any).user = user;
    next();
  } catch (err) {
    logger.error('Auth middleware: An unexpected error occurred.', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};