import Link from 'next/link';
import { Github, ExternalLink, Home, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-gradient-to-b from-background to-background/80 pt-12 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <Image
                  src="/images/logo.png"
                  alt="Heurist"
                  width={24}
                  height={24}
                />
              </div>
              <span className="text-lg font-semibold text-primary">
                Heurist
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building the future of AI agent infrastructure.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full size-9"
              >
                <Link href="https://github.com/heurist-network" target="_blank">
                  <Github className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="rounded-full size-9"
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
                className="rounded-full size-9"
              >
                <Link href="https://t.me/heurist_ai" target="_blank">
                  <Send className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/heurist-network/heurist-agent-framework"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5"
                >
                  <Github className="size-3.5" />
                  Agent Framework
                  <ExternalLink className="size-3 ml-0.5 opacity-70" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/heurist-network/heurist-mesh-mcp-server"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5"
                >
                  <Github className="size-3.5" />
                  MCP Server
                  <ExternalLink className="size-3 ml-0.5 opacity-70" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://heurist.ai/"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5"
                >
                  <Home className="size-3.5" />
                  Homepage
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.com/invite/heuristai"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5"
                >
                  <MessageCircle className="size-3.5" />
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="https://t.me/heurist_ai"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5"
                >
                  <Send className="size-3.5" />
                  Telegram
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-6 mt-8 flex justify-center items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Heurist Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
