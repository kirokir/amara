import express from 'express';
import cors from 'cors';
import { config } from './config';
import { logger } from './utils/logger';
import aiRoutes from './api/ai.routes';
import webhookRoutes from './api/webhooks.routes';

const app = express();

// --- Middleware ---
app.use(cors()); // Allow requests from our mobile app
app.use(express.json()); // Parse JSON request bodies

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Amara Backend Services are running!');
});

app.use('/api/ai', aiRoutes);
app.use('/api/webhooks', webhookRoutes);


// --- Server Startup ---
app.listen(config.server.port, () => {
  logger.info(`Amara Backend Server is listening on http://localhost:${config.server.port}`);
  logger.info(`Current AI Provider: ${config.ai.provider}`);
});