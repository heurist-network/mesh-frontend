'use server';

import { getWeather } from '../get-weather';
import { createDocument } from '../create-document';
import { updateDocument } from '../update-document';
import { requestSuggestions } from '../request-suggestions';
import type { BaseDocumentToolProps } from './types';
import type { Tool } from 'ai';
import {
  coinGeckoAgent,
  bitquerySolanaAgent,
  dexScreenerAgent,
  exaSearchAgent,
  masaTwitterSearchAgent,
  alloraPricePredictionAgent,
  carvOnchainDataAgent,
} from '../configs';

const agentTools = {
  getWeather,

  // coingecko tools
  getTokenInfo: coinGeckoAgent.getTokenInfo,
  getTrendingCoins: coinGeckoAgent.getTrendingCoins,

  // solana tools
  getTokenTradingInfo: bitquerySolanaAgent.getTokenTradingInfo,
  getTopTrendingTokens: bitquerySolanaAgent.getTopTrendingTokens,

  // dexscreener tools
  searchPairs: dexScreenerAgent.searchPairs,
  getSpecificPairInfo: dexScreenerAgent.getSpecificPairInfo,
  getTokenPairs: dexScreenerAgent.getTokenPairs,
  getTokenProfiles: dexScreenerAgent.getTokenProfiles,

  // exa search tools
  search: exaSearchAgent.search,
  answer: exaSearchAgent.answer,

  // masa search tools
  searchTwitter: masaTwitterSearchAgent.twitterSearch,

  // allora tools
  getAlloraPrediction: alloraPricePredictionAgent.getAlloraPrediction,

  // carv tools
  queryOnchainData: carvOnchainDataAgent.queryOnchainData,
};

const documentTools = {
  createDocument,
  updateDocument,
  requestSuggestions,
};

export async function executeToolFunction(
  name: string,
  props?: BaseDocumentToolProps,
): Promise<Tool> {
  if (name in agentTools) {
    const toolFn = agentTools[name as keyof typeof agentTools];
    return toolFn();
  }

  if (name in documentTools) {
    if (!props) {
      throw new Error(`Tool ${name} requires session and dataStream props`);
    }
    const toolFn = documentTools[name as keyof typeof documentTools];
    return toolFn(props);
  }

  throw new Error(`Tool function ${name} not found`);
}
