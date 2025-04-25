import Link from 'next/link';
import {
  Github,
  Home,
  MessageCircle,
  Send,
  BookOpen,
  Coins,
  TrendingUp,
  ChevronRight,
  FileText,
  ExternalLink,
  Star,
  Terminal,
  Server,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-gradient-to-b from-background to-background/80 pt-8 pb-6 relative overflow-hidden lg:-mx-6">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />

      <div className="container px-6 lg:px-10 mx-auto relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 mb-8">
          <div className="space-y-3 col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <Image src="/logo.png" alt="Heurist" width={24} height={24} />
              </div>
              <span className="text-lg font-semibold text-primary">
                Heurist
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building the future of AI agent infrastructure.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full size-8 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
              >
                <Link href="https://github.com/heurist-network" target="_blank">
                  <Github className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full size-8 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
              >
                <Link
                  href="https://discord.com/invite/heuristai"
                  target="_blank"
                >
                  <MessageCircle className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full size-8 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
              >
                <Link href="https://t.me/heurist_ai" target="_blank">
                  <Send className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full size-8 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
              >
                <Link href="https://heuristai.medium.com/" target="_blank">
                  <BookOpen className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold mb-2">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/heurist-network/heurist-agent-framework"
                  target="_blank"
                  className="text-sm font-medium text-primary flex items-center gap-1.5 group"
                >
                  <Github className="size-3.5" />
                  Agent Framework
                  <ChevronRight className="size-3 ml-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://docs.heurist.ai/"
                  target="_blank"
                  className="text-sm font-medium text-primary flex items-center gap-1.5 group"
                >
                  <FileText className="size-3.5" />
                  Documentation
                  <ChevronRight className="size-3 ml-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/heurist-network/mcp-cli"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 group"
                >
                  <Terminal className="size-3.5" />
                  MCP Installer
                  <ChevronRight className="size-3 ml-0.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/heurist-network/heurist-mesh-mcp-server"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 group"
                >
                  <Server className="size-3.5" />
                  MCP Server
                  <ChevronRight className="size-3 ml-0.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold mb-2">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://heurist.ai/"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 group"
                >
                  <Home className="size-3.5" />
                  Homepage
                  <ChevronRight className="size-3 ml-0.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.com/invite/heuristai"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 group"
                >
                  <MessageCircle className="size-3.5" />
                  Discord
                  <ChevronRight className="size-3 ml-0.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://t.me/heurist_ai"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 group"
                >
                  <Send className="size-3.5" />
                  Telegram
                  <ChevronRight className="size-3 ml-0.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/heurist-network"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 group"
                >
                  <Github className="size-3.5" />
                  GitHub
                  <ChevronRight className="size-3 ml-0.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold mb-2">Token</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://coinmarketcap.com/currencies/heurist-ai/"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 group"
                >
                  <Coins className="size-3.5" />
                  CoinMarketCap
                  <ChevronRight className="size-3 ml-0.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.coingecko.com/en/coins/heurist"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 group"
                >
                  <TrendingUp className="size-3.5" />
                  CoinGecko
                  <ChevronRight className="size-3 ml-0.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.heurist.ai/whitepaper"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 group"
                >
                  <ExternalLink className="size-3.5" />
                  Whitepaper
                  <ChevronRight className="size-3 ml-0.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://docs.heurist.ai/protocol-overview/tokenomics"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 group"
                >
                  <Star className="size-3.5" />
                  Tokenomics
                  <ChevronRight className="size-3 ml-0.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-4 mt-6 flex justify-center items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Heurist Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
