import Link from 'next/link';

import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-border p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Github className="size-4" />
            <Link
              href="https://github.com/heurist-network/heurist-agent-framework"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              heurist-agent-framework
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Github className="size-4" />
            <Link
              href="https://github.com/heurist-network/heurist-mesh-mcp-server"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              heurist-mesh-mcp-server
            </Link>
          </div>
        </div>
        <div className="flex gap-4">
          <Link
            href="https://heurist.ai/"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Homepage
          </Link>
          <Link
            href="https://discord.com/invite/heuristai"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Discord
          </Link>
          <Link
            href="https://t.me/heurist_ai"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Telegram
          </Link>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground mt-8">
        © {new Date().getFullYear()} Heurist Network
      </div>
    </footer>
  );
}
