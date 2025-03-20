"use client";
import { createContext, useContext, useState } from "react";
import type { Agent } from "@/components/agent-item";

type AgentContextType = {
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;
};

const AgentContext = createContext<AgentContextType>({
  selectedAgent: null,
  setSelectedAgent: () => {},
});

export const AgentProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  return (
    <AgentContext.Provider value={{ selectedAgent, setSelectedAgent }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => useContext(AgentContext);
