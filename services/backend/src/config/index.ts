import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'BACKEND_SUPABASE_URL',
  'BACKEND_SUPABASE_SERVICE_KEY',
  'BACKEND_JWT_SECRET',
  'BACKEND_WEBHOOK_SECRET',
  'AI_PROVIDER',
  'OLLAMA_HOST',
  'PORT',
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Configuration Error: Environment variable ${varName} is missing.`);
  }
}

export const config = {
  supabase: {
    url: process.env.BACKEND_SUPABASE_URL!,
    serviceKey: process.env.BACKEND_SUPABASE_SERVICE_KEY!,
    jwtSecret: process.env.BACKEND_JWT_SECRET!,
  },
  server: {
    port: parseInt(process.env.PORT!, 10) || 8000,
    webhookSecret: process.env.BACKEND_WEBHOOK_SECRET!,
  },
  ai: {
    provider: process.env.AI_PROVIDER! as 'ollama' | 'openai',
    ollama: {
      host: process.env.OLLAMA_HOST!,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '', // Optional
    },
  },
};