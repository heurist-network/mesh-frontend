"use client";
import { createContext, useContext, useState } from "react";

type AgentContextType = {
  selectedAgent: any | null;
  setSelectedAgent: (agent: any | null) => void;
};

const AgentContext = createContext<AgentContextType>({
  selectedAgent: null,
  setSelectedAgent: () => {},
});

export const AgentProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  return (
    <AgentContext.Provider value={{ selectedAgent, setSelectedAgent }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => useContext(AgentContext);
