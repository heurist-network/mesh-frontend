import type { BaseAgentConfig } from '../base';

export interface AlloraPricePredictionAgentConfig extends BaseAgentConfig {
  agentId: 'AlloraPricePredictionAgent';
}

export interface PredictionData {
  token: string;
  timeframe: string;
  prediction: number;
  confidence_intervals: string[];
  confidence_interval_values: string[];
}

export interface AlloraPredictionResponse {
  prediction_data: PredictionData;
}
