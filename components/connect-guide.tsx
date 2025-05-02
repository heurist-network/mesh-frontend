'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Terminal,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { scrollToAgentSelection } from '@/lib/utils';

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
  const [packageManager, setPackageManager] = useState<'npx' | 'pnpm' | 'bunx'>(
    'npx',
  );
  const [copySuccess, setCopySuccess] = useState(false);

  // fix hydration issues by waiting for client-side render
  useEffect(() => {
    setIsClient(true);
  }, []);

  const extractServerId = (endpoint: string | undefined): string => {
    if (!endpoint) return '<SERVER_ID>';

    // return short server id as the url was too long
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
      let base: string;
      switch (packageManager) {
        case 'npx':
          base = 'npx -y heurist-mcp-cli';
          break;
        case 'pnpm':
          base = 'pnpm dlx heurist-mcp-cli';
          break;
        case 'bunx':
          base = 'bunx heurist-mcp-cli';
          break;
        default:
          base = 'npx -y heurist-mcp-cli'; // Default to npx
      }

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
    setCopySuccess(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);

    setTimeout(() => {
      setCopySuccess(false);
    }, 3000);
  };

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500/5 via-card to-blue-500/5">
      <div className="absolute top-0 right-0 size-32 bg-blue-500/5 rounded-bl-full blur-2xl" />
      <div className="absolute bottom-0 left-0 size-24 bg-purple-500/5 rounded-tr-full blur-2xl opacity-50" />

      <CardHeader className="p-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="size-8 sm:size-10 rounded-full bg-gradient-to-br from-[#cdf138]/40 to-primary/20 flex items-center justify-center shrink-0">
            <Terminal className="size-4 sm:size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              Quick Setup with CLI
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground/90 mt-1">
              Use the command-line installer to quickly set up your MCP
              connection
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border border-border/70 p-5 bg-background/50 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 size-40 bg-gradient-to-br from-[#cdf138]/5 via-purple-500/5 to-blue-500/5 rounded-full blur-2xl" />
          <div className="absolute -left-4 -top-4 size-24 bg-gradient-to-br from-[#cdf138]/10 to-transparent rounded-full blur-3xl" />

          <div className="bg-blue-500/10 rounded-lg border border-blue-400/30 p-3 mb-3 relative overflow-hidden mt-1">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,rgba(0,120,255,0.05)_0%,rgba(0,80,255,0.1)_5%,rgba(0,80,255,0)_60%)]" />
            <motion.div
              className="absolute -left-20 -top-20 size-40 bg-blue-400/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }}
            />
            <div className="flex items-start gap-3 relative z-10">
              <div className="mt-0.5 size-8 rounded-full bg-blue-400/20 flex items-center justify-center shrink-0">
                <AlertCircle className="size-4 text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-blue-400">
                  This Step is Optional
                </h4>
                <p className="text-xs leading-normal text-blue-300/90">
                  You can either use our CLI tool for automatic setup or
                  manually configure using the MCP Endpoint from Step 3.
                </p>
              </div>
            </div>
          </div>

          {!isReady && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 rounded-lg border border-amber-400/30 p-3 mb-3 relative overflow-hidden mt-5"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,rgba(255,214,0,0.05)_0%,rgba(255,122,0,0.1)_5%,rgba(255,122,0,0)_60%)]" />
              <motion.div
                className="absolute -left-20 -top-20 size-40 bg-amber-400/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                }}
              />
              <div className="flex items-start gap-3 relative z-10">
                <div className="mt-0.5 size-8 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="size-4 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-amber-400">Setup Required</h4>
                  <p className="text-xs leading-normal text-amber-300/90">
                    Complete Steps 1-3 first to generate your custom
                    installation command.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-amber-400 hover:text-amber-300 p-0 h-auto text-xs font-medium flex items-center gap-1 group"
                    onClick={() => scrollToAgentSelection()}
                  >
                    Go to previous steps
                    <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 z-10 relative mt-5">
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
                  npm
                </Button>
                <Button
                  variant={packageManager === 'bunx' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPackageManager('bunx')}
                  className="text-xs h-9 px-3"
                >
                  bun
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

          <div className="pt-2 relative z-10 mt-5">
            <div className="relative group">
              <pre
                onClick={handleCopy}
                className="bg-black/30 border border-white/10 rounded-lg p-4 overflow-x-auto text-sm font-mono text-white/90 tracking-tight cursor-pointer select-none group"
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                }}
              >
                <motion.div
                  className="absolute top-0 left-0 size-full opacity-10 pointer-events-none"
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
                {copySuccess && (
                  <motion.div
                    className="absolute inset-0 bg-[#cdf138]/10 z-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <code className="relative z-10 whitespace-pre-wrap break-all sm:break-normal pointer-events-none">
                  {displayCommand}
                </code>

                <AnimatePresence>
                  {copySuccess && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      transition={{ duration: 0.5, type: 'spring' }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-[#cdf138] text-black font-medium px-4 py-2 rounded-full flex items-center gap-2">
                          <Check className="size-4" />
                          <span>Copied!</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </pre>

              <Button
                onClick={handleCopy}
                size="icon"
                className="hidden sm:flex absolute top-2.5 right-2.5 size-8 bg-[#cdf138]/90 hover:bg-[#cdf138] text-black rounded-md transition-all"
                disabled={!isReady}
              >
                {hasCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 relative z-10 mt-5">
            <Button
              className="w-full sm:w-auto rounded-full px-5 py-2 h-auto bg-gradient-to-r from-[#cdf138] to-[#b1e745] text-black hover:brightness-110 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCopy}
              disabled={!isReady}
            >
              <AnimatePresence mode="wait">
                {hasCopied ? (
                  <motion.div
                    key="copied"
                    className="flex items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="mr-2 size-4" />
                    <span>Copied!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    className="flex items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Copy Command</span>
                    <ArrowRight className="ml-2 size-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 w-full sm:w-auto">
              <ExternalLink className="size-3.5" />
              <span>Run in your terminal to install</span>
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 pt-1 relative z-10 mt-5">
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
