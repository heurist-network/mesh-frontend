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
import {
  Loader2,
  Server,
  Trash2,
  ServerOff,
  AlertCircle,
  Plus,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

export function ServerManagement() {
  const {
    selectedAgents,
    activeServer,
    isLoading,
    createNewServer,
    deleteActiveServer,
    hasApiKey,
    serverAgents,
    agentsToAdd,
    agentsToRemove,
  } = useProvisioner();
  const [isCreating, setIsCreating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasAgentChanges = useMemo(() => {
    return agentsToAdd.length > 0 || agentsToRemove.length > 0;
  }, [agentsToAdd, agentsToRemove]);

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

  const handleCopyEndpoint = () => {
    if (!activeServer?.mcp_endpoint) {
      toast.error('No endpoint available to copy');
      return;
    }

    navigator.clipboard.writeText(activeServer.mcp_endpoint);
    setCopySuccess(true);

    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
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
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Server className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                Step 3. Create a dedicated MCP server
              </CardTitle>
              <Badge
                variant="outline"
                className="text-xs bg-green-500/10 text-green-400 border-green-500/30 shrink-0"
              >
                Final Step
              </Badge>
            </div>
            <CardDescription className="text-base text-muted-foreground/90 mt-1">
              Create a server with your selected agents to access them via MCP
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pt-0 pb-6 relative z-10">
        {activeServer ? (
          <motion.div
            className="rounded-lg border bg-card/50 p-6 backdrop-blur-sm relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,rgba(205,241,56,0.03)_0%,rgba(0,255,100,0.05)_5%,rgba(0,255,100,0)_60%)]" />

            <div className="flex flex-col md:flex-row md:items-center gap-4 relative z-10">
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
                    {hasAgentChanges && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs px-2 py-0 h-5 border-amber-500/20 text-amber-400 bg-amber-500/10"
                      >
                        Changes Pending
                      </Badge>
                    )}
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

                  <div className="border border-green-500/20 rounded-md bg-green-500/5 p-3 mt-2 relative group overflow-hidden hover:border-green-500/30 transition-colors">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,rgba(205,241,56,0.03)_0%,rgba(0,255,100,0.03)_50%,transparent_100%)]" />
                    <AnimatePresence>
                      {copySuccess && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-green-500/10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.2 }}
                          transition={{ duration: 0.4, type: 'spring' }}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="bg-green-500 text-black font-medium px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                              <Check className="size-4" />
                              <span>Copied!</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div
                      className={`flex flex-col gap-1 ${copySuccess ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 relative z-10`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-400">
                          MCP Endpoint:
                        </span>
                        <Button
                          onClick={handleCopyEndpoint}
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        >
                          {copySuccess ? (
                            <Check className="mr-1.5 size-3.5" />
                          ) : (
                            <Copy className="mr-1.5 size-3.5" />
                          )}
                          Copy URL
                        </Button>
                      </div>
                      <code
                        className="text-sm bg-background/60 px-2 py-1.5 rounded truncate block cursor-pointer hover:bg-background/80 transition-colors"
                        onClick={handleCopyEndpoint}
                      >
                        {activeServer.mcp_endpoint}
                      </code>
                    </div>
                  </div>
                </div>

                {activeServer.supported_agents && (
                  <div className="pt-1">
                    <Separator className="mt-1 mb-4" />
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        Agents:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {serverAgents.map((agent) => {
                          const isRemoved = agentsToRemove.includes(agent);
                          return (
                            <Badge
                              key={`agent-${agent}`}
                              variant="secondary"
                              className={`text-xs ${isRemoved ? 'line-through opacity-50 border-red-500/30 bg-red-500/10' : ''}`}
                            >
                              {agent}
                              {isRemoved && (
                                <X className="ml-1 size-3 text-red-500" />
                              )}
                            </Badge>
                          );
                        })}

                        {agentsToAdd.length > 0 &&
                          agentsToAdd.map((agent) => (
                            <Badge
                              key={`new-agent-${agent}`}
                              variant="outline"
                              className="text-xs border-green-500/30 bg-green-500/10 text-green-500"
                            >
                              {agent}
                              <Plus className="ml-1 size-3 text-green-500" />
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
                    disabled={isDeleting}
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
                      onClick={async () => {
                        setIsDeleting(true);
                        try {
                          await deleteActiveServer();
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="rounded-lg border border-dashed p-10 text-center bg-card/50 backdrop-blur-sm relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-muted/40 p-4 rounded-full mx-auto w-fit">
              <ServerOff className="size-12 text-muted-foreground/60" />
            </div>
            <h3 className="mt-4 font-medium text-lg">No Active Server</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Create a server with your selected agents to start using them
              through the Model Context Protocol
            </p>
          </motion.div>
        )}
      </CardContent>

      <CardFooter className="px-6 sm:px-8 pb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
        <AnimatePresence>
          {activeServer && !hasAgentChanges && selectedAgents.length > 0 && (
            <motion.div
              className="w-full sm:flex-1 bg-blue-500/10 rounded-lg border border-blue-500/20 p-3 flex items-center gap-3 text-xs text-blue-300/90 overflow-hidden"
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: '500px' }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <AlertCircle className="size-4 text-blue-400 shrink-0" />
              <span>
                Your current agent selection matches the active server. Add or
                remove agents to update.
              </span>
            </motion.div>
          )}
          {activeServer && hasAgentChanges && (
            <motion.div
              className="w-full sm:flex-1 bg-amber-500/10 rounded-lg border border-amber-500/20 p-3 flex items-center gap-3 text-xs text-amber-300/90 overflow-hidden relative"
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: '500px' }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <AlertCircle className="size-4 text-amber-400 shrink-0" />
              <span>
                Click &ldquo;Update Server&rdquo; to apply your agent changes.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          onClick={handleCreateServer}
          disabled={isButtonDisabled}
          className={`w-full sm:w-auto rounded-full px-5 py-2.5 size-auto text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0 sm:ml-auto transition-all relative overflow-hidden ${
            activeServer && hasAgentChanges
              ? 'bg-amber-500 text-black hover:bg-amber-600'
              : 'bg-[#cdf138] text-black hover:brightness-110'
          }`}
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
