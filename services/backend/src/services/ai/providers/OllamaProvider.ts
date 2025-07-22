import { Ollama } from 'ollama';
import { AiProvider } from './AiProvider';
import { config } from '../../../config';
import { logger } from '../../../utils/logger';

export class OllamaProvider implements AiProvider {
  private ollama: Ollama;
  private model = 'mistral'; // Default model

  constructor() {
    this.ollama = new Ollama({ host: config.ai.ollama.host });
    logger.info(`OllamaProvider initialized for host: ${config.ai.ollama.host}`);
  }

  async generateResponse(prompt: string, history: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: [...history, { role: 'user', content: prompt }],
        stream: false,
      });
      return response.message.content;
    } catch (error) {
      logger.error('OllamaProvider error in generateResponse', error);
      throw new Error('Failed to get response from Ollama.');
    }
  }

  async generateNudge(prompt: string): Promise<string | null> {
    try {
        const response = await this.ollama.chat({
            model: this.model,
            messages: [{ role: 'system', content: prompt }],
            stream: false,
        });

        const content = response.message.content.trim();
        if (content.toUpperCase() === 'NULL') {
            return null;
        }
        return content;
    } catch (error) {
        logger.error('OllamaProvider error in generateNudge', error);
        throw new Error('Failed to generate nudge from Ollama.');
    }
  }
}