import type { DataStreamWriter, Tool } from 'ai';
import type { Session } from 'next-auth';
import type { ReactNode } from 'react';
import type { ZodObject } from 'zod';

// base interface for tool configuration
export interface ToolConfig<T = any> {
  name: string;
  category: 'base' | 'agent';
  description: string;
  parameters: ZodObject<any>;
  renderResult?: (result: T) => ReactNode;
  renderLoading?: () => ReactNode;
  toolFn?: ToolFunction;
  agentId?: string;
}

// props that document tools receive
export interface BaseDocumentToolProps {
  session: Session;
  dataStream: DataStreamWriter;
}

// type for a function that creates a tool
export type ToolFunction = (
  props?: BaseDocumentToolProps,
) => Tool | Promise<Tool>;

// registry entry combining tool function and its config
export interface ToolRegistryEntry {
  toolFn: ToolFunction;
  config: ToolConfig;
}

// types of tools
export type ToolCategory = 'base' | 'agent';

// registry structure
export interface ToolRegistry {
  base: Record<string, ToolRegistryEntry>;
  agent: Record<string, ToolRegistryEntry>;
}
