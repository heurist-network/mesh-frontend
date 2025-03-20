import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

const openrouter = createOpenAICompatible({
  name: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export const myProvider = customProvider({
  languageModels: {
    'chat-model-small': openrouter('openai/gpt-4o-mini') as any,
    'chat-model-large': openrouter('openai/gpt-4o') as any,
    'chat-model-reasoning': wrapLanguageModel({
      model: openrouter('deepseek/deepseek-r1') as any,
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': openrouter('openai/gpt-4-turbo') as any,
    'artifact-model': openrouter('openai/gpt-4o-mini') as any,
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-small',
    name: 'Small model',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-large',
    name: 'Large model',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];
