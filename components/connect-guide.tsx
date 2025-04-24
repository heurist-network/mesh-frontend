'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Terminal,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Code,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProvisioner } from '@/lib/provisioner-context';
import { toast } from 'sonner';

const CLIENT_OPTIONS = [
  { value: 'auto', label: 'Auto-Detect (Recommended)', cliValue: '' },
  { value: 'claude', label: 'Claude Desktop', cliValue: 'claude' },
  { value: 'cursor', label: 'Cursor', cliValue: 'cursor' },
  { value: 'windsurf', label: 'Windsurf', cliValue: 'windsurf' },
  { value: 'vscode', label: 'VS Code', cliValue: 'vscode' },
  {
    value: 'vscode-insiders',
    label: 'VS Code Insiders',
    cliValue: 'vscode-insiders',
  },
];

export function ConnectGuide() {
  const { activeServer, apiKey } = useProvisioner();
  const [hasCopied, setHasCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState('auto');
  const [packageManager, setPackageManager] = useState<'npx' | 'pnpm'>('npx');

  // fix hydration issues by waiting for client-side render
  useEffect(() => {
    setIsClient(true);
  }, []);

  const extractServerId = (endpoint: string | undefined): string => {
    if (!endpoint) return '<SERVER_ID>';

    const match = endpoint.match(/tool([^\/]+)/);
    return match ? match[1] : '<SERVER_ID>';
  };

  const serverId = extractServerId(activeServer?.mcp_endpoint);
  const currentApiKey = apiKey;
  const isReady = activeServer && apiKey;

  const selectedClientInfo = useMemo(
    () =>
      CLIENT_OPTIONS.find((opt) => opt.value === selectedClient) ||
      CLIENT_OPTIONS[0],
    [selectedClient],
  );

  const buildCommandString = useCallback(
    (maskKey: boolean) => {
      const base =
        packageManager === 'npx'
          ? 'npx -y github:heurist-network/mcp-installer'
          : 'pnpm dlx github:heurist-network/mcp-installer';

      const sid = isClient ? serverId : '<SERVER_ID>';
      let key = isClient && currentApiKey ? currentApiKey : '<YOUR_API_KEY>';

      if (maskKey && isClient && currentApiKey) {
        key = `${currentApiKey.substring(0, 4)}••••••••${currentApiKey.substring(currentApiKey.length - 4)}`;
      }

      const clientArg = selectedClientInfo.cliValue
        ? ` ${selectedClientInfo.cliValue}`
        : '';
      return `${base} ${sid} ${key}${clientArg}`;
    },
    [packageManager, isClient, serverId, currentApiKey, selectedClientInfo],
  );

  const installCommand = useMemo(
    () => buildCommandString(false),
    [buildCommandString],
  );

  const displayCommand = useMemo(
    () => buildCommandString(true),
    [buildCommandString],
  );

  const handleCopy = () => {
    if (!isReady) {
      toast.error('Please complete Steps 1-3 first to generate the command.');
      return;
    }
    navigator.clipboard.writeText(installCommand);
    setHasCopied(true);
    toast.success('Command copied to clipboard!');
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500/5 via-card to-blue-500/5">
      <div className="absolute top-0 right-0 size-32 bg-blue-500/5 rounded-bl-full blur-2xl" />
      <div className="absolute bottom-0 left-0 size-24 bg-purple-500/5 rounded-tr-full blur-2xl opacity-50" />

      <CardHeader className="p-6 sm:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-full bg-gradient-to-br from-[#cdf138]/40 to-primary/20 flex items-center justify-center">
            <Terminal className="size-5 text-primary" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Step 4. Connect via CLI
          </CardTitle>
        </div>
        <CardDescription className="text-base text-muted-foreground/90 pl-[52px]">
          Use the command-line installer to quickly set up your MCP connection
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5 rounded-lg border border-border/70 p-5 bg-background/50 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 size-40 bg-gradient-to-br from-[#cdf138]/5 via-purple-500/5 to-blue-500/5 rounded-full blur-2xl" />
          <div className="absolute -left-4 -top-4 size-24 bg-gradient-to-br from-[#cdf138]/10 to-transparent rounded-full blur-3xl" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 z-10 relative">
            <div className="space-y-2">
              <label
                htmlFor="package-manager"
                className="text-sm font-medium text-muted-foreground pl-1"
              >
                Package Manager
              </label>
              <div className="flex gap-2" id="package-manager">
                <Button
                  variant={packageManager === 'npx' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPackageManager('npx')}
                  className="text-xs h-9 px-3"
                >
                  npx
                </Button>
                <Button
                  variant={packageManager === 'pnpm' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPackageManager('pnpm')}
                  className="text-xs h-9 px-3"
                >
                  pnpm
                </Button>
              </div>
            </div>

            <div className="space-y-2 w-full sm:w-auto sm:ml-auto">
              <label
                htmlFor="client-select-trigger"
                className="text-sm font-medium text-muted-foreground pl-1"
              >
                Client
              </label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger
                  id="client-select-trigger"
                  className="w-full sm:w-[240px] h-9"
                >
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_OPTIONS.map((client) => (
                    <SelectItem key={client.value} value={client.value}>
                      {client.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-2 relative z-10">
            <div className="relative group">
              <pre className="bg-black/30 border border-white/10 rounded-lg p-4 overflow-x-auto text-sm font-mono text-white/90 tracking-tight">
                <motion.div
                  className="absolute top-0 left-0 size-full opacity-10"
                  initial={{ backgroundPosition: '0% 0%' }}
                  animate={{ backgroundPosition: '100% 100%' }}
                  transition={{
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: 'reverse',
                  }}
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, transparent, #cdf138, transparent, #6366f1, transparent)',
                    backgroundSize: '400% 400%',
                  }}
                />
                <code className="relative z-10">{displayCommand}</code>
              </pre>

              <Button
                onClick={handleCopy}
                size="icon"
                className="absolute top-2.5 right-2.5 size-8 bg-[#cdf138]/90 hover:bg-[#cdf138] text-black rounded-md transition-all"
                disabled={!isReady}
              >
                {hasCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>

            {!isReady && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-orange-300 mt-2 pl-1 flex items-center gap-1.5"
              >
                <Sparkles className="size-3.5" />
                <span>
                  Complete Steps 1-3 first to generate your custom installation
                  command.
                </span>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 relative z-10">
            <Button
              className="rounded-full px-5 py-2 h-auto bg-gradient-to-r from-[#cdf138] to-[#b1e745] text-black hover:brightness-110 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCopy}
              disabled={!isReady}
            >
              <span>Copy Command</span>
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Code className="size-3.5" />
              Run in your terminal to install
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 pt-1 relative z-10">
            <p className="border-t border-border/40 pt-3">
              The installer will configure your MCP connection automatically. If
              you select Auto-Detect, it will scan for installed clients on your
              system.
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
