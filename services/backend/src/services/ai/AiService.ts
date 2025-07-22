import { config } from '../../config';
import { logger } from '../../utils/logger';
import { AiProvider } from './providers/AiProvider';
import { OllamaProvider } from './providers/OllamaProvider';
import { OpenAiProvider } from './providers/OpenAiProvider';

class AiService {
  private provider: AiProvider;

  constructor() {
    if (config.ai.provider === 'ollama') {
      this.provider = new OllamaProvider();
      logger.info('Using Ollama as the AI provider.');
    } else if (config.ai.provider === 'openai') {
      // this.provider = new OpenAiProvider(); // Uncomment if OpenAI is implemented
      logger.warn('OpenAI provider selected but not fully implemented.');
      this.provider = new OllamaProvider(); // Fallback to Ollama
    } else {
      throw new Error(`Invalid AI_PROVIDER specified: ${config.ai.provider}`);
    }
  }

  public getProvider(): AiProvider {
    return this.provider;
  }
}

export const aiService = new AiService();