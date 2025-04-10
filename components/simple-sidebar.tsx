"use client";

import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProvisioner } from "@/lib/provisioner-context";
import { Agent } from "@/lib/provisioner-context";
import { Code, Server, Wrench, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

interface AgentTool {
  name: string;
  description: string;
  parameters?: any;
}

export function SimpleSidebar() {
  const { setOpenMobile, state } = useSidebar();
  const { selectedAgents, activeServer } = useProvisioner();
  const [selectedAgentDetails, setSelectedAgentDetails] = useState<Array<Agent & { tools: AgentTool[] }>>([]);

  // Fetch agent details for selected agents
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const response = await fetch("/api/agents");
        const data = await response.json();
        const agents = data.agents;

        if (agents && typeof agents === "object") {
          const selectedAgentDetails = selectedAgents
            .filter(id => agents[id])
            .map(id => {
              const agent = agents[id];
              return {
                id,
                ...agent.metadata,
                tools: agent.tools || [],
              };
            });
          
          setSelectedAgentDetails(selectedAgentDetails);
        }
      } catch (error) {
        console.error("Failed to fetch agent details:", error);
      }
    };

    if (selectedAgents.length > 0) {
      fetchAgentDetails();
    } else {
      setSelectedAgentDetails([]);
    }
  }, [selectedAgents]);

  return (
    <Sidebar className="" collapsible="icon">
      <div className="absolute top-5 right-2 flex flex-row justify-end items-center">
        <SidebarToggle />
      </div>
      <SidebarHeader>
        <SidebarMenu className="">
          <div className="flex flex-row justify-between items-center">
            {state === "expanded" && (
              <Link
                href="/"
                onClick={() => {
                  setOpenMobile(false);
                }}
                className="flex flex-row gap-1 items-center p-2 py-4"
              >
                <Image
                  src="/images/logo.png"
                  alt="Heurist"
                  width={28}
                  height={28}
                />
                <span className="text-sm font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                  Heurist
                </span>
              </Link>
            )}
          </div>
          <Link
            href="/"
            onClick={() => {
              setOpenMobile(false);
            }}
            className="flex items-center font-medium border-t pt-2"
          >
            <SidebarMenuButton>
              <Users /> Agents
            </SidebarMenuButton>
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="custom-scrollbar">
        {activeServer && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Active Server</span>
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              ID: {activeServer.server_id}
            </div>
            <Separator className="my-2" />
          </div>
        )}

        {selectedAgentDetails.length > 0 ? (
          <div className="px-3 py-2">
            <h3 className="text-sm font-medium mb-2">Selected Agents</h3>
            <div className="space-y-4">
              {selectedAgentDetails.map((agent) => (
                <div key={agent.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                      {agent.name?.charAt(0) || 'A'}
                    </div>
                    <span className="text-sm font-medium">{agent.name}</span>
                  </div>
                  
                  {agent.tools && agent.tools.length > 0 && (
                    <div className="pl-8 space-y-2">
                      <h4 className="text-xs font-medium flex items-center gap-1">
                        <Wrench className="h-3 w-3" /> Tools
                      </h4>
                      <div className="space-y-2">
                        {agent.tools.map((tool, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Code className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs font-medium">{tool.function?.name || tool.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-4">
                              {tool.function?.description || tool.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-3 py-6 text-center">
            <p className="text-sm text-muted-foreground">No agents selected</p>
            <p className="text-xs text-muted-foreground mt-1">
              Select agents to see their tools
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
