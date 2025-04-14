'use client';

import { useState } from 'react';
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
import { Loader2, ServerCrash, Server, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Step 3. Create a dedicated MCP server</CardTitle>
        <CardDescription>
          Create a server with your selected agents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeServer ? (
          <div className="rounded-md border p-4">
            <div className="flex items-center gap-4">
              <Server className="size-8 text-green-500" />
              <div className="flex-1">
                <h3 className="font-medium">Active Server</h3>
                <p className="text-sm text-muted-foreground">
                  Server ID: {activeServer.server_id}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  MCP Endpoint:{' '}
                  <code className="bg-muted p-1 rounded">
                    {activeServer.mcp_endpoint}
                  </code>
                </p>
                {activeServer.supported_agents && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Agents:{' '}
                    {Array.isArray(activeServer.supported_agents)
                      ? activeServer.supported_agents.join(', ')
                      : activeServer.supported_agents.split(',').join(', ')}
                  </p>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className={buttonVariants({
                      variant: 'destructive',
                      size: 'icon',
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
          <div className="rounded-md border border-dashed p-8 text-center">
            <ServerCrash className="mx-auto size-10 text-muted-foreground" />
            <h3 className="mt-2 font-medium">No Active Server</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create a server to get started
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCreateServer}
          disabled={isCreating || isLoading || selectedAgents.length === 0}
          className="w-full"
        >
          {isCreating || isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {activeServer ? 'Updating Server...' : 'Creating Server...'}
            </>
          ) : activeServer ? (
            'Update Server with Selected Agents'
          ) : (
            'Create Server'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
