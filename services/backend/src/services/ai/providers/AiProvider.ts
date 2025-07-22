export interface AiProvider {
  generateResponse(prompt: string, history: { role: 'user' | 'assistant'; content: string }[]): Promise<string>;
  generateNudge(prompt: string): Promise<string | null>;
}