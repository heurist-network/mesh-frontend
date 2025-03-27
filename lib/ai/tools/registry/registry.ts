import type {
  ToolRegistry,
  ToolRegistryEntry,
  ToolCategory,
  ToolConfig,
} from './types';
import { wrapTool } from './wrap-tool';
import { tools } from '../configs';

// initialize empty registry
const registry: ToolRegistry = {
  base: {},
  agent: {},
};

let isInitialized = false;
const listeners = new Set<() => void>();

// register a tool in the registry
export function registerTool(category: ToolCategory, entry: ToolRegistryEntry) {
  registry[category][entry.config.name] = entry;
}

// get all base tools
export function getBaseTools(): ToolRegistryEntry[] {
  return Object.values(registry.base);
}

// get a specific agent tool by name
export function getAgentTool(name: string): ToolRegistryEntry | undefined {
  return registry.agent[name];
}

// get all available tools (base + current agent's tools)
export function getAvailableTools(agentId?: string): ToolRegistryEntry[] {
  const baseTools = Object.values(registry.base);
  
  if (!agentId) {
    return baseTools;
  }

  // Only include agent tools that belong to the current agent
  const agentTools = Object.values(registry.agent).filter(
    tool => tool.config.agentId === agentId
  );

  return [...baseTools, ...agentTools];
}

// get tool by name from any category
export function getTool(name: string): ToolRegistryEntry | undefined {
  return registry.base[name] || registry.agent[name];
}

// initialize tools with optional ui configs
export function initializeTools(uiConfigs?: Record<string, any>) {
  if (isInitialized) return;

  Object.entries(tools).forEach(([name, tool]) => {
    const config = uiConfigs ? { ...tool, ...uiConfigs[name] } : tool;
    registerTool(
      tool.category,
      wrapTool((config as ToolConfig).toolFn ?? null, config),
    );
  });

  isInitialized = true;
  listeners.forEach((listener) => listener());
}

// Registry subscription methods
export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRegistrySnapshot() {
  return isInitialized;
}
