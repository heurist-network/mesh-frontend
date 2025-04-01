import { tool } from 'ai';
import { z } from 'zod';
import { BaseAgent } from '../base';
import type { AlloraPredictionResponse } from './types';

export const alloraPricePredictionAgentTools = {
  getAlloraPrediction: {
    name: 'get_allora_prediction',
    description:
      'Get price prediction for ETH or BTC with confidence intervals using Allora API.',
    parameters: z
      .object({
        token: z
          .enum(['ETH', 'BTC'])
          .describe('The cryptocurrency symbol (ETH or BTC)'),
        timeframe: z.enum(['5m', '8h']).describe('Time period for prediction'),
      })
      .required(),
  },
} as const;

export class AlloraPricePredictionAgent extends BaseAgent {
  getAlloraPrediction = () =>
    tool({
      ...alloraPricePredictionAgentTools.getAlloraPrediction,
      execute: async ({ token, timeframe }) => {
        return this.makeRequest<AlloraPredictionResponse>(
          'get_allora_prediction',
          {
            token,
            timeframe,
          },
        );
      },
    });
}
