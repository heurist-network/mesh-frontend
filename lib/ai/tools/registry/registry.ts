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

// get all available tools (base + agent)
export function getAvailableTools(agentToolName?: string): ToolRegistryEntry[] {
  return [...Object.values(registry.base), ...Object.values(registry.agent)];
}

// get tool by name from any category
export function getTool(name: string): ToolRegistryEntry | undefined {
  return registry.base[name] || registry.agent[name];
}

// initialize tools with optional ui configs
export function initializeTools(uiConfigs?: Record<string, any>) {
  Object.entries(tools).forEach(([name, tool]) => {
    const config = uiConfigs ? { ...tool, ...uiConfigs[name] } : tool;
    registerTool(
      tool.category,
      wrapTool((config as ToolConfig).toolFn ?? null, config),
    );
  });
}
