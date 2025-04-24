'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useProvisioner } from '@/lib/provisioner-context';
import { scrollToAgentSelection } from '@/lib/utils';
import {
  Code,
  Server,
  Wrench,
  Users,
  ListFilter,
  ChevronRight,
  Plus,
  X,
  CheckCircle,
  ArrowDown,
  SidebarClose,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useMemo } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';

interface AgentTool {
  name: string;
  description: string;
  parameters?: any;
  function?: {
    name: string;
    description: string;
  };
}

export function RealSidebar() {
  const { setOpenMobile, state, toggleSidebar } = useSidebar();
  const {
    selectedAgents,
    activeServer,
    allAgents,
    allAgentsArray,
    toggleAgentSelection,
  } = useProvisioner();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const agentSectionRef = useRef<HTMLDivElement>(null);

  const selectedAgentDetails = useMemo(() => {
    if (!allAgents) {
      setIsLoading(true);
      return [];
    }

    setIsLoading(false);

    return selectedAgents
      .filter((id) => allAgents[id])
      .map((id) => {
        const agent = allAgents[id];
        return {
          id,
          ...agent.metadata,
          tools: agent.tools || [],
        };
      });
  }, [selectedAgents, allAgents]);

  const showEmptyState = !isLoading && selectedAgentDetails.length === 0;
  const showAgentList = !isLoading && selectedAgentDetails.length > 0;

  const toggleExpandedAgent = (id: string) => {
    setExpandedAgent(expandedAgent === id ? null : id);
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 flex items-center px-3 border-b border-sidebar-border bg-gradient-to-r from-sidebar-accent/20 to-transparent">
        <SidebarMenu className="w-full">
          <div className="flex flex-row justify-between items-center">
            {state === 'expanded' && (
              <>
                <Link
                  href="/"
                  onClick={() => {
                    setOpenMobile(false);
                  }}
                  className="flex flex-row gap-1 items-center py-2"
                >
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <Image
                      src="/logo.png"
                      alt="Heurist"
                      width={24}
                      height={24}
                      className="min-w-6"
                      priority
                    />
                  </div>
                  <span className="text-base font-semibold px-2 text-primary">
                    Heurist
                  </span>
                </Link>
                <div className="hidden md:flex">
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="p-1 rounded-md hover:bg-sidebar-accent/30 transition-colors"
                    aria-label="Toggle sidebar"
                  >
                    <SidebarClose className="size-4 text-primary" />
                  </button>
                </div>
              </>
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
          <SidebarMenuButton className="w-full justify-start gap-3 h-10 bg-sidebar-accent/20 hover:bg-sidebar-accent/30">
            <Users className="size-4 text-primary" />
            <span className="font-medium">Agent Library</span>
          </SidebarMenuButton>
        </Link>
      </div>

      <SidebarContent className="p-0 flex flex-col overflow-hidden">
        {activeServer && (
          <div className="p-3 border-b border-sidebar-border bg-gradient-to-r from-green-500/5 to-transparent">
            <div className="flex items-center gap-2">
              <div className="bg-green-500/10 p-1.5 rounded-md">
                <Server className="size-4 text-green-500" />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Server</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-5 border-green-500/20 text-green-400 bg-green-500/10"
                  >
                    Online
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {activeServer.server_id.substring(0, 12)}...
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="p-3 flex-1" ref={agentSectionRef}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-primary/80">
              <ListFilter className="size-4" />
              <h3 className="text-sm font-medium">Selected Agents</h3>
            </div>
            <Badge
              variant={selectedAgentDetails.length > 0 ? 'default' : 'outline'}
              className="text-[10px] px-1.5 py-0 h-5"
            >
              {selectedAgentDetails.length}
            </Badge>
          </div>

          {isLoading && selectedAgentDetails.length === 0 && (
            <div className="space-y-3 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="bg-muted/30 rounded-md p-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-8 rounded-md" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-2.5 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {showAgentList && (
              <motion.div
                key="agent-list"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <ScrollArea className="flex-1 h-[calc(100vh-220px)] overflow-hidden">
                  <div className="space-y-3">
                    {selectedAgentDetails.map((agent) => (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border border-border/50 rounded-md overflow-hidden"
                      >
                        <div
                          className="w-full text-left p-2 flex items-center gap-2 cursor-pointer hover:bg-muted/30"
                          onClick={() => toggleExpandedAgent(agent.id)}
                          role="button"
                        >
                          <div className="size-9 shrink-0 rounded-md flex items-center justify-center overflow-hidden border border-border/30">
                            {agent.image_url ? (
                              <Image
                                src={agent.image_url}
                                alt={agent.name}
                                width={36}
                                height={36}
                                className="size-full object-cover"
                                priority
                              />
                            ) : (
                              <div className="size-full bg-primary/5 flex items-center justify-center text-sm font-medium text-primary">
                                {agent.name?.charAt(0) || 'A'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <h4 className="text-sm font-medium truncate flex-1">
                                {agent.name}
                              </h4>
                              <ChevronRight
                                className={`size-4 text-muted-foreground transition-transform ${expandedAgent === agent.id ? 'rotate-90' : ''}`}
                              />
                              <div
                                className="size-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted/50 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAgentSelection(agent.id);
                                }}
                                role="button"
                              >
                                <X className="size-3" />
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              {agent.tags.slice(0, 2).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="px-1 py-0 h-4 text-[10px] bg-secondary/40"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {agent.tags.length > 2 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{agent.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedAgent === agent.id &&
                            agent.tools &&
                            agent.tools.length > 0 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-border/50 bg-muted/20"
                              >
                                <div className="p-2 pt-1.5">
                                  <div className="flex items-center gap-1 py-1 text-xs font-medium text-primary/80">
                                    <Wrench className="size-3" />
                                    <span>Tools ({agent.tools.length})</span>
                                  </div>
                                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                                    {agent.tools.map(
                                      (tool: AgentTool, index: number) => (
                                        <div
                                          key={tool.function?.name || tool.name}
                                          className="rounded border border-border/30 bg-background p-1.5"
                                        >
                                          <div className="flex items-center gap-1.5">
                                            <Code className="size-3 text-primary/70" />
                                            <span className="text-xs font-medium truncate">
                                              {tool.function?.name || tool.name}
                                            </span>
                                          </div>
                                          <p className="text-[10px] mt-1 text-muted-foreground leading-tight line-clamp-2">
                                            {tool.function?.description ||
                                              tool.description}
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}

            {showEmptyState && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className={`bg-gradient-to-br from-muted/30 to-transparent rounded-lg border border-dashed border-muted flex flex-col ${
                  activeServer
                    ? 'h-[calc(100vh-335px)] md:h-[calc(100vh-250px)]'
                    : 'h-[calc(100vh-265px)] md:h-[calc(100vh-190px)]'
                }`}
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="mb-3 bg-primary/5 p-3 rounded-full"
                  >
                    <Plus className="size-5 text-primary/60" />
                  </motion.div>
                  <motion.h4
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                    className="text-sm font-medium mb-1"
                  >
                    No agents selected
                  </motion.h4>
                  <motion.p
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="text-xs text-muted-foreground mb-4 max-w-[200px]"
                  >
                    Add agents to your server to see their capabilities here
                  </motion.p>
                  <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary flex items-center"
                      onClick={() => scrollToAgentSelection(setOpenMobile)}
                    >
                      Browse Agents <ArrowDown className="ml-1 size-3" />
                    </Button>
                  </motion.div>
                </div>
                <div className="p-4 border-t border-dashed border-muted bg-muted/20">
                  <div className="text-xs text-center">
                    <div className="flex items-center justify-center gap-1 mb-1 text-muted-foreground">
                      <CheckCircle className="size-3.5 text-green-500" />
                      <span>Step 1: Configure server</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-primary font-medium">
                      <ArrowDown className="size-3.5 animate-bounce" />
                      <span>Step 2: Select agents</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
