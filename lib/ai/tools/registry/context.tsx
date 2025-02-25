// TODO: only one agent should be exposed to the LLM at a time,
// this will later be tracked using (possibly?) local-storage for persistence
// and will be accessible in all files through this context
// along with a picker in the UI to select the active agent

'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getAvailableTools } from './registry';
import type { ToolRegistryEntry } from './types';
import { useInitTools } from './use-init-tools';

interface ToolsContextState {
  activeAgent: string | null;
  availableTools: ToolRegistryEntry[];
}

interface ToolsContextValue extends ToolsContextState {
  setActiveAgent: (agentName: string | null) => void;
}

const ToolsContext = createContext<ToolsContextValue | null>(null);

export function ToolsProvider({ children }: { children: ReactNode }) {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  useInitTools();

  const availableTools = useMemo(() => {
    return getAvailableTools(activeAgent || undefined);
  }, [activeAgent]);

  const value = useMemo(
    () => ({
      activeAgent,
      availableTools,
      setActiveAgent,
    }),
    [activeAgent, availableTools],
  );

  return (
    <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
}
