'use client';

import { useState, useMemo } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useProvisioner } from '@/lib/provisioner-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Server, Trash2, ServerOff } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export function ServerManagement() {
  const {
    selectedAgents,
    activeServer,
    isLoading,
    createNewServer,
    deleteActiveServer,
    hasApiKey,
  } = useProvisioner();
  const [isCreating, setIsCreating] = useState(false);

  // Check if the current agent selection is different from the active server's agents
  const hasAgentChanges = useMemo(() => {
    if (!activeServer || !activeServer.supported_agents) {
      // If no active server or it has no agents listed, any selection is a change
      return selectedAgents.length > 0;
    }

    const serverAgents = (
      Array.isArray(activeServer.supported_agents)
        ? activeServer.supported_agents
        : activeServer.supported_agents.split(',')
    )
      .map((a) => a.trim())
      .filter(Boolean);

    const sortedSelected = [...selectedAgents].sort();
    const sortedServer = [...serverAgents].sort();

    return JSON.stringify(sortedSelected) !== JSON.stringify(sortedServer);
  }, [selectedAgents, activeServer]);

  const handleCreateServer = async () => {
    if (selectedAgents.length === 0) {
      toast.error('Please select at least one agent');
      return;
    }

    if (!hasApiKey()) {
      toast.error('Please enter your API key first');
      return;
    }

    setIsCreating(true);
    try {
      await createNewServer();
    } finally {
      setIsCreating(false);
    }
  };

  const isButtonDisabled = useMemo(() => {
    if (isCreating || isLoading) return true;
    if (selectedAgents.length === 0) return true;
    if (activeServer) return !hasAgentChanges;
    return false;
  }, [isCreating, isLoading, selectedAgents, activeServer, hasAgentChanges]);

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card/80 to-card">
      <CardHeader className="p-6 sm:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Server className="size-5 text-primary" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Step 3. Create a dedicated MCP server
          </CardTitle>
        </div>
        <CardDescription className="text-base text-muted-foreground/90 pl-[52px]">
          Create a server with your selected agents to access them via MCP
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pt-0 pb-6">
        {activeServer ? (
          <div className="rounded-lg border bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full shrink-0">
                <Server className="size-8 text-green-500" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    Active Server
                    <Badge
                      variant="outline"
                      className="ml-2 text-xs px-2 py-0 h-5 border-green-500/20 text-green-400 bg-green-500/10"
                    >
                      Online
                    </Badge>
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Server ID:
                    </span>
                    <code className="text-sm bg-background/60 px-2 py-1 rounded">
                      {activeServer.server_id}
                    </code>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      MCP Endpoint:
                    </span>
                    <code className="text-sm bg-background/60 px-2 py-1 rounded truncate max-w-xs sm:max-w-md">
                      {activeServer.mcp_endpoint}
                    </code>
                  </div>
                </div>

                {activeServer.supported_agents && (
                  <div className="pt-1">
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        Agents:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(Array.isArray(activeServer.supported_agents)
                          ? activeServer.supported_agents
                          : activeServer.supported_agents.split(',')
                        ).map((agent, index) => (
                          <Badge
                            key={`agent-${agent.trim()}-${index}`}
                            variant="secondary"
                            className="text-xs"
                          >
                            {agent.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'icon',
                      className:
                        'shrink-0 h-10 w-10 border-destructive/30 text-destructive hover:bg-destructive/10',
                    })}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Server</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this server? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteActiveServer}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center bg-card/50 backdrop-blur-sm">
            <div className="bg-muted/40 p-4 rounded-full mx-auto w-fit">
              <ServerOff className="size-12 text-muted-foreground/60" />
            </div>
            <h3 className="mt-4 font-medium text-lg">No Active Server</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Create a server with your selected agents to start using them
              through the Model Context Protocol
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 sm:px-8 pb-6">
        <Button
          onClick={handleCreateServer}
          disabled={isButtonDisabled}
          className="rounded-full px-5 py-2 h-auto bg-[#cdf138] text-black hover:brightness-110 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ml-auto w-full sm:w-auto"
        >
          {isCreating || isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 size-4 animate-spin text-black/70" />
              <span>
                {activeServer ? 'Updating Server...' : 'Creating Server...'}
              </span>
            </div>
          ) : activeServer ? (
            'Update Server'
          ) : (
            'Create Server'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
