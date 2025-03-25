# Adding New Agents and Tools

This guide explains how to add new agents and tools to the system. Agents are specialized classes that handle specific domains (like weather, crypto, etc.) and expose tools that can be called by the AI.

## Architecture

The system uses an agent-based architecture where:

- Agents (`lib/ai/agents/*`) handle domain-specific logic and API calls
- Each agent exposes one or more tools
- Tools are registered in the registry system for use by the AI
- UI components render the results of tool calls

## Agent Structure

A typical agent consists of:

1. Agent class and types (`lib/ai/agents/your-agent/`)
   - `index.ts`: Agent class and tool definitions
   - `types.ts`: TypeScript interfaces for the domain
   - UI components (`.tsx` files): React components to render tool results
2. Tool registration in the registry system

## Step-by-Step Guide

Let's walk through adding a new agent using the CoinGecko agent as an example.

### 1. Create the Agent

First, create a new directory in `lib/ai/agents/` (e.g., `coin-gecko/`):

```typescript
// types.ts
import type { BaseAgentConfig } from "../base";

export interface CoinGeckoAgentConfig extends BaseAgentConfig {
  agentId: "CoinGeckoTokenInfoAgent";
}

export interface TokenInfo {
  id: string;
  symbol: string;
  name: string;
  // ... other fields
}

// index.ts
import { tool } from "ai";
import { z } from "zod";
import { BaseAgent } from "../base";
import type { TokenInfo } from "./types";

export const coinGeckoAgentTools = {
  getTokenInfo: {
    name: "get_token_info",
    description: "Get detailed token information...",
    parameters: z
      .object({
        coingecko_id: z.string().describe("The CoinGecko ID of the token"),
      })
      .required(),
  },
  // ... other tools
} as const;

export class CoinGeckoAgent extends BaseAgent {
  getTokenInfo = () =>
    tool({
      ...coinGeckoAgentTools.getTokenInfo,
      execute: async ({ coingecko_id }) => {
        return this.makeRequest<CryptoMetrics>("get_token_info", { coingecko_id });
      },
    });

  // ... other tool methods
}
```

### 2. Create the UI Components

Create React components within your agent directory to display the agent's tool results:

```tsx
// lib/ai/agents/coin-gecko/coingecko-crypto-price.tsx
export interface CryptoMetrics {
  token_info: {
    name: string;
    symbol: string;
    // ... other fields
  };
  // ... other metrics
}

// add a sample for loading states
const SAMPLE: CryptoMetrics = {
  token_info: {
    name: 'Loading...',
    // ... sample data
  },
};

export function CoinGeckoCryptoPrice({
  cryptoMetrics = SAMPLE,
}: {
  cryptoMetrics?: CryptoMetrics;
}) {
  return (
    // your JSX here
  );
}
```

### 3. Register the Agent's Tools

#### a. Add to Tool Configs (`lib/ai/tools/configs.ts`)

```typescript
import { CoinGeckoAgent, coinGeckoAgentTools } from "../agents/coin-gecko";

export const coinGeckoAgent = new CoinGeckoAgent({
  agentId: "CoinGeckoTokenInfoAgent",
});

const agentTools = {
  // ... existing tools
  getTokenInfo: {
    ...coinGeckoAgentTools.getTokenInfo,
    category: "agent" as const,
    toolFn: coinGeckoAgent.getTokenInfo,
  },
};
```

#### b. Add UI Configs (`lib/ai/tools/registry/use-init-tools.tsx`)

```typescript
import { CoinGeckoCryptoPrice } from "@/lib/ai/agents/coin-gecko/coingecko-crypto-price";

const agentToolConfigs = {
  // ... existing tools
  getTokenInfo: {
    renderResult: (result: any) => <CoinGeckoCryptoPrice cryptoMetrics={result} />,
    renderLoading: () => <CoinGeckoCryptoPrice />,
  },
};
```

#### c. Register in Server Actions (`lib/ai/tools/registry/actions.ts`)

```typescript
const agentTools = {
  // ... existing tools
  getTokenInfo: coinGeckoAgent.getTokenInfo, // reuse the instance from configs.ts
};
```

## Tool Categories

Tools are divided into two categories:

- `base`: Core tools that require session and dataStream props (e.g., document operations)
- `agent`: Tools provided by agents that handle domain-specific tasks (e.g., weather, crypto prices)
