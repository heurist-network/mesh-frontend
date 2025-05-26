'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { getApiKey, hasApiKey } from './utils';
import {
  createServer,
  deleteServer,
  listServers,
  getServerDetails,
  getAgents,
} from './mcp-provisioner-api';
import { toast } from 'sonner';

export interface Agent {
  id: string;
  name: string;
  author: string;
  description: string;
  tags: string[];
  image_url?: string;
  total_calls?: number;
  recommended?: boolean;
  tools?: any[];
  credits?: number;
}

interface ServerInfo {
  server_id: string;
  endpoint: string;
  mcp_endpoint: string;
  supported_agents?: string | string[];
}

interface ProvisionerContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  selectedAgents: string[];
  toggleAgentSelection: (agentId: string) => void;
  isAgentSelected: (agentId: string) => boolean;
  activeServer: ServerInfo | null;
  isLoading: boolean;
  createNewServer: () => Promise<void>;
  deleteActiveServer: () => Promise<void>;
  refreshServerStatus: () => Promise<void>;
  error: string | null;
  hasApiKey: () => boolean;
  allAgents: Record<string, any> | null;
  allAgentsArray: Agent[];
  refreshAgents: () => Promise<void>;
  serverAgents: string[];
  agentsToAdd: string[];
  agentsToRemove: string[];
}

const ProvisionerContext = createContext<ProvisionerContextType | undefined>(
  undefined,
);

export function ProvisionerProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeServer, setActiveServer] = useState<ServerInfo | null>(null);
  const [apiKeyState, setApiKeyState] = useState(() => getApiKey());
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [allAgents, setAllAgents] = useState<Record<string, any> | null>(null);

  const apiKey = apiKeyState;

  const allAgentsArray = useMemo(() => {
    if (!allAgents) return [];

    const agentsArray = Object.keys(allAgents).map((key) => {
      const agent = allAgents[key];
      const metadata = {
        id: key,
        name: 'Unnamed Agent',
        author: 'Heurist',
        description: '',
        tags: [],
        image_url: '',
        recommended: false,
        tools: agent.tools || [],
      };
      return Object.assign(metadata, agent.metadata);
    });

    agentsArray.sort((a, b) => (b.total_calls || 0) - (a.total_calls || 0));
    return agentsArray.filter((item) => item.name && !(item as any).hidden);
  }, [allAgents]);

  // Centralized calculation for server agents
  const serverAgents = useMemo(() => {
    if (!activeServer || !activeServer.supported_agents) {
      return [];
    }
    return (
      Array.isArray(activeServer.supported_agents)
        ? activeServer.supported_agents
        : activeServer.supported_agents.split(',')
    )
      .map((a) => a.trim())
      .filter(Boolean);
  }, [activeServer]);

  // Centralized calculation for agents to add
  const agentsToAdd = useMemo(() => {
    // Agents selected but not on the server
    return selectedAgents.filter((id) => !serverAgents.includes(id));
  }, [selectedAgents, serverAgents]);

  // Centralized calculation for agents to remove
  const agentsToRemove = useMemo(() => {
    // Agents on the server but not selected
    return serverAgents.filter((id) => !selectedAgents.includes(id));
  }, [selectedAgents, serverAgents]);

  const refreshAgents = useCallback(async () => {
    try {
      const data = await getAgents();
      if (data.agents && typeof data.agents === 'object') {
        setAllAgents(data.agents);
      }
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    }
  }, []);

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (hasApiKey()) {
          // run both fetches in parallel if we have a key
          await Promise.all([refreshServerStatus(), refreshAgents()]);
        } else {
          // otherwise, just fetch the agents list
          await refreshAgents();
        }
      } catch (err) {
        console.error('Failed during initial load:', err);
        if (!error) {
          setError(
            err instanceof Error ? err.message : 'Failed during initial setup',
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshAgents]); // refreshServerStatus is stable, refreshAgents covers agent list changes

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key) {
      refreshServerStatus();
    } else {
      setActiveServer(null);
    }
  };

  const toggleAgentSelection = useCallback((agentId: string) => {
    setSelectedAgents((prev) => {
      if (prev.includes(agentId)) {
        return prev.filter((id) => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });
  }, []);

  const isAgentSelected = useCallback(
    (agentId: string) => {
      return selectedAgents.includes(agentId);
    },
    [selectedAgents],
  );

  const refreshServerStatus = async () => {
    if (!hasApiKey()) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiKey = getApiKey();
      const { servers } = await listServers(apiKey);

      if (servers.length > 0) {
        // Get the first server's details
        const serverDetails = await getServerDetails(
          apiKey,
          servers[0].server_id,
        );
        setActiveServer(serverDetails);

        // Update selected agents based on the active server
        if (serverDetails.supported_agents) {
          const supportedAgents = Array.isArray(serverDetails.supported_agents)
            ? serverDetails.supported_agents
            : serverDetails.supported_agents.split(',');
          setSelectedAgents(supportedAgents);
        }
      } else {
        setActiveServer(null);
      }
    } catch (err) {
      console.error('Failed to refresh server status:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to refresh server status',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createNewServer = async () => {
    if (!hasApiKey() || selectedAgents.length === 0) {
      toast.error(
        !hasApiKey()
          ? 'Please enter your API key first'
          : 'Please select at least one agent',
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if we are updating an existing server
      const isUpdating = !!activeServer;

      // If there's an active server, delete it first
      if (activeServer) {
        await deleteServer(getApiKey(), activeServer.server_id);
      }

      // Create a new server with selected agents
      await createServer(getApiKey(), selectedAgents);

      // Refresh the server status to fetch the latest details and update state
      await refreshServerStatus();

      toast.success(
        isUpdating
          ? 'Server updated successfully'
          : 'Server created successfully',
      );
    } catch (err) {
      console.error('Failed to create server:', err);
      setError(err instanceof Error ? err.message : 'Failed to create server');
      toast.error('Failed to create server');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteActiveServer = async () => {
    if (!activeServer) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteServer(getApiKey(), activeServer.server_id);
      setActiveServer(null);
      toast.success('Server deleted successfully');
    } catch (err) {
      console.error('Failed to delete server:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete server');
      toast.error('Failed to delete server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProvisionerContext.Provider
      value={{
        apiKey,
        setApiKey,
        selectedAgents,
        toggleAgentSelection,
        isAgentSelected,
        activeServer,
        isLoading,
        createNewServer,
        deleteActiveServer,
        refreshServerStatus,
        error,
        hasApiKey,
        allAgents,
        allAgentsArray,
        refreshAgents,
        serverAgents,
        agentsToAdd,
        agentsToRemove,
      }}
    >
      {children}
    </ProvisionerContext.Provider>
  );
}

export function useProvisioner() {
  const context = useContext(ProvisionerContext);
  if (context === undefined) {
    throw new Error('useProvisioner must be used within a ProvisionerProvider');
  }
  return context;
}
