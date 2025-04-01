import type { BaseAgentConfig } from '../base';

export interface CarvOnchainDataAgentConfig extends BaseAgentConfig {
  agentId: 'CarvOnchainDataAgent';
}

export interface OnchainDataResponse {
  response: string;
  data: {
    blockchain: string;
    query: string;
    results: {
      code: number;
      msg: string;
      data: {
        column_infos: string[];
        rows: Array<{
          items: string[];
        }>;
      };
    };
  };
}
