"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getApiKey, hasApiKey } from './utils';
import { createServer, deleteServer, listServers, getServerDetails } from './mcp-provisioner-api';
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
}

export interface ServerInfo {
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
}

const ProvisionerContext = createContext<ProvisionerContextType | undefined>(undefined);

export function ProvisionerProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [activeServer, setActiveServer] = useState<ServerInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load API key and check for existing servers on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedApiKey = getApiKey();
      setApiKeyState(storedApiKey);
      
      if (storedApiKey) {
        refreshServerStatus();
      }
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    // When API key changes, refresh server status
    if (key) {
      refreshServerStatus();
    } else {
      setActiveServer(null);
    }
  };

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });
  };

  const isAgentSelected = (agentId: string) => {
    return selectedAgents.includes(agentId);
  };

  const refreshServerStatus = async () => {
    if (!hasApiKey()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const apiKey = getApiKey();
      const { servers } = await listServers(apiKey);
      
      if (servers.length > 0) {
        // Get the first server's details
        const serverDetails = await getServerDetails(apiKey, servers[0].server_id);
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
      setError(err instanceof Error ? err.message : 'Failed to refresh server status');
      toast.error('Failed to refresh server status');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewServer = async () => {
    if (!hasApiKey() || selectedAgents.length === 0) {
      toast.error(
        !hasApiKey() 
          ? 'Please enter your API key first' 
          : 'Please select at least one agent'
      );
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // If there's an active server, delete it first
      if (activeServer) {
        await deleteServer(getApiKey(), activeServer.server_id);
      }
      
      // Create a new server with selected agents
      const newServer = await createServer(getApiKey(), selectedAgents);
      setActiveServer(newServer);
      toast.success('Server created successfully');
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
