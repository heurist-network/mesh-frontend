'use client';

import { SidebarToggle } from '@/components/sidebar-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useProvisioner } from '@/lib/provisioner-context';
import type { Agent } from '@/lib/provisioner-context';
import {
  Code,
  Server,
  Wrench,
  Users,
  BookOpen,
  ListFilter,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { useEffect, useState, useRef } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentTool {
  name: string;
  description: string;
  parameters?: any;
}

export function SimpleSidebar() {
  const { setOpenMobile, state } = useSidebar();
  const { selectedAgents, activeServer } = useProvisioner();
  const [selectedAgentDetails, setSelectedAgentDetails] = useState<
    Array<Agent & { tools: AgentTool[] }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const prevSelectedAgentsRef = useRef<string[]>([]);

  // Optimize agent details fetching to reduce delay
  useEffect(() => {
    // Check if selected agents changed to avoid unnecessary fetches
    const selectedAgentsChanged =
      selectedAgents.length !== prevSelectedAgentsRef.current.length ||
      selectedAgents.some((id) => !prevSelectedAgentsRef.current.includes(id));

    // Only fetch if there's an actual change
    if (selectedAgentsChanged) {
      const fetchAgentDetails = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('/api/agents');
          const data = await response.json();
          const agents = data.agents;

          if (agents && typeof agents === 'object') {
            const selectedAgentDetails = selectedAgents
              .filter((id) => agents[id])
              .map((id) => {
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
          console.error('Failed to fetch agent details:', error);
        } finally {
          setIsLoading(false);
        }
      };

      if (selectedAgents.length > 0) {
        fetchAgentDetails();
      } else {
        setSelectedAgentDetails([]);
        setIsLoading(false);
      }

      // Update ref to current selected agents
      prevSelectedAgentsRef.current = [...selectedAgents];
    }
  }, [selectedAgents]);

  return (
    <Sidebar className="border-r border-sidebar-border" collapsible="icon">
      <div className="absolute top-5 right-2 flex flex-row justify-end items-center z-10">
        <SidebarToggle />
      </div>

      <SidebarHeader className="h-16 flex items-center px-3 border-b border-sidebar-border bg-gradient-to-r from-sidebar-accent/40 to-transparent">
        <SidebarMenu className="w-full">
          <div className="flex flex-row justify-between items-center">
            {state === 'expanded' && (
              <Link
                href="/"
                onClick={() => {
                  setOpenMobile(false);
                }}
                className="flex flex-row gap-1 items-center py-2"
              >
                <div className="bg-primary/10 p-1.5 rounded-md">
                  <Image
                    src="/images/logo.png"
                    alt="Heurist"
                    width={24}
                    height={24}
                    className="min-w-6"
                  />
                </div>
                <span className="text-base font-semibold px-2 text-primary">
                  Heurist
                </span>
              </Link>
            )}
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <div className="p-3 border-b border-sidebar-border">
        <Link
          href="/"
          onClick={() => {
            setOpenMobile(false);
          }}
          className="flex items-center w-full"
        >
          <SidebarMenuButton className="w-full justify-start gap-3 h-10 bg-sidebar-accent/30 hover:bg-sidebar-accent/50">
            <Users className="size-4 text-primary" />
            <span className="font-medium">Agent Library</span>
          </SidebarMenuButton>
        </Link>
      </div>

      <SidebarContent className="custom-scrollbar p-0">
        {activeServer && (
          <div className="p-4 border-b border-sidebar-border bg-gradient-to-r from-green-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-500/10 p-1.5 rounded-full">
                <Server className="size-4 text-green-500" />
              </div>
              <span className="text-sm font-medium">Active Server</span>
              <Badge
                variant="outline"
                className="ml-auto text-[10px] px-1.5 py-0 h-5 border-green-500/20 text-green-400 bg-green-500/10"
              >
                Online
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-1 pl-9">
              <span className="font-mono">
                {activeServer.server_id.substring(0, 12)}...
              </span>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListFilter className="size-4 text-primary/80" />
              <h3 className="text-sm font-medium">Selected Agents</h3>
            </div>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
              {selectedAgentDetails.length}
            </Badge>
          </div>

          {isLoading ? (
            <div className="space-y-4 px-1 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="pl-8 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-2 w-32" />
                      </div>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          ) : selectedAgentDetails.length > 0 ? (
            <AnimatePresence>
              <div className="space-y-4 px-1">
                {selectedAgentDetails.map((agent) => (
                  <motion.div
                    key={agent.id}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary`}
                      >
                        {agent.name?.charAt(0) || 'A'}
                      </div>
                      <span className="text-sm font-medium">{agent.name}</span>
                      <Badge
                        variant="outline"
                        className="ml-auto text-[10px] px-1.5 py-0 h-5"
                      >
                        {agent.tags[0]}
                      </Badge>
                    </div>

                    {agent.tools && agent.tools.length > 0 && (
                      <div className="pl-8 space-y-2">
                        <h4 className="text-xs font-medium flex items-center gap-1 text-primary/80">
                          <Wrench className="size-3" /> Tools
                        </h4>
                        <div className="space-y-3">
                          {agent.tools.map((tool, index) => (
                            <div
                              key={tool.function?.name || tool.name}
                              className="space-y-1 group"
                            >
                              <div className="flex items-center gap-1.5">
                                <div className="size-3 rounded-full bg-sidebar-accent/50 flex items-center justify-center">
                                  <Code className="size-2 text-primary/70" />
                                </div>
                                <span className="text-xs font-medium">
                                  {tool.function?.name || tool.name}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground pl-4.5 leading-tight">
                                {(
                                  tool.function?.description || tool.description
                                )?.substring(0, 60)}
                                {(
                                  tool.function?.description || tool.description
                                )?.length > 60
                                  ? '...'
                                  : ''}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator className="my-3" />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <div className="py-6 text-center bg-sidebar-accent/10 rounded-lg">
              <div className="size-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-primary/5">
                <BookOpen className="size-5 text-primary/40" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                No agents selected
              </p>
              <p className="text-xs text-muted-foreground mt-1 px-4">
                Select agents to see their capabilities
              </p>
              <Button
                variant="link"
                size="sm"
                className="mt-3 text-xs text-primary"
                asChild
              >
                <Link href="/" onClick={() => setOpenMobile(false)}>
                  Browse Agent Library <ExternalLink className="ml-1 size-3" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
